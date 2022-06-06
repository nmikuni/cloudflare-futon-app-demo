import { DryChecker } from "./DryChecker";
import { Env } from "./interfaces/Environment";

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(triggerEvent(event, env));
  },
};

async function triggerEvent(event: ScheduledEvent, env: Env) {
  // Get parameters from KV
  const slackUrl = await env.KV.get("SLACK_URL");
  const lastDryDateOfKid: number = Number(
    await env.KV.get("LAST_DRY_DATE_KID")
  );
  const lastDryDateOfMom: number = Number(
    await env.KV.get("LAST_DRY_DATE_MOM")
  );
  const lastDryDateOfDad: number = Number(
    await env.KV.get("LAST_DRY_DATE_DAD")
  );
  const dryCycleMilliSecond: number = Number(
    await env.KV.get("DRY_CYCLE_MILLISECOND")
  );

  // Confirm KV value is not null
  if (
    !(
      slackUrl &&
      lastDryDateOfKid &&
      lastDryDateOfMom &&
      lastDryDateOfDad &&
      dryCycleMilliSecond
    )
  ) {
    return new Response("Internal Server Error", {
      status: 500,
    });
  }

  const currentDate = Date.now();
  const dryChecker = new DryChecker(currentDate, slackUrl, dryCycleMilliSecond);

  const responses = [];
  responses.push(dryChecker.checkDriedEnough("Kid", lastDryDateOfKid));
  responses.push(dryChecker.checkDriedEnough("Mom", lastDryDateOfMom));
  responses.push(dryChecker.checkDriedEnough("Dad", lastDryDateOfDad));
  await Promise.all(responses);

  return;
}
