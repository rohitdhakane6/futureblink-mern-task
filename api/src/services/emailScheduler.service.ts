import agenda from "../config/agenda";
import EmailTemplate from "../models/emailTemplate.model";
import List from "../models/list.model";
import { DateTime } from "luxon";

export const scheduleEmailSequence = async (sequence: any, userId: string) => {
  const { nodes } = sequence.flowChart;

  let delayInSeconds = 0;
  let leads: { email: string }[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    switch (node.type) {
      case "lead":
        leads = await processLead(node);
        break;

      case "email":
        await processEmail(node, delayInSeconds, leads, userId);
        break;

      case "wait":
        delayInSeconds += await processWait(node);
        break;

      default:
        break;
    }
  }
};

const processLead = async (lead: any) => {
  const list = await List.findById(lead.data.id);
  if (!list) throw new Error("Lead list not found");
  return list.leads;
};

const processEmail = async (
  emailNode: any,
  delayInSeconds: number,
  leads: { email: string }[],
  userId: string
) => {
  const template = await EmailTemplate.findById(emailNode.data.id);
  if (!template) throw new Error("Email template not found");

  const scheduleTime = DateTime.now()
  .setZone("Asia/Kolkata")
  .plus({ seconds: delayInSeconds })
  .toUTC()
  .toJSDate();

  for (const lead of leads) {
    await agenda.schedule(scheduleTime, "send-email", {
      to: lead.email,
      subject: template.subject,
      body: template.body,
      userId,
    });
  }

  console.log(
    `Scheduled email "${template.subject}" to ${leads.length} leads at ${scheduleTime}`
  );
};

const processWait = async (wait: any) => {
  const waitTime = wait.data.time;
  const waitUnit = wait.data.unit;

  let waitInSeconds = 0;
  switch (waitUnit) {
    case "min":
      waitInSeconds = waitTime * 60;
      break;
    case "hour":
      waitInSeconds = waitTime * 3600;
      break;
    case "day":
      waitInSeconds = waitTime * 86400;
      break;
    default:
      throw new Error("Invalid wait unit");
  }

  console.log(`Wait node: delaying next email by ${waitInSeconds} seconds`);
  return waitInSeconds;
};
