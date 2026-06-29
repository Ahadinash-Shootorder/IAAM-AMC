const { execSync } = require('child_process');

// Fallback to local SQLite database if DATABASE_URL is not set, is empty, or doesn't start with file:
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '' || !process.env.DATABASE_URL.startsWith('file:')) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

console.log('[Build] Using DATABASE_URL:', process.env.DATABASE_URL);

try {
  const env = { ...process.env, NEXT_TELEMETRY_DISABLED: '1', PORT: '0' };
  console.log('[Build] Pushing database schema...');
  execSync('npx prisma db push', { stdio: 'inherit', env });
  
  console.log('[Build] Seeding database with initial content...');
  execSync('node prisma/seed.js', { stdio: 'inherit', env });
  
  console.log('[Build] Building Next.js application...');
  execSync('npx next build', { stdio: 'inherit', env });
} catch (error) {
  console.error('[Build] Build failed:', error);
  process.exit(1);
}
