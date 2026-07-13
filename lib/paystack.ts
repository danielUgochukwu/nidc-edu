import { createHmac } from "node:crypto";

export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY ?? "";

export function verifyPaystackSignature(
  payload: string,
  signature: string,
): boolean {
  const hash = createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(payload)
    .digest("hex");

  return hash === signature;
}
