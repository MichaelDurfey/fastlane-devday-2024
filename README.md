# How to integrate Fastlane with PayPal SDK

### Introduction

Fastlane is PayPal’s quick checkout solution which is aimed at guest payers to your store. It will securely save and retrieve payment information and customer addresses for Fastlane customers so that they can checkout faster.

For any merchant integrated with Fastlane, if the customer has an existing Fastlane profile with PayPal, their payment information and billing address will be auto-filled regardless of whether they created the profile on a different merchant’s checkout page.

This tutorial showcases step-by-step how to successfully integrate Fastlane components into your website using PayPal SDK.

## Step 1 - Initializing PayPal SDK & Fastlane

In this example, we're using a template engine library that helps us generating a fresh client token each time the page loads.

This method allows for the dynamic insertion of the client token directly into the script URL, ensuring that the script initializes correctly with a new and secure token for each session.

The file `server/src/controllers/checkout.js` contains all the logic related to adding the scripts into our HTML file. You should see some helper functions that helps us generating the client token and the PayPal's SDK URL.


## Step 2 - Payment fields

### 2.1 - Initialize client instance

Open the `client/init-fastlane.js` file and replace the content on Step 2.1 with the following code:

```js
if (!window.paypal.Fastlane) {
  throw new Error("PayPal script loaded but no Fastlane module");
}

const {
  identity,
  profile,
  FastlanePaymentComponent,
  FastlaneWatermarkComponent,
} = await window.paypal.Fastlane({
  // shippingAddressOptions: {
  //   allowedLocations: ['US:TX', 'US:CA', 'MX', 'CA:AB', 'CA:ON'],
  // },
  // cardOptions: {
  //   allowedBrands: ['VISA', 'MASTER_CARD'],
  // },
  styles: { root: { backgroundColor: "#faf8f5" } },
});

const paymentComponent = await FastlanePaymentComponent();

const watermarkComponent = await FastlaneWatermarkComponent({
  includeAdditionalInfo: true,
});
```

There are some additional configurations commented out showcasing that we can customize Fastlane even further.

### 2.2 - Replace payment fields

Now we're going to render Fastlane's payment fields, so we should replace the payment section on `server/src/views/checkout.html` with the following content:

```html
<section id="payment">
  <div class="header">
    <h2>Payment</h2>
    <button id="payment-edit-button" type="button" class="edit-button">
      Edit
    </button>
  </div>
  <fieldset>
    <div id="payment-component"></div>
  </fieldset>
</section>
```

### 2.3 - Call render function

After doing that we should call the `render` function from the `FastlanePaymentComponent` passing the element id where the payment fields are going to rendered, in our case `#payment-component`.

Paste the following code inside `client/init-fastlane.js` on Step 2.3:

```js
paymentComponent.render("#payment-component");
```

## Step 3 - Add Watermark

To add the watermark below our input we're going to use the `FastlaneWatermarkComponent` which was returned by initializing our Fastlane instance.

We should call the `render` function, passing the element id where we're going to render it:

Copy and paste the code below inside `client/init-fastlane.js` on Step 3:

```js
watermarkComponent.render("#watermark-container");
```

## Step 4 - Lookup profile with email

After collecting the email address, we need to determine whether the email is associated with a Fastlane profile or belongs to a PayPal member.

Replace the code in the `client/init-fastlane.js` file on Step 4 with the following code:

```js
try {
  const { customerContextId } = await identity.lookupCustomerByEmail(email);

  if (customerContextId) {
    const authResponse = await identity.triggerAuthenticationFlow(
      customerContextId
    );
    console.log("Auth response:", authResponse);

    if (authResponse?.authenticationState === "succeeded") {
      memberAuthenticatedSuccessfully = true;
      name = authResponse.profileData.name;
      shippingAddress = authResponse.profileData.shippingAddress;
      paymentToken = authResponse.profileData.card;
    }
  } else {
    console.log("No customerContextId");
  }

  customerSection.querySelector(".summary").innerText = email;

  if (memberAuthenticatedSuccessfully) {
    paymentSection.classList.add('pinned');
  }

  setActiveSection(paymentSection);
} finally {
  emailSubmitButton.removeAttribute("disabled");
}
```


| Active accounts |
|-------|
|veeraj@fastlanedevcon2024.com |
|bhoung@fastlanedevcon2024.com |
|zabrahams@fastlanedevcon2024.com |
|brian@fastlanedevcon2024.com |
|ryan@fastlanedevcon2024.com |
|bri@fastlanedevcon2024.com |
