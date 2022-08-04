

// For external API calls
const axios = require('axios');

exports.main = async (context = {}, sendResponse) => {

  // Store contact firstname, configured as propertiesToSend in crm-card.json
  const { firstname } = context.propertiesToSend;

  const introMessage = {
    type: "text",
    format: "markdown",
    text: "_An example of a CRM card extension that displays data from Hubspot, uses ZenQuotes public API to display daily quote, and demonstrates custom actions using serverless functions._",
  };

  let quoteSections = [];

  try {
    const { data } = await axios.get("https://zenquotes.io/api/random");

    quoteSections = [
      {
        type: "tile",
        body: [
          {
            type: "text",
            format: "markdown",
            text: "**Hello " + firstname + ", here's your quote for the day**!"
          },
          {
            type: "text",
            format: "markdown",
            text: "**Quote**: " + data[0].q
          },
          {
            type: "text",
            format: "markdown",
            text: "**Author**: " + data[0].a
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
  } catch (error) {
    quoteSections = [
      {
        type: "alert",
        variant: "danger",
        title: "",
        body: {
          type: "text",
          text: "Error fetching new quote"
        }
      }
    ];
    console.log(error);
  }

  sendResponse({ sections: [introMessage, ...quoteSections] });
};
