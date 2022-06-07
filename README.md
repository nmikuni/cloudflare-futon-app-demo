# Cloudflare FUTON App demo

This is the demo application for following purpose

- Record when you have dried the Futon (Japanese mattress)
- Notify when you haven't dried the Futon for a while

## Components

- Cloudflare Workers
- Soracom (SORACOM LTE-M Button, SORACOM Beam)
- Slack

## Architecture

```
                                         +----------------------------------+
                                         |Cloudflare_Workers                |
                                         |                                  |
                                         | +-------+  +-----------------+   |
                                         | |Trigger+->|futon-dry-checker+---+---------------+
                                         | +-------+  +-------+---------+   |               |
                                         |                    |             |               |
                                         |                  +-v-+           |   +-----------v----------+
                                         |                  |KV |           |   |Slack_Incoming_Webhook|
                                         |                  +-^-+           |   +-----------^----------+
                                         |                    |             |               |
+----------------------+  +------------+ |           +--------+---------+   |               |
| SORACOM_LTE-m_Button +->|SORACOM_Beam+-+---------->|futon-dry-recorder+---+---------------+
+----------------------+  +------------+ |           +------------------+   |
                                         |                                  |
                                         +----------------------------------+
```

## Prerequisite 

This demo application was built for specific IoT Device ([SORACOM LTE-M Button for Enterprise](https://soracom.jp/store/5206/), which is only sold in Japan) and [Soracom](https://soracom.io/) ([JP website](https://soracom.jp/)) service.

Especially, authentication in futon-dry-recoder uses Soracom Beam signature verification (doc: [EN](https://developers.soracom.io/en/docs/beam/signature-verification/) / [JA](https://users.soracom.io/ja-jp/docs/beam/verify-signature/)).

The device has 3 click type (SINGLE, DOUBLE, and LONG). This application assigns SINGLE for kid, DOUBLE for mom, and LONG for dad to record the futon dry.

## How to build

You can build this application with [Wrangler](https://developers.cloudflare.com/workers/wrangler/). Here's the sample setup

```bash
wrangler publish futon-dry-checker/src/index.ts 
wrangler publish futon-dry-recorder/src/index.ts 
wrangler secret put -c futon-dry-recorder/wrangler.toml --name futon-dry-recorder PRESHARED_KEY
wrangler kv:namespace create "FUTON_KV"
# note: ${id} is the namespace ID of KV. 
wrangler kv:key put SLACK_URL "YOUR_SLACK_INCOMING_WEBHOOK_URL" --namespace-id ${id}
wrangler kv:key put DRY_CYCLE_SECOND "86400000" --namespace-id ${id}
```

If you want to test Workers locally, you also need to set up KV for preview namespace.

```bash
wrangler kv:namespace create "FUTON_KV" --preview
# note: ${id} is the namespace ID of KV.
wrangler kv:key put SLACK_URL "YOUR_SLACK_INCOMING_WEBHOOK_URL" --namespace-id ${id}
wrangler kv:key put DRY_CYCLE_SECOND "86400000" --namespace-id ${id}
```
