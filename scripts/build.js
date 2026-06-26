const { execSync } = require('child_process');

// Fallback to local SQLite database if DATABASE_URL is not set or is empty
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '') {
  process.env.DATABASE_URL = 'file:./dev.db';
}

console.log('[Build] Using DATABASE_URL:', process.env.DATABASE_URL);

try {
  console.log('[Build] Pushing database schema...');
  execSync('npx prisma db push', { stdio: 'inherit', env: { ...process.env } });
  
  console.log('[Build] Building Next.js application...');
  execSync('npx next build', { stdio: 'inherit', env: { ...process.env } });
} catch (error) {
  console.error('[Build] Build failed:', error);
  process.exit(1);
}
