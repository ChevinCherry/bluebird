import Axios from "axios";

var emojiText = require("emoji-text");

// Return a normalized score between -1 and 1 representing relative sentiment
export const calculateSentiment = async (text: string): Promise<number> => {
  // TODO: This doesn't handle chained emojis properly
  const parsedText = emojiText.convert(text, {
    delimiter: " ",
    field: "description",
  });
  const apiRoute = `https://cors-anywhere.herokuapp.com/http://34.123.199.55/predict_tweet`;
  let fake = 0;
  await Axios.post(apiRoute, {tweet: parsedText}).then((res) => {
    if (res.status >= 400) {
      console.log(res.status + res.statusText);
    }
    console.log(res.data.result);
    if (res.data.result === "fake") {
      fake = -1;
    } else {
      fake = 1;
    }
  });

  return fake;
};

// Unused; requires 'sentiment' library
// const SENTIMENT_RANGE = 5;
// const analyzer = new Sentiment();
// const calculateAFINN = (text: string): number => {
//   const analysis = analyzer.analyze(text);

//   // Currently we calculate the average sentiment of ONLY words that have a sentiment value
//   const sentiment =
//     analysis.score > 0
//       ? analysis.score / analysis.calculation.length / SENTIMENT_RANGE
//       : 0;
//   return sentiment;
// };
