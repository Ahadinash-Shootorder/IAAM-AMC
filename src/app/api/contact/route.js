import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const query = await prisma.contactQuery.create({
      data: {
        name,
        email,
        subject,
        message
      }
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully', id: query.id });
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
