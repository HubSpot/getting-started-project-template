const axios = require("axios");

exports.main = async (context = {}, sendResponse) => {
  const fallbackQuote = `I think I do myself a disservice by comparing myself to Steve Jobs and Walt Disney and human beings that we've seen before. It should be more like Willy Wonka...and welcome to my chocolate factory.`;
  const demoObject = {
    objectId: 1,
    title: "Sample project custom CRM card",
    desc: `A custom CRM card is a UI extension that displays custom info from either HubSpot or an external system. It can also include custom actions—click the "Get Inspired" button to see example data from kanye.rest.`,
  };

  try {
    const { data } = await axios.get("https://api.kanye.rest/");

    sendResponse({
      results: [
        demoObject,
        {
          objectId: 2,
          title: "Wisdom from Kanye",
          quote: data.quote || fallbackQuote,
        },
      ],
      primaryAction: {
        type: "SERVERLESS_ACTION_HOOK",
        serverlessFunction: "crmCard",
        label: "Get Inspired",
      },
    });
  } catch (error) {
    throw new Error(
      `Kanye must be sleeping because he's not talking': ${error.message}`
    );
  }
};
