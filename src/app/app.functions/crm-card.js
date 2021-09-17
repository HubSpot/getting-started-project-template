exports.main = async (context = {}, sendResponse) => {
  sendResponse({
    results: [
      {
        objectId: 1,
        title: `CRM Card Object #1`,
        message:
          "CRM card objects can display data fetched from your app or other external systems",
      },
    ],
    settingsAction: {
      type: "IFRAME",
      width: 890,
      height: 748,
      uri: "https://developers.hubspot.com/docs/api/crm/extensions/custom-cards",
      label: "CRM Card Documentation",
    },
    primaryAction: {
      type: "IFRAME",
      width: 890,
      height: 748,
      uri: "https://example.com/create-iframe-contents",
      label: "Next >>",
    },
  });
};
