import cron from 'node-cron';
import { runContentCreatorWorkflow } from './workflows/content_creator';

console.log('Starting Ace Data Cloud Autonomous Daemon...');
console.log('The daemon will wake up every hour to autonomously research AI news, vectorise it, and expand its persistent memory bank.');

// Run once immediately on startup
console.log('\n[Daemon] Triggering initial execution...');
runContentCreatorWorkflow().catch(e => console.error('[Daemon] Execution failed:', e));

// Schedule to run at the start of every hour (0 * * * *)
// We use every hour to demonstrate high utility without burning through API limits too fast
cron.schedule('0 * * * *', async () => {
    console.log('\n=============================================');
    console.log(`[Daemon] Waking up for scheduled run at ${new Date().toISOString()}`);
    console.log('=============================================');
    
    try {
        await runContentCreatorWorkflow();
        console.log('[Daemon] Scheduled execution completed successfully.');
    } catch (error) {
        console.error('[Daemon] Scheduled execution failed:', error);
    }
});
