async function initFastlane() {
  try {
    /**
     * Step 2.1 - Initialize Fastlane
     *
     * Replace the code in the section below
     */

    let paymentComponent = null;

    /** End of Step 2.1 */

    /**
     * Step 3 - Add watermark
     *
     * Paste the code below
     */

    const form = document.querySelector("form");
    const customerSection = document.getElementById("customer");
    const emailSubmitButton = document.getElementById("email-submit-button");
    const paymentSection = document.getElementById("payment");
    const checkoutButton = document.getElementById("checkout-button");

    let activeSection = customerSection;
    let memberAuthenticatedSuccessfully;
    let email;
    let shippingAddress;
    let paymentToken;

    const setActiveSection = (section) => {
      activeSection.classList.remove("active");
      section.classList.add("active", "visited");
      activeSection = section;
    };

    const getAddressSummary = ({
      address: {
        addressLine1,
        addressLine2,
        adminArea2,
        adminArea1,
        postalCode,
        countryCode,
      } = {},
      name: { firstName, lastName, fullName } = {},
      phoneNumber: { countryCode: telCountryCode, nationalNumber } = {},
    }) => {
      const isNotEmpty = (field) => !!field;
      const summary = [
        fullName || [firstName, lastName].filter(isNotEmpty).join(" "),
        [addressLine1, addressLine2].filter(isNotEmpty).join(", "),
        [
          adminArea2,
          [adminArea1, postalCode].filter(isNotEmpty).join(" "),
          countryCode,
        ]
          .filter(isNotEmpty)
          .join(", "),
        [telCountryCode, nationalNumber].filter(isNotEmpty).join(""),
      ];
      return summary.filter(isNotEmpty).join("\n");
    };

    emailSubmitButton.addEventListener("click", async () => {
      emailSubmitButton.setAttribute("disabled", "");
      email = form.elements["email"].value;
      form.reset();
      document.getElementById("email-input").value = email;
      paymentSection.classList.remove("visited", "pinned");

      /**
       * Step 2.3 - Call render function
       *
       * Paste the code in the line below
       */

      memberAuthenticatedSuccessfully = undefined;
      shippingAddress = undefined;
      paymentToken = undefined;

      /**
       * Step 4 - Lookup profile with email
       *
       * Replace the code below
       */

      customerSection.querySelector(".summary").innerText = email;
      setActiveSection(paymentSection);
      emailSubmitButton.removeAttribute("disabled");

      /** End of Step 4 */
    });

    emailSubmitButton.removeAttribute("disabled");

    document
      .getElementById("email-edit-button")
      .addEventListener("click", () => setActiveSection(customerSection));

    document
      .getElementById("payment-edit-button")
      .addEventListener("click", () => setActiveSection(paymentSection));

    checkoutButton.addEventListener("click", async () => {
      checkoutButton.setAttribute("disabled", "");

      try {
        paymentToken = await paymentComponent.getPaymentToken();
        console.log("Payment token:", paymentToken);

        const body = JSON.stringify({ paymentToken });

        const response = await fetch("transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        });

        const { result, error } = await response.json();

        if (error) {
          console.error(error);
        } else {
          if (result.id) {
            const message = `Order ${result.id}: ${result.status}`;
            console.log(message);
            window.location.replace("/success");
          } else {
            console.error(result);
          }
        }
      } finally {
        checkoutButton.removeAttribute("disabled");
      }
    });
  } catch (error) {
    console.error(error);
  }
}

initFastlane();
