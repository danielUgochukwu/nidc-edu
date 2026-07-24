import { Resend } from "resend";

let resendInstance: Resend | null = null;

function getResendClient(): Resend {
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
  get(_, prop) {
    const client = getResendClient();
    const value = Reflect.get(client, prop);
    return typeof value === "function" ? value.bind(client) : value;
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
  await getResendClient().emails.send({
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

export async function sendApplicationSubmittedEmail({
  to,
  firstName,
}: {
  to: string;
  firstName: string;
}) {
  await getResendClient().emails.send({
    from: "NIDC <no-reply@nidc.org>",
    to,
    subject: "Your NIDC application has been received",
    html: `
      <p>Hi ${firstName},</p>
      <p>Thank you for applying to NIDC. Your application has been received and is now under review.</p>
      <p>We will contact you with the outcome of your application. This process may take some time as we review all applications carefully.</p>
      <p>In the meantime, you can log in to your dashboard to view your application status.</p>
      <p>The NIDC Team</p>
    `,
  });
}
