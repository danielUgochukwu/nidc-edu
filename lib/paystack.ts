import { createHmac, timingSafeEqual } from "node:crypto";

function getPaystackSecretKey() {
  const secretKey = process.env.PAYSTACK_SECRET_KEY?.trim();

  if (!secretKey) {
    throw new Error("PAYSTACK_SECRET_KEY environment variable is not set");
  }

  return secretKey;
}

export const PAYSTACK_SECRET_KEY = getPaystackSecretKey();

export function verifyPaystackSignature(
  payload: string,
  signature: string,
): boolean {
  const hash = createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(payload)
    .digest("hex");
  const expectedSignature = Buffer.from(hash, "hex");
  const receivedSignature = Buffer.from(signature.trim(), "hex");

  if (receivedSignature.length !== expectedSignature.length) {
    return false;
  }

  return timingSafeEqual(receivedSignature, expectedSignature);
}
