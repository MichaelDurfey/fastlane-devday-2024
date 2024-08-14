const { getAuthAssertionToken } = require("./auth.js");
const fetch = require("node-fetch");

const {
  DOMAINS = "example.com",
  PAYPAL_API_BASE_URL = "https://www.sandbox.paypal.com",
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  PAYPAL_SDK_BASE_URL = "https://www.sandbox.paypal.com",
  PAYPAL_MERCHANT_ID,
} = process.env;

function getPayPalSdkUrl() {
  const sdkUrl = new URL("/sdk/js", PAYPAL_SDK_BASE_URL);

  const sdkParams = new URLSearchParams({
    "client-id": PAYPAL_CLIENT_ID,
    components: "buttons,fastlane",
  });

  sdkUrl.search = sdkParams.toString();

  return sdkUrl.toString();
}

async function getClientToken() {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("Missing API credentials");
    }

    const url = `${PAYPAL_API_BASE_URL}/v1/oauth2/token`;

    const auth = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const headers = {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    if (PAYPAL_MERCHANT_ID) {
      headers["PayPal-Auth-Assertion"] = getAuthAssertionToken(
        PAYPAL_CLIENT_ID,
        PAYPAL_MERCHANT_ID
      );
    }

    const searchParams = new URLSearchParams();

    searchParams.append("grant_type", "client_credentials");
    searchParams.append("response_type", "client_token");
    searchParams.append("intent", "sdk_init");
    searchParams.append("domains[]", DOMAINS);

    const options = {
      method: "POST",
      headers,
      body: searchParams,
    };

    const response = await fetch(url, options);
    const data = await response.json();
    
    return data.access_token;
  } catch (error) {
    console.error(error);

    return "";
  }
}

module.exports = {
  getPayPalSdkUrl,
  getClientToken,
};
