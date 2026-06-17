import prisma from './prisma';

export async function logActivity(adminEmail, action, details = null) {
  try {
    await prisma.activityLog.create({
      data: {
        admin: adminEmail || 'Unknown',
        action,
        details: typeof details === 'string' ? details : JSON.stringify(details),
      },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}
