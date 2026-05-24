import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = body.query;

    if (!query) {
      return NextResponse.json({ success: false, error: 'Query is required' }, { status: 400 });
    }

    const projectRoot = path.resolve(process.cwd(), '..');
    
    // Safely escape the query to prevent command injection
    const safeQuery = query.replace(/"/g, '\\"');

    return new Promise((resolve) => {
      exec(`npx tsx src/chat.ts "${safeQuery}"`, { cwd: projectRoot }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Chat Execution Error: ${error.message}`);
          console.error(`Stderr: ${stderr}`);
          resolve(NextResponse.json({ success: false, error: error.message }, { status: 500 }));
          return;
        }

        try {
          // The script outputs a clean JSON string
          const lines = stdout.split('\n');
          const jsonString = lines.find(line => line.startsWith('{') && line.endsWith('}'));
          
          if (!jsonString) {
             throw new Error('No JSON found in output');
          }
          
          const result = JSON.parse(jsonString);
          
          if (result.error) {
            resolve(NextResponse.json({ success: false, error: result.error }, { status: 500 }));
          } else {
            resolve(NextResponse.json({ success: true, data: result }));
          }
        } catch (parseError: any) {
          console.error('Failed to parse agent JSON:', stdout);
          resolve(NextResponse.json({ success: false, error: 'Invalid response from agent' }, { status: 500 }));
        }
      });
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
