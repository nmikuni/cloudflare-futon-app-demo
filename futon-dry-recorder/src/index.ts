import { Env } from "./interfaces/Environment";
import CryptoJS from "crypto-js";
import {
  LteMButtonClickTypeName,
  LteMButtonPayload,
} from "./interfaces/LteMButton";
import { FamilyRole } from "./interfaces/FamilyRole";
import { Dad } from "./Family/Dad";
import { Mom } from "./Family/Mom";
import { Kid } from "./Family/Kid";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Get parameters from KV
    const slackUrl = await env.KV.get("SLACK_URL");
    const preSharedKey: string = env.PRESHARED_KEY;

    // Confirm KV value is not null
    if (!slackUrl) {
      return new Response("Internal Server Error", {
        status: 500,
      });
    }

    // Confirm there is preSharedKey in Secret
    if (!preSharedKey) {
      return new Response("Internal Server Error", {
        status: 500,
      });
    }

    // Authenticate with header
    const requestHeaders = request.headers;

    const signature = requestHeaders.get("x-soracom-signature");

    const imsi = requestHeaders.get("x-soracom-imsi");
    const timestamp = requestHeaders.get("x-soracom-timestamp");
    const stringToSign =
      "x-soracom-imsi=" + imsi + "x-soracom-timestamp=" + timestamp;
    const calculatedSignature = CryptoJS.SHA256(
      preSharedKey + stringToSign
    ).toString(CryptoJS.enc.Hex);

    if (calculatedSignature != signature) {
      return new Response("Invalid signature", {
        status: 403,
      });
    }

    // Only allow POST request
    if (request.method != "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
      });
    }

    // Only allow "application/json" content-type
    if (requestHeaders.get("content-type") != "application/json") {
      return new Response("Unsupported Media Type", {
        status: 415,
      });
    }

    // Identify who's futon was dried with input
    const requestInput: LteMButtonPayload = await request.json();

    const familyRoleMap = new Map<LteMButtonClickTypeName, FamilyRole>();
    const kid = new Kid();
    const mom = new Mom();
    const dad = new Dad();
    familyRoleMap.set("SINGLE", kid);
    familyRoleMap.set("DOUBLE", mom);
    familyRoleMap.set("LONG", dad);

    const futonDriedPerson = familyRoleMap.get(requestInput.clickTypeName);

    // Record the date to corresponding futon KV
    const currentDate = Date.now();
    if (futonDriedPerson) {
      await env.KV.put(futonDriedPerson?.kvName, currentDate.toString());
    } else {
      return new Response("Internal Server Error", {
        status: 500,
      });
    }

    // Post data to Slack using data from client
    const messageText = futonDriedPerson?.role + "'s futon got dried.";
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

    const response = await fetch(slackUrl, requestInit);

    return new Response(await response.text());
  },
};
