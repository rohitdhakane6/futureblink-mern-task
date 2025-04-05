import { Agenda } from "agenda";
import { getOrCreateTransporter } from "../config/mailer";

export const defineEmailJob = (agenda: Agenda) => {
  agenda.define("send-email", async (job, done) => {
    try {

      console.log("Sending email...");
      const { to, subject, body, userId } = job.attrs.data;

      const transporter = await getOrCreateTransporter(userId);


      await transporter.sendMail({
        from: `"FutureBlink" <${transporter.options.auth.user}>`,
        to,
        subject,
        html: body,
      });

      done();
    } catch (err) {
      console.error("❌ Error sending email:", err);
      done(err as Error);
    }
  });
};
