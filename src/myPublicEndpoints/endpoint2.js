exports.main = ({ params }, sendResponse) => {
  const { name } = params;
  sendResponse({
    body: {
      result: `Hello, ${name || 'buddy'}!`,
    },
    statusCode: 200,
  });
};
