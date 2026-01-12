import { Env } from "../config/env.config";
import { resend } from "../config/resend.config";

type Params = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
};

const mailer_sender = `SpendWise <${Env.RESEND_MAILER_SENDER}>`;

export const sendEmail = async ({
  to,
  subject,
  html,
  from = mailer_sender,
  text,
}: Params) => {
  return await resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    text,
    subject,
    html,
  });
};
