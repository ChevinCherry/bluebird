import {ITweetResponse, ITweetEvent} from "../interfaces";
import {createTweetFromResponse} from "./tweetUtils";
import {WorkerActions} from "./actions";

// For the PubNub script
// eslint-disable-next-line no-restricted-globals
globalThis.window = self;
// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;

importScripts("https://cdn.pubnub.com/sdk/javascript/pubnub.4.28.0.min.js");

// Imported dynamically from above
// @ts-ignore
const pubnub = new PubNub({
  subscribeKey: "sub-c-9eeb2ca4-0607-11eb-ac24-4e38869d876d",
  ssl: true,
});

const handleData = (response: ITweetResponse) => {
  if (response.lang !== "en") return;

  // TODO: Handle neutral tweets?
  const tweet = createTweetFromResponse(response);
  ctx.postMessage(tweet);
};

ctx.onmessage = (msg: MessageEvent) => {
  switch (msg.data) {
    case WorkerActions.START:
      pubnub.subscribe({
        channels: ["pubnub_onboarding_channel"],
      });
      break;
    case WorkerActions.STOP:
      pubnub.unsubscribe({
        channels: ["pubnub_onboarding_channel"],
      });
  }
};

pubnub.addListener({
  message: (event: ITweetEvent) => handleData(event.message),
});
pubnub.subscribe({
  channels: ["pubnub_onboarding_channel"],
});
