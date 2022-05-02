const axios = require("axios");

exports.main = async (context = {}, sendResponse) => {
  try {
    const { data } = await axios.get("https://zenquotes.io/api/random");

    sendResponse({
      sections: [
        {
          type: 'descriptionList',
          items: [
            { label: 'Quote', value: data[0].q },
            { label: 'Author', value: data[0].a }
          ]
        },
        {
          type: 'button',
          text: 'Get Inspired',
          onClick: {
            type: "SERVERLESS_ACTION_HOOK",
            serverlessFunction: "crm-card",
          },
        },
        {
          type: 'text',
          format: 'markdown',
          variant: 'microcopy',
          text: "_Quotes provided by [ZenQuotes API](https://zenquotes.io/)_",
        },
      ]
    });
  } catch (error) {
    throw new Error(`There was an error fetching the quote': ${error.message}`);
  }
};
