const {
  getClientToken,
  getPayPalSdkUrl,
} = require("../lib/sdk-script-helpers.js");

const { getRandomAmount } = require('../utils/amount.js');

const { setState } = require('../utils/state.js');

async function renderCheckout(req, res) {
  const sdkUrl = getPayPalSdkUrl();
  const clientToken = await getClientToken();
  const amount = getRandomAmount();
  
  setState('checkout-amount', amount);

  const locals = {
    title: "Fastlane - PayPal Integration",
    prerequisiteScripts: `
      <script
        src="${sdkUrl}"
        data-sdk-client-token="${clientToken}"
        defer
      ></script>
    `,
    initScriptPath: "init-fastlane.js",
    stylesheetPath: "styles.css",
    amount
  };

  res.render("checkout", locals);
}

async function renderCheckoutWithShippingSection(req, res) {
  const sdkUrl = getPayPalSdkUrl();
  const clientToken = await getClientToken();
  const amount = getRandomAmount();
  
  setState('checkout-amount', amount);

  const locals = {
    title: "Fastlane - PayPal Integration",
    prerequisiteScripts: `
      <script
        src="${sdkUrl}"
        data-sdk-client-token="${clientToken}"
        defer
      ></script>
    `,
    initScriptPath: "init-fastlane-shipping.js",
    stylesheetPath: "styles.css",
    amount
  };

  res.render("checkout-shipping", locals);
}

module.exports = {
  renderCheckout,
  renderCheckoutWithShippingSection,
};
