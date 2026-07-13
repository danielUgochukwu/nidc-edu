import { Resend } from "resend";

let resendInstance: Resend | null = null;

function getResendClient() {
  if (resendInstance) return resendInstance;

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }

  resendInstance = new Resend(apiKey);
  return resendInstance;
}

const resendProxyTarget = {} as Resend;

export const resend = new Proxy(resendProxyTarget, {
  get(_, prop, receiver) {
    return Reflect.get(getResendClient(), prop, receiver);
  },
});

export async function sendInviteEmail({
  to,
  role,
  inviteUrl,
  invitedBy,
}: {
  to: string;
  role: string;
  inviteUrl: string;
  invitedBy: string;
}) {
  await resend.emails.send({
    from: "NIDC <no-reply@nidc.org>",
    to,
    subject: `You have been invited to join NIDC as ${role.replace(/_/g, " ")}`,
    html: `
      <p>You have been invited by ${invitedBy} to join the NIDC platform as <strong>${role.replace(/_/g, " ")}</strong>.</p>
      <p><a href="${inviteUrl}">Click here to accept your invitation</a></p>
      <p>This invite expires in 7 days.</p>
    `,
  });
}
