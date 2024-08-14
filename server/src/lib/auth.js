function getAuthAssertionToken(clientId, merchantId) {
  const header = {
    alg: "none",
  };

  const body = {
    iss: clientId,
    payer_id: merchantId,
  };

  const signature = "";
  const jwtParts = [header, body, signature];

  const authAssertion = jwtParts
    .map((part) => part && Buffer.from(JSON.stringify(part)).toString('base64'))
    .join(".");

  return authAssertion;
}

module.exports = {
  getAuthAssertionToken,
};
