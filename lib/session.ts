import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

function getEncodedKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET env var is required (min 32 chars). Generate one with: openssl rand -hex 32"
    );
  }
  return new TextEncoder().encode(secret);
}

const COOKIE_NAME = "aio-admin-session";

type SessionPayload = {
  email: string;
  expiresAt: Date;
};

async function encrypt(payload: SessionPayload) {
  const key = getEncodedKey();
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt)
    .sign(key);
}

async function decrypt(
  session: string | undefined
): Promise<{ email: string } | null> {
  if (!session) return null;
  try {
    const key = getEncodedKey();
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload as { email: string };
  } catch {
    return null;
  }
}

export async function createSession(email: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await encrypt({ email, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  return decrypt(session);
}
