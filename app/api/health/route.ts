import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { transporter } from '@/lib/nodemailer';

export async function GET() {
  const startedAt = Date.now();

  // DB status
  let dbOk = false;
  let dbError: string | null = null;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch (e) {
    dbError = e instanceof Error ? e.message : 'Unknown DB error';
  }

  // Mail status (non-blocking, time-limited)
  let mailOk = false;
  let mailError: string | null = null;
  try {
    // Nodemailer verify can hang on some providers; wrap with timeout
    const verifyPromise = transporter.verify();
    const timeout = new Promise((_res, rej) => setTimeout(() => rej(new Error('Mail verify timeout')), 4000));
    await Promise.race([verifyPromise, timeout]);
    mailOk = true;
  } catch (e) {
    mailError = e instanceof Error ? e.message : 'Unknown mail error';
  }

  const durationMs = Date.now() - startedAt;

  return NextResponse.json({
    ok: dbOk && mailOk,
    durationMs,
    db: { ok: dbOk, error: dbError },
    mail: { ok: mailOk, error: mailError },
    env: {
      node: process.version,
      hasMailCreds: Boolean(process.env.NODEMAILER_EMAIL && process.env.NODEMAILER_PASSWORD),
      hasGemini: Boolean(process.env.GEMINI_API_KEY),
    },
    time: new Date().toISOString(),
  });
}
