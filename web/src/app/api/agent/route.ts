import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function POST(request: Request) {
  try {
    // We execute the CLI agent script located in the parent directory.
    // This ensures we keep the Node.js CLI logic completely intact.
    const projectRoot = path.resolve(process.cwd(), '..');

    return new Promise((resolve) => {
      exec('npm start', { cwd: projectRoot }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Agent Execution Error: ${error.message}`);
          resolve(NextResponse.json({ success: false, error: error.message, details: stderr }, { status: 500 }));
          return;
        }

        // We will parse the stdout for the specific outputs we want to display
        // The output looks like:
        // Found Trend: "..."
        // Generated Script: ...
        // Vector Dimension Length: 1536
        
        let trend = "No trend found.";
        let script = "No script generated.";
        let vectorized = false;

        const trendMatch = stdout.match(/Found Trend:\s*"([^"]+)"/);
        if (trendMatch) trend = trendMatch[1];

        const scriptMatch = stdout.match(/Generated Script:\s*([^\n]+)/);
        if (scriptMatch) script = scriptMatch[1];

        if (stdout.includes('Embeddings Generated Successfully!')) {
          vectorized = true;
        }

        resolve(NextResponse.json({
          success: true,
          data: {
            trend,
            script,
            vectorized,
            rawOutput: stdout
          }
        }));
      });
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
