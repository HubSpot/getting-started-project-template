// For external API calls
const axios = require('axios');

exports.main = async (
  context: Context,
  sendResponse: (a: FunctionResponse) => void
) => {

  // Store contact firstname, configured as propertiesToSend in crm-card.json
  const { firstname } = context.propertiesToSend;

  const introMessage = {
    type: "text",
    format: "markdown",
    text: "_An example of a CRM card extension that displays data from Hubspot, uses ZenQuotes public API to display daily quote, and demonstrates custom actions using serverless functions._",
  };

  try {
    const { data } = await axios.get("https://zenquotes.io/api/random");

    const quoteSections = [
      {
        type: "tile",
        body: [
          {
            type: "text",
            format: "markdown",
            text: `**Hello ${firstname}, here's your quote for the day**!`
          },
          {
            type: "text",
            format: "markdown",
            text: `**Quote**: ${data[0].q}`
          },
          {
            type: "text",
            format: "markdown",
            text: `**Author**: ${data[0].a}`
          }
        ]
      },
      {
        type: "button",
        text: "Get new quote",
        onClick: {
          type: "SERVERLESS_ACTION_HOOK",
          serverlessFunction: "crm-card"
        }
      }
    ];

    sendResponse({ sections: [introMessage, ...quoteSections] });
  } catch (error) {
    // "message" will create an error feedback banner when it catches an error
    sendResponse({
      message: {
        type: 'ERROR',
        body: `Error: ${error.message}`
      },
      sections: [introMessage]
    });
  }
};
