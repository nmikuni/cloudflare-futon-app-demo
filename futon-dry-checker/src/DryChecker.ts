export class DryChecker {
  currentDate: number;
  slackUrl: string;
  dryCycleMilliSecond: number;

  constructor(
    currentDate: number,
    slackUrl: string,
    dryCycleMilliSecond: number
  ) {
    this.currentDate = currentDate;
    this.slackUrl = slackUrl;
    this.dryCycleMilliSecond = dryCycleMilliSecond;
  }

  async checkDriedEnough(role: string, lastDryDate: number) {
    if (this.currentDate - lastDryDate <= this.dryCycleMilliSecond) {
      // futon has been dried in good cycle.
      return;
    } else {
      const messageText =
        "You need to dry " +
        role +
        "'s futon! Last dried date is " +
        new Date(lastDryDate);
      const message = JSON.stringify({
        text: messageText,
      });

      const requestInit: RequestInit = {
        body: message,
        method: "POST",
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      };

      const response = await fetch(this.slackUrl, requestInit);
      return new Response(await response.text());
    }
  }
}
