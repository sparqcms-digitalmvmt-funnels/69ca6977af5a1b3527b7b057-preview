
const KLAVIYO_PUBLIC_API_KEY = 'XsRPnE';

const EMAIL_OVERSIGHT_VALIDATE_URL = 'https://app-cms-api-proxy-dev-001.azurewebsites.net/integration/email-oversight/validate-public';

const KOUNT_MERCHANT_ID = 'merchant-id-test';
const KOUNT_ORG_ID = '1snn5n9w'; // Standard Kount org_id for ThreatMetrix
let kountSessionIdForSticky; // This will hold the session_id passed to Kount and Sticky.io


let isTest = JSON.parse(sessionStorage.getItem("test"));

// Select non-VIP campaign for checkout
const getVrioCampaignInfoBasedOnPaymentMethod = (isVipUpsell) => {
    const vrioCampaigns = [{"_id":"696a4531a531c62359271f0b","integration":[{"_id":"685435949a3a8c5ffb4854ef","workspace":"develop","platform":"vrio","description":"dev, team api","fields":{"publicApiKey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6ImFkbWluIiwib3JnYW5pemF0aW9uIjoibXZtdHNhbmRib3gudnJpbyIsImlkIjoiNTQxNzM0MWMtOTI3ZS00YTc5LTk5MTQtMzcxM2IyM2RlMTNlIiwiaWF0IjoxNzUwMDk4ODg1LCJhdWQiOiJ1cm46dnJpbzphcGk6dXNlciIsImlzcyI6InVybjp2cmlvOmFwaTphdXRoZW50aWNhdG9yIiwic3ViIjoidXJuOnZyaW86YXBpOjE4In0.z4qwr2v87T3wq73w1nT8aSASKIMVLnL0HX1E-2tavrs"},"status":"active","createdAt":1750335264215,"updatedAt":1750349204667,"__v":0,"category":"CRM","id":"685435949a3a8c5ffb4854ef"}],"externalId":"39","name":"Vi-Shift - Network - (1)","currency":"USD","countries":[223,38],"metadata":{"campaign_id":39,"campaign_name":"","payment_type_id":1,"campaign_active":true,"campaign_prepaid":true,"campaign_payment_method_required":true,"campaign_group_transactions":true,"campaign_global_js":"","campaign_global_seo_title":"","campaign_global_seo_keywords":"","campaign_global_seo_description":"","date_created":"2026-03-30 16:13:14","created_by":0,"date_modified":"2026-03-30 16:13:14","modified_by":0,"campaign_notes":"","offers":[],"shipping_profiles":[],"campaignId":"39","externalId":39,"description":"","payment_methods":["amex","discover","visa","master"],"alternative_payments":[],"countries":[{"iso_numeric":840,"calling_code":"1","id":223,"name":"United States of America","iso_2":"US","iso_3":"USA"},{"iso_numeric":124,"calling_code":"1","id":38,"name":"Canada","iso_2":"CA","iso_3":"CAN"}]},"funnels":[],"createdAt":1768339039473,"updatedAt":1774887194515,"packages":[],"status":"active","platform":"vrio","__v":6,"id":"696a4531a531c62359271f0b"}];

    const vrioIntegration = vrioCampaigns.find(({ integration }) =>
      integration.find((int) => int.platform === 'vrio'),
    )?.integration.find((int) => int.platform === 'vrio');
    if (!vrioIntegration) {
      console.log('CRM Integration not available in funnel campaign.');
      throw new Error('CRM Integration not available in funnel campaign.');
    }

    // If this is a VIP page (recurring billing), try to find a VIP campaign
    // const campaignBasedOnBillingModel = vrioCampaigns.find((campaign) => {
    //   if (!campaign.name) {
    //     return false;
    //   }
    //   const isVipCampaign = campaign.name.toUpperCase().includes('VIP');
    //   if (isVipUpsell) {
    //     return isVipCampaign;
    //   }
    //   return !isVipCampaign;
    // });
    const campaignBasedOnBillingModel = vrioCampaigns[0];

    if (!campaignBasedOnBillingModel) {
      throw new Error(`No ${isVipUpsell ? 'VIP' : 'non-VIP'} campaign found in funnel.`);
    }

    const auditedVrioCampaignId = (() => window.VRIO?.campaignId)();
    const vrioCampaignId = auditedVrioCampaignId ?? campaignBasedOnBillingModel.externalId;
    const countries = campaignBasedOnBillingModel.metadata.countries;
    const integrationId = vrioIntegration?._id.toString();
    const currency = (campaignBasedOnBillingModel.currency || "USD").toLowerCase();

    return {
      vrioCampaignId,
      countries,
      integrationId,
      currency,
    };
  };

;
const campaignInfo = getVrioCampaignInfoBasedOnPaymentMethod();
const CAMPAIGN_ID = campaignInfo.vrioCampaignId;
const INTEGRATION_ID = campaignInfo.integrationId;
const OFFER_ID = '99';
const CURRENCY = "EUR";

const CURRENCY_LOCALE_MAP = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  AUD: 'en-AU',
};
const LOCALE = getLocaleFromCurrency(CURRENCY);

function getLocaleFromCurrency(currencyCode) {
  const code = (currencyCode || '').toUpperCase();
  if (code && CURRENCY_LOCALE_MAP[code]) return CURRENCY_LOCALE_MAP[code];
  return navigator.language || 'en-US';
};

function formatPrice(amount, suffix = '') {
  const formatted = new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted}${suffix}`;
};


const i18n = {
  "iso2": "US",
  "phoneInitialCountry": "us",
  "dateFormat": "MM/DD/YYYY",
  "fallbackCountry": {
    "iso_numeric": 840,
    "calling_code": "1",
    "id": 223,
    "name": "United States of America",
    "iso_2": "US",
    "iso_3": "USA"
  },
  "pricingText": {
    "off": "OFF",
    "free": "FREE",
    "freeShipping": "Free Shipping",
    "perUnit": "/ea",
    "selectedProduct": "Selected Product"
  },
  "validation": {
    "expirationDateRequired": "* Expiration date is required",
    "expirationDateInvalid": "* Invalid or expired date",
    "cardNumberRequired": "* Enter a valid card number",
    "cardNumberInvalid": "* Invalid card number",
    "cardCvvRequired": "* Card CVV is required",
    "cardCvvMinLength": "* Card CVV must have at least 3 digits",
    "emailRequired": "* Please enter the e-mail address",
    "emailInvalid": "* Email is invalid",
    "firstNameRequired": "* First name is required",
    "lastNameRequired": "* Last name is required",
    "invalidCharacter": "* Contains an invalid character",
    "shippingAddressRequired": "* Shipping address is required",
    "cityRequired": "* City is required",
    "countryRequired": "* Country is required",
    "stateRequired": "* State/Province is required",
    "zipRequired": "* ZIP/Postcode is required",
    "zipInvalid": "* Invalid ZIP/Postcode code",
    "phoneInvalid": "* Please enter a valid phone number",
    "maxLength255": "* Maximum 255 characters",
    "billingAddressRequired": "* Billing address is required",
    "billingCityRequired": "* Billing city is required",
    "billingZipRequired": "* Billing ZIP/Postcode code is required"
  },
  "errors": {
    "walletVerificationFailed": "This payment needs additional verification. Please try a different payment method.",
    "walletOrderFailed": "Something went wrong creating your order, please try again",
    "unexpectedError": "An unexpected error occurred. Please try again.",
    "paymentDeclined": "Your payment could not be processed. Please try a different payment method.",
    "systemErrorOffer": "There was a problem with this offer. Please contact support or try again later.",
    "systemErrorGeneric": "Something went wrong processing your order. Please try again or contact support if the problem persists.",
    "klarnaNotAvailableRecurring": "Klarna is not available for recurring products.",
    "klarnaNotAvailable": "Klarna is not available.",
    "klarnaSubscriptionsNotSupported": "Subscriptions are not supported with Klarna",
    "klarnaOrderFailed": "Something went wrong creating the order, please try again",
    "klarnaProcessingFailed": "Something went wrong processing your order, please try again",
    "klarnaPaymentNotCompleted": "Klarna payment was not completed",
    "klarnaPaymentNotCompletedRedirect": "Klarna payment was not completed. Redirecting to checkout...",
    "klarnaCompletionFailed": "Something went wrong completing your Klarna payment.",
    "orderAlreadyCompleteRedirect": "Order is already complete. Redirecting to the next page...",
    "unexpectedErrorRedirect": "An unexpected error occurred. Redirecting to checkout...",
    "orderNotFoundRedirect": "Order not found. Redirecting to checkout...",
    "orderNotFound": "Order not found. Please try again.",
    "orderCanceled": "Order canceled",
    "creditCardOrderFailed": "Something went wrong, please try again",
    "upsellOrderFailed": "Something went wrong adding offers, please try again",
    "countryNotAvailableNamed": "The country {name} is not available, please choose another.",
    "countryNotAvailable": "This country is not available, please choose another."
  },
  "labels": {
    "noStatesAvailable": "No States or Provinces Available for this Country",
    "selectState": "Select state",
    "phoneSearchPlaceholder": "Search"
  }
};

// Validation patterns (RegExp – cannot be serialised as JSON)
i18n.validationPatterns = {
  zipCodeRegex: /^(?:\d{5}(?:-\d{4})?|[A-Za-z]\d[A-Za-z](?:[ -]?\d[A-Za-z]\d)?|\d{4}|[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[ABD-HJLN-UW-Z]{2})$/,
  nameRegex: /\b([A-ZÀ-ÿ][-,a-zÀ-ÿ. ']+[ ]*)+$/i,
};

function formatDateByConvention(year, month, day) {
  return `${month}/${day}/${year}`;
}


sessionStorage.setItem("integrationId", INTEGRATION_ID);

const getPrices = () => {
  return [{"name":"1x EXTRA Vi-Shift Glasses","id":232,"quantity":1,"price":19.99,"shippable":false,"fullPrice":19.99,"finalPrice":19.99,"productName":"1x EXTRA Vi-Shift Glasses","discountAmount":0,"discountPercentage":0},{"name":"1x Flexible Glasses","id":224,"quantity":1,"price":29.99,"shippable":false,"fullPrice":29.99,"finalPrice":29.99,"productName":"1x Flexible Glasses","discountAmount":0,"discountPercentage":0},{"name":"1x USB 3.0 Quick Charger","id":59,"quantity":1,"price":0,"shippable":false,"fullPrice":0,"finalPrice":0,"productName":"1x USB 3.0 Quick Charger","discountAmount":0,"discountPercentage":0},{"name":"2x Vi-Shift Glasses","id":225,"quantity":1,"price":53.98,"shippable":false,"fullPrice":53.98,"finalPrice":53.98,"productName":"2x Vi-Shift Glasses","discountAmount":0,"discountPercentage":0},{"name":"3 Year Extended Warranty","id":230,"quantity":1,"price":10,"shippable":false,"fullPrice":10,"finalPrice":10,"productName":"3 Year Extended Warranty","discountAmount":0,"discountPercentage":0},{"name":"3x Vi-Shift Glasses","id":226,"quantity":1,"price":71.97,"shippable":false,"fullPrice":71.97,"finalPrice":71.97,"productName":"3x Vi-Shift Glasses","discountAmount":0,"discountPercentage":0},{"name":"4x Vi-Shift Glasses","id":227,"quantity":1,"price":83.96,"shippable":false,"fullPrice":83.96,"finalPrice":83.96,"productName":"4x Vi-Shift Glasses","discountAmount":0,"discountPercentage":0},{"name":"5x Vi-Shift Glasses","id":228,"quantity":1,"price":89.95,"shippable":false,"fullPrice":89.95,"finalPrice":89.95,"productName":"5x Vi-Shift Glasses","discountAmount":0,"discountPercentage":0},{"name":"Journey Package Protection","id":231,"quantity":1,"price":3.5,"shippable":false,"fullPrice":3.5,"finalPrice":3.5,"productName":"Journey Package Protection","discountAmount":0,"discountPercentage":0},{"name":"Vi-Shift Glasses - Expedited Shipping","id":233,"quantity":1,"price":9.99,"shippable":false,"fullPrice":9.99,"finalPrice":9.99,"productName":"Vi-Shift Glasses - Expedited Shipping","discountAmount":0,"discountPercentage":0},{"name":"Vi-Shift Protective Case Upgrade","id":229,"quantity":1,"price":9.95,"shippable":false,"fullPrice":9.95,"finalPrice":9.95,"productName":"Vi-Shift Protective Case Upgrade","discountAmount":0,"discountPercentage":0}]
};
const getProductElement = (productId) => {
  const productElement = document.querySelector(`[data-product-id="${productId}"]`);
  if (productElement) {
    return productElement;
  } else {
    throw new Error(`Product element with ID ${productId} not found.`);
  }
};

const getBindedShippableProductAndQuantity = (productElement) => {
  if (productElement && productElement.dataset.shippableProductId) {
    const shippableId = Number(productElement.dataset.shippableProductId);
    let quantity = 1;
    if (!isNaN(productElement.dataset.productQuantity)) {
      quantity = Number(productElement.dataset.productQuantity);
    } else if (!isNaN(Number(productElement.value))) {
      quantity = Number(productElement.value);
    }
    return { product: shippables.find((s) => s.id === shippableId), quantity };
  }
  return null;
};

const productCustomData = {};
sessionStorage.removeItem("productCustomData");
const saveProductCustomData = (productElement) => {
  productCustomData[productElement.dataset.productId] = {
    customProductName: productElement.dataset.customProductName,
    customSummaryRow: productElement.dataset.customSummaryRow,
    customIsGift: productElement.dataset.customIsGift,
  };
}
const SUPPORTED_ADDRESS_COUNTRIES = [
  { name: "United States of America", iso_2: "US" },
  { name: "Canada", iso_2: "CA" },
  { name: "United Kingdom", iso_2: "GB" },
  { name: "Australia", iso_2: "AU" },
  { name: "Germany", iso_2: "DE" },
  { name: "France", iso_2: "FR" },
  { name: "Spain", iso_2: "ES" },
  { name: "Italy", iso_2: "IT" },
];

const mergeWithSupportedAddressCountries = (rawCountries = []) => {
  const mergedCountries = new Map();

  (Array.isArray(rawCountries) ? rawCountries : []).forEach((country) => {
    const iso2 = String(country?.iso_2 || country?.code || country?.iso2 || "").toUpperCase();
    if (!iso2) return;
    mergedCountries.set(iso2, {
      ...country,
      iso_2: iso2,
      name: country?.name || country?.countryName || iso2,
    });
  });

  SUPPORTED_ADDRESS_COUNTRIES.forEach((country) => {
    if (!mergedCountries.has(country.iso_2)) {
      mergedCountries.set(country.iso_2, country);
    }
  });

  return Array.from(mergedCountries.values());
};
const getCountries = () => {
  return mergeWithSupportedAddressCountries(
    campaignInfo.countries || [
      i18n.fallbackCountry,
    ],
  );
};

document.addEventListener("DOMContentLoaded", () => {
  renderCheckoutCart();
  returnPaypal();
  const countries = getCountries() || [
    { countryCode: i18n.phoneInitialCountry, countryName: i18n.fallbackCountry.name },
  ];
  let countriesStatesCache = null;
  const getStates = async (countryIso2Code) => {
    const iso2 = String(countryIso2Code || "").toUpperCase();
    try {
      if (!countriesStatesCache) {
        const res = await fetch("/69ca6977af5a1b3527b7b057-preview/scripts/countriesData/countriesStates.json", { cache: "no-store" });
        const data = await res.json();
        countriesStatesCache = Array.isArray(data?.countries)
          ? data.countries
          : Array.isArray(data)
          ? data
          : [];
      }
      const found = countriesStatesCache.find(
        (c) => String(c.code || c.iso_2 || c.iso2 || "").toUpperCase() === iso2
      );
      return (found?.states || []);
    } catch (_) {
      return [];
    }
  };
  let stateDefaultDisplay = "block";
  const populateStates = async (stateEl, countryIso2Code) => {
    const states = await getStates(countryIso2Code);
    stateEl.innerHTML = "";
    stateEl.style.display = stateDefaultDisplay;

    if (!states || states.length === 0) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = i18n.labels.noStatesAvailable;
      opt.disabled = true;
      opt.selected = true;
      stateEl.appendChild(opt);
      stateEl.disabled = true;
      try { stateEl.dataset.hasStates = "false"; } catch {}
      return;
    }

    const defaultOption = document.createElement("option");
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.value = "";
    defaultOption.innerText = i18n.labels.selectState;
    stateEl.appendChild(defaultOption);

    try { stateEl.dataset.hasStates = "true"; } catch {}
    stateEl.disabled = false;

    states.forEach((state) => {
      const option = document.createElement("option");
      option.value = state.iso2 || state.iso_2 || state.code;
      option.innerText = state.name;
      stateEl.appendChild(option);
    });
  };

  const populateCountries = (countryEl) => {
    countryEl.innerHTML = "";
    countries.forEach((country) => {
      const option = document.createElement("option");
      option.value = country.iso_2;
      option.innerText = country.name;
      countryEl.appendChild(option);
    });
  };

  const countryEl = document.querySelector("[data-select-countries]");
  populateCountries(countryEl);
  const stateEl = document.querySelector("[data-select-states]");
  stateDefaultDisplay = stateEl?.style.display;
  populateStates(stateEl, countryEl && countryEl.value);
  countryEl.addEventListener("change", async (event) => {
    await populateStates(stateEl, event.target.value);
  });

  const billingCountryEl = document.querySelector(
    "[data-billing-select-countries]"
  );
  if (billingCountryEl) {
    populateCountries(billingCountryEl);
    const billStateEl = document.querySelector("[data-billing-select-states]");
  populateStates(billStateEl, billingCountryEl && billingCountryEl.value);
    billingCountryEl.addEventListener("change", async (event) => {
      await populateStates(billStateEl, event.target.value);
    });
  }
});

function getCart() {
  return JSON.parse(sessionStorage.getItem("cart")) || [];
}

async function returnPaypal() {
  const params = new URLSearchParams(window.location.search);
  const paymentTokenId = params.get("PayerID");
  const token = params.get("token");
  const ba_token = params.get("ba_token");
  const cancel = params.get("cancel");
  const cartToken = sessionStorage.getItem("cart_token");

  if (cancel == 1) {
    showToast(i18n.errors.orderCanceled);
  }

  if (paymentTokenId && token && ba_token && cancel != 1) {
    document.querySelector("#preload").style.display = "flex";
    const paymentToken = sessionStorage.getItem("payment_token_id");
    let responseCustomer = await fetch(
      `https://app-cms-api-proxy-dev-001.azurewebsites.net/vrio/carts/${cartToken}/payment_tokens/${paymentToken}`, {
      headers: {
        authorization: `appkey ${INTEGRATION_ID}`,
        "Content-Type": "application/json",
        "charset": "utf-8"
      }
    });
    const responseDataCustomer = await responseCustomer.json();
    const orderData = JSON.parse(sessionStorage.getItem("orderData"));
    const body = {
      pageId: "4jM1JlazAwajs9m-mqP3Mm2M0c3qef1kc6HCB5aDqDSxRIZuo0wj7KpCjxiUexg_",
      action: "process",
      campaign_id: CAMPAIGN_ID,
      connection_id: 1,
      email: orderData.email,
      phone: orderData.phone,
      ship_fname: orderData.ship_fname,
      ship_lname: orderData.ship_lname,
      ship_address1: orderData.ship_address1,
      ship_city: orderData.shippingCity,
      ship_state: orderData.ship_state,
      ship_zipcode: orderData.ship_zipcode,
      ship_country: orderData.ship_country,
      same_address: true,
      payment_method_id: 6,
      payment_token: responseDataCustomer.payment_token,
      cart_token: cartToken,
      offers: []
    };

    orderData.offers.forEach((product) => {
      body.offers.push({
        offer_id: OFFER_ID,
        item_id: product.item_id,
        order_offer_quantity: product.order_offer_quantity,
      });
    });

    try {
      const response = await fetch(
        "https://app-cms-api-proxy-dev-001.azurewebsites.net/vrio/orders",
        {
          method: "POST",
          headers: {
            authorization: `appkey ${INTEGRATION_ID}`,
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify(body),
        }
      );

      if (response.status === 403) {
        handlePaymentDecline();
        if (window.MVMT) {
          MVMT.track("ORDER_ERROR", {
            page: "checkout2",
            page_type: "StorefrontCheckout",
            page_url: window.location.href,
            order_data: body,
            response: { error: "payment_declined", status: 403 },
          });
        }
        return;
      }

      const result = await response.json();
      if (result.success) {
        sessionStorage.removeItem('cart');
        sessionStorage.removeItem('cart_token');
        sessionStorage.removeItem('payment_token_id');
        sessionStorage.removeItem('PayerID');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('ba_token');
        sessionStorage.setItem("orderids", JSON.stringify([result.order_id]));
        window.location.href = "/" + nextPageSlug;
      }
      else {
        if (preload) preload.style.display = "none";
        console.warn("Order API error:", result);
        return;
      }

    } catch (error) {
      console.error(error);
    }
  }
}

function renderCheckoutCart() {
  const cart = getCart();
  const summary = document.querySelector(".checkout-cart-summary");
  if (!summary) return;

  const template = summary.querySelector(".cart-item");
  if (!template) return;

  let totalsWrapper = summary.querySelector(":scope > .cart-total");
  if (!totalsWrapper) {
    totalsWrapper = Array.from(summary.querySelectorAll(".cart-total")).find(
      (el) => el.tagName === "DIV"
    );
  }
  if (!totalsWrapper) return;

  summary.querySelectorAll(".cart-item.clone").forEach((el) => el.remove());

  template.style.display = "";

  cart.forEach((item, index) => {
    const target =
      index === 0
        ? template
        : (() => {
            const clone = template.cloneNode(true);
            clone.classList.add("clone");
            summary.insertBefore(clone, totalsWrapper);
            return clone;
          })();

    target.dataset.id = item.id;
    const imgEl = target.querySelector("img"); 
    const titleEl = target.querySelector(".cart-item-title");
    const priceEl = target.querySelector(".cart-item-price");
    if (imgEl) imgEl.src = item.image;
    if (titleEl) titleEl.textContent = item.name + " (" + item.qty + "x)";
    if (priceEl) priceEl.textContent = formatPrice(item.price);
  });

  updateTotal();
}

  function updateTotal() {
    const cart = getCart();
    const summary = document.querySelector(".checkout-cart-summary");
    if (!summary) return;

    let totalsWrapper = summary.querySelector(":scope > .cart-total");
    if (!totalsWrapper) {
      totalsWrapper = Array.from(summary.querySelectorAll(".cart-total")).find(
        (el) => el.tagName === "DIV"
      );
    }
    if (!totalsWrapper) return;

    const subtotal = cart.reduce((acc, p) => acc + p.price * (p.qty || 1), 0);
    const shipping = cart.length
      ? Math.max(...cart.map((p) => p.shipping || 0))
      : 0;
    const total = subtotal + shipping;

    const subtotalEl = totalsWrapper.querySelector(".cart-subtotal");
    const shippingEl = totalsWrapper.querySelector(".cart-shipping");
    const totalEl = totalsWrapper.querySelector("span.cart-total");

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = formatPrice(shipping);
    if (totalEl) totalEl.textContent = formatPrice(total);
  }

        
    function toggleCreditCardDetails() {
    const selectedPaymentMethod = document.querySelector(
        'input[type="radio"][name="paymentOption"]:checked'
    );

    const element = document.querySelector("#creditCardDetails");

    if (selectedPaymentMethod && selectedPaymentMethod.value === "creditCard") {
        element.style.paddingBlock = "1rem";
        element.style.maxHeight = "1000px"; 
        element.style.overflow = "visible";
        element.querySelectorAll("input, select").forEach(el => (el.disabled = false));
    } else {
        element.style.maxHeight = "0";
        element.style.overflow = "hidden";
        element.style.paddingBlock = "0";
        element.querySelectorAll("input, select").forEach(el => (el.disabled = true));
    }
    }

    const paymentMethodDivs = document.querySelectorAll('div[name="paymentMethod"]');

    paymentMethodDivs[0].querySelector("input").name = "paymentOption";
    paymentMethodDivs[0].querySelector("input").id = "paypal";
    paymentMethodDivs[0].querySelector("input").value = "paypal";
    paymentMethodDivs[0].querySelector("input").checked = false;

    paymentMethodDivs[1].querySelector("input").name = "paymentOption";
    paymentMethodDivs[1].querySelector("input").id = "creditCard";
    paymentMethodDivs[1].querySelector("input").value = "creditCard";
    paymentMethodDivs[1].querySelector("input").checked = true;

    const paymentMethodRadios = document.querySelectorAll('div[name="paymentMethod"] input');

    paymentMethodRadios.forEach(function (radio) {
    radio.addEventListener("change", toggleCreditCardDetails);
    });

    toggleCreditCardDetails();
      
    
let formEl, generalError;

async function getClientIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP:", error);
    return "0.0.0.0";
  }
}

function getDataFromSessionStorage() {
  return {
    session_id:
      MVMT.getSessionId() || localStorage.getItem("mvmt_session_id") || "",
  };
}

function removeObjectUndefinedProperties(obj) {
  for (const key in obj) {
    if (obj[key] === undefined || obj[key] === null || obj[key] === "")
      delete obj[key];
  }
  return obj;
}

const getCardType = (cardNumber) => {
  const cardNumberString = cardNumber.toString().replace(/s/g, "");

  // Visa: Starts with 4
  if (/^4/.test(cardNumberString)) return 2;

  // Mastercard: Starts with 51-55 or 2221-2720
  if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(cardNumberString))
    return 1;

  // American Express: Starts with 34 or 37
  if (/^3[47]/.test(cardNumberString)) return 4;

  // Discover: Starts with 6011, 622126-622925, 644-649, 65
  if (
    /^(6011|622(12[6-9]|1[3-9]|[2-8]|9[0-1][0-9]|92[0-5])|64[4-9]|65)/.test(
      cardNumberString
    )
  )
    return 3;
};


(function() {
  try {
    var klaviyoLifecyclePayload = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(16).slice(2, 8),
      timestamp: Date.now(),
      location: "builder-events/storefront/checkout-js-generator.ts" + ':KlaviyoLifecycle:initialized',
      message: 'Klaviyo lifecycle: initialized',
      runId: 'initial',
      hypothesisId: 'KlaviyoLifecycle',
      data: {
        pageName: "checkout2",
        pageType: "StorefrontCheckout",
        klaviyoConfigured: true,
        emailOversightConfigured: typeof EMAIL_OVERSIGHT_VALIDATE_URL !== 'undefined' && !!EMAIL_OVERSIGHT_VALIDATE_URL,
        klaviyoKeyPrefix: typeof KLAVIYO_PUBLIC_API_KEY === 'string' && KLAVIYO_PUBLIC_API_KEY.length >= 8 ? KLAVIYO_PUBLIC_API_KEY.slice(0, 8) : null,
      },
    };
    if (isKlaviyoDebugEnabled() && typeof console !== 'undefined' && console.log) {
      console.log('[Klaviyo lifecycle] initialized ' + JSON.stringify(klaviyoLifecyclePayload.data));
    }
    try {
      if (typeof sessionStorage !== 'undefined' && !sessionStorage.getItem('klaviyo_first_page') && typeof window !== 'undefined' && window.location)
        sessionStorage.setItem('klaviyo_first_page', window.location.href);
    } catch (e) {}
  } catch (e) {}
})();

function isKlaviyoDebugEnabled() {
  var debugEnabled = false;
  try {
    debugEnabled = !!(typeof window !== 'undefined' && window.__KLAVIYO_DEBUG__ === true);
    if (!debugEnabled) {
      debugEnabled = !!(isTest && typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost');
    }
  } catch (e) {}
  return debugEnabled;
}

function logKlaviyoTrace(step, data) {
  if (!isKlaviyoDebugEnabled()) return;
  try {
    var payload = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(16).slice(2, 8),
      timestamp: Date.now(),
      location: "builder-events/storefront/checkout-js-generator.ts" + ':KlaviyoTrace',
      message: '[Klaviyo trace] ' + step,
      runId: 'initial',
      hypothesisId: 'KlaviyoTrace',
      data: data || {},
    };
    if (typeof console !== 'undefined' && console.log) {
      console.log('[Klaviyo trace] ' + step + ' ' + JSON.stringify(data || {}));
    }
  } catch (e) {}
}

function logKlaviyoLifecycle(step, data) {
  if (isKlaviyoDebugEnabled() && typeof console !== 'undefined' && console.log) {
    console.log('[Klaviyo lifecycle] ' + step + ' ' + JSON.stringify(data || {}));
  }
}

function getAttributionForKlaviyo() {
  var q = (typeof window !== 'undefined' && window.location && window.location.search) ? window.location.search : '';
  if (typeof window !== 'undefined' && window.location && window.location.hash && window.location.hash.indexOf('?') >= 0) {
    q = q || ('?' + window.location.hash.split('?')[1]);
  }
  var params = new URLSearchParams(q);
  var firstPage = null;
  try {
    firstPage = sessionStorage.getItem('klaviyo_first_page');
    if (!firstPage && typeof window !== 'undefined' && window.location) {
      firstPage = window.location.href;
      sessionStorage.setItem('klaviyo_first_page', firstPage);
    }
  } catch (e) {}
  var o = {};
  if (params.get('utm_source')) o.utm_source = params.get('utm_source');
  if (params.get('utm_medium')) o.utm_medium = params.get('utm_medium');
  if (params.get('utm_campaign')) o.utm_campaign = params.get('utm_campaign');
  if (params.get('utm_content')) o.utm_content = params.get('utm_content');
  if (params.get('utm_term')) o.utm_term = params.get('utm_term');
  if (typeof document !== 'undefined' && document.referrer) o.referrer = document.referrer;
  if (firstPage) o.first_page = firstPage;
  return o;
}

function getDialCodeFromItiDom(telEl) {
  try {
    if (!telEl) return null;
    var itiWrapper = telEl.closest && telEl.closest(".iti");
    var selectedEl = itiWrapper && itiWrapper.querySelector && itiWrapper.querySelector(".iti__selected-country-primary");
    var selectedText = selectedEl && selectedEl.textContent ? String(selectedEl.textContent).trim() : "";
    var dialMatch = selectedText ? selectedText.match(/\+(\d+)/) : null;
    return (dialMatch && dialMatch[1]) ? dialMatch[1] : null;
  } catch (e) { return null; }
}

const KLAVIYO_API_REVISION = '2026-01-15';

async function sendKlaviyoEvent(eventData, eventName, source) {
  if (!KLAVIYO_PUBLIC_API_KEY || !eventData || !eventData.email) return;

  var sendData = { eventName: eventName, source: source, emailHint: (eventData.email || '').replace(/(.?).*@(.*)/, '$1***@$2') };
  logKlaviyoTrace('send', sendData);

  var attributionProps = getAttributionForKlaviyo();

  const attributes = {
    email: eventData.email,
  };

  const firstName = eventData.firstName || eventData.first_name || eventData.ship_fname || eventData.bill_fname;
  const lastName = eventData.lastName || eventData.last_name || eventData.ship_lname || eventData.bill_lname;

  if (firstName) attributes.first_name = firstName;
  if (lastName) attributes.last_name = lastName;
  var phoneE164 = null;
  var phoneSource = null;
  var countryIso = null;
  try {
    var telEl = document.querySelector("[data-telephone]");
    if (telEl) {
      var iti = null;
      try {
        if (typeof window !== "undefined" && window.intlTelInputGlobals && typeof window.intlTelInputGlobals.getInstance === "function") {
          iti = window.intlTelInputGlobals.getInstance(telEl);
        }
      } catch (e) {}
      if (iti && typeof iti.getNumber === "function") {
        phoneE164 = iti.getNumber();
        if (phoneE164) phoneSource = 'intlTelInput';
      }
      if (!countryIso && iti && typeof iti.getSelectedCountryData === "function") {
        var cData = iti.getSelectedCountryData();
        if (cData && cData.iso2) {
          countryIso = String(cData.iso2).toUpperCase();
        }
      }
    }
  } catch (e) {}
  if (!phoneE164) {
    var rawPhone = eventData.phone || eventData.phone_number;
    var dialCodeFromDom = getDialCodeFromItiDom(telEl);
    if (rawPhone) {
      var p = String(rawPhone).trim();
      if (p) {
        var digits = p.replace(/\D/g, "");
        if (dialCodeFromDom && digits) {
          var nationalDigits = digits.indexOf(dialCodeFromDom) === 0 ? digits.slice(dialCodeFromDom.length) : digits;
          if (nationalDigits && nationalDigits.length >= 7) {
            phoneE164 = "+" + dialCodeFromDom + nationalDigits;
            phoneSource = 'eventData';
          }
        }
        if (!phoneE164) {
          if (!countryIso) {
            countryIso = (eventData.ship_country || eventData.bill_country || eventData.shippingCountry || eventData.billingCountry || "").toUpperCase();
          }
          if (digits.length === 10 && digits[0] !== "0") {
             phoneE164 = (countryIso === "CA" || countryIso === "US") ? "+1" + digits : "+" + digits;
          } else if (digits.length === 11 && digits[0] === "1") {
            phoneE164 = "+" + digits;
          } else if (p.charAt(0) === "+") {
            phoneE164 = p.replace(/\s/g, "");
          } else if (digits.length >= 10) {
            phoneE164 = "+" + digits;
          }
          if (phoneE164) phoneSource = 'eventData';
        }
      }
    }
  }
  if (phoneE164) {
    var digitsOnly = phoneE164.replace(/\D/g, "");
    var validE164 = digitsOnly.length >= 7 && digitsOnly.length <= 15 && /^[1-9]/.test(digitsOnly);
    if (validE164) {
      phoneE164 = "+" + digitsOnly;
      logKlaviyoLifecycle('phone_resolved', { hasPhone: true, source: phoneSource, e164Redacted: phoneE164.length >= 4 ? '***' + phoneE164.slice(-4) : '***' });
    } else {
      logKlaviyoLifecycle('phone_skipped', { reason: 'not_e164' });
      phoneE164 = null;
    }
  } else if (eventData.phone || eventData.phone_number) {
    logKlaviyoLifecycle('phone_skipped', { reason: 'invalid' });
  } else {
    logKlaviyoLifecycle('phone_resolved', { hasPhone: false, source: null });
  }
  if (phoneE164) attributes.phone_number = phoneE164;

  const address1 = eventData.ship_address1 || eventData.bill_address1 || eventData.shippingAddress1 || eventData.billingAddress1;
  const city = eventData.ship_city || eventData.bill_city || eventData.shippingCity || eventData.billingCity;
  const region = eventData.ship_state || eventData.bill_state || eventData.shippingState || eventData.billingState;
  const zip = eventData.ship_zipcode || eventData.bill_zipcode || eventData.shippingZip || eventData.billingZip;
  const country = eventData.ship_country || eventData.bill_country || eventData.shippingCountry || eventData.billingCountry;
  if (address1 || city || region || zip || country || eventData.ip_address) {
    attributes.location = {};
    if (address1) attributes.location.address1 = address1;
    if (city) attributes.location.city = city;
    if (region) attributes.location.region = region;
    if (zip) attributes.location.zip = zip;
    if (country) attributes.location.country = country;
    if (eventData.ip_address) attributes.location.ip = eventData.ip_address;
  }

  const propertiesForKlaviyo = { ...eventData };
  [
    'creditCardNumber',
    'CVV',
    'expirationDate',
    'card_number',
    'card_cvv',
    'card_exp_month',
    'card_exp_year',
    'phone',
    'phone_number',
  ].forEach((key) => {
    if (key in propertiesForKlaviyo) {
      delete propertiesForKlaviyo[key];
    }
  });

  const klaviyoProfileData = {
    data: {
      type: 'profile',
      attributes: {
        ...attributes,
        properties: {
          ...propertiesForKlaviyo,
          ...attributionProps,
          klaviyo_event_name: eventName,
          source,
          page: "checkout2",
          page_type: "StorefrontCheckout",
          vrio_campaign_id: CAMPAIGN_ID,
        },
      },
    },
  };

  var profileOk = false;


  var hasLocation = !!(address1 || city || region || zip || country || eventData.ip_address);
  logKlaviyoLifecycle('profile_send_start', { eventName: eventName, hasPhone: !!phoneE164, hasLocation: hasLocation });

  var profilePromise = fetch(`https://a.klaviyo.com/client/profiles?company_id=${KLAVIYO_PUBLIC_API_KEY}`, {
    method: 'POST',
    headers: {
      accept: 'application/vnd.api+json',
      revision: KLAVIYO_API_REVISION,
      'content-type': 'application/vnd.api+json',
    },
    body: JSON.stringify(klaviyoProfileData),
    keepalive: true,
  }).then(function(res) {
    profileOk = res.ok;
    logKlaviyoLifecycle('profile_send_done', { status: res.ok ? 'ok' : 'fail', statusCode: res.status });
    if (!res.ok) {
      logKlaviyoTrace('failed', { eventName: eventName, status: res.status });
      if (isTest && window.location.hostname === "localhost") {
        res.text().then(function(t) { console.warn(`Klaviyo profile update failed for event '${eventName}':`, res.status, t); });
      }
    } else {
      logKlaviyoTrace('sent', { eventName: eventName });
      if (isTest && window.location.hostname === "localhost") {
        res.json().then(function(j) { console.log('Klaviyo profile updated for event \'' + eventName + '\':', JSON.stringify(j)); });
      }
    }
    return res;
  }).catch(function(err) {
    logKlaviyoLifecycle('profile_send_done', { status: 'fail' });
    logKlaviyoTrace('error', { eventName: eventName, error: String(err && err.message) });
    if (isTest && window.location.hostname === "localhost") {
      console.error(`Klaviyo error for event '${eventName}':`, err);
    }
  });


  logKlaviyoLifecycle('subscription_skipped', { reason: 'no_list_id' });
  var subscriptionPromise = Promise.resolve();


  try {
    await Promise.allSettled([profilePromise, subscriptionPromise]);
  } catch (e) {}

  if (profileOk) {
    try {
      const eventPayload = {
        data: {
          type: 'event',
          attributes: {
            metric: { data: { type: 'metric', attributes: { name: eventName } } },
            profile: { data: { type: 'profile', attributes: { email: eventData.email } } },
            properties: {
              ...attributionProps,
              source: source,
              page: "checkout2",
              page_type: "StorefrontCheckout",
              vrio_campaign_id: CAMPAIGN_ID,
              klaviyo_event_name: eventName,
            },
            time: new Date().toISOString(),
            unique_id: eventName + '_' + (eventData.email || '') + '_' + Date.now(),
          },
        },
      };
      const eventRes = await fetch(`https://a.klaviyo.com/client/events?company_id=${KLAVIYO_PUBLIC_API_KEY}`, {
        method: 'POST',
        headers: { accept: 'application/vnd.api+json', revision: KLAVIYO_API_REVISION, 'content-type': 'application/vnd.api+json' },
        body: JSON.stringify(eventPayload),
        keepalive: true,
      });
      if (!eventRes.ok && typeof console !== 'undefined' && console.warn) {
        console.warn('[Klaviyo] event track failed', eventRes.status);
      }
    } catch (e) {}
  }
}

async function validateAndSendToKlaviyo(eventData, eventName, source) {
  try {
    if (!eventData || !eventData.email || !EMAIL_OVERSIGHT_VALIDATE_URL) {
      logKlaviyoTrace('EO skip (no URL or email), sending to Klaviyo', { eventName: eventName, source: source });
      await sendKlaviyoEvent(eventData, eventName, source);
      return;
    }

    logKlaviyoTrace('EO validate', { eventName: eventName, source: source, emailHint: (eventData.email || '').replace(/(.?).*@(.*)/, '$1***@$2') });

    const payload = {
      email: eventData.email,
      source,
    };

    const response = await fetch(EMAIL_OVERSIGHT_VALIDATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });

    if (!response.ok) {
      logKlaviyoTrace('EO request failed, fallback to Klaviyo', { eventName: eventName, status: response.status });
      await sendKlaviyoEvent(eventData, eventName, source);
      return;
    }

    const result = await response.json();

    if (result && result.valid === false) {
      logKlaviyoTrace('EO invalid, skipping Klaviyo', { eventName: eventName, reason: result.reason });
      return;
    }

    logKlaviyoTrace('EO valid, sending to Klaviyo', { eventName: eventName });
    await sendKlaviyoEvent(eventData, eventName, source);
  } catch (error) {
    logKlaviyoTrace('EO error, fallback to Klaviyo', { eventName: eventName, error: String(error && error.message) });
    await sendKlaviyoEvent(eventData, eventName, source);
  }
}


//Creates error element near submit button for system errors
function getOrCreateErrorElement() {
  var el = document.querySelector("[data-general-error]");
  if (el) return el;
  
  var submitBtn = document.querySelector("[data-submit-button]") || document.querySelector("button[type='submit']") || document.querySelector("form button");
  if (submitBtn && submitBtn.parentNode) {
    el = document.createElement("div");
    el.setAttribute("data-general-error", "");
    el.style.cssText = "background:#fee2e2;border:1px solid #ef4444;color:#b91c1c;padding:12px 16px;border-radius:6px;margin-bottom:12px;font-size:14px;display:none;";
    submitBtn.parentNode.insertBefore(el, submitBtn);
    return el;
  }
  return null;
}

//Creates payment error element above payment container for Kount/payment declines
function getOrCreatePaymentErrorElement() {
  var el = document.querySelector("[data-payment-error]");
  if (el) return el;
  
  // Find payment container - traverse up from card field to find main container
  var cardField = document.querySelector("[data-card-number]");
  if (!cardField) return getOrCreateErrorElement();
  
  // Go up to find the payment container (typically 3-4 levels up from input)
  var paymentContainer = cardField.parentNode;
  for (var i = 0; i < 3 && paymentContainer && paymentContainer.parentNode; i++) {
    paymentContainer = paymentContainer.parentNode;
  }
  
  if (paymentContainer && paymentContainer.parentNode) {
    el = document.createElement("div");
    el.setAttribute("data-payment-error", "");
    el.style.cssText = "background:#fee2e2;border:1px solid #ef4444;color:#b91c1c;padding:12px 16px;border-radius:6px;margin-bottom:12px;font-size:14px;display:none;";
    paymentContainer.parentNode.insertBefore(el, paymentContainer);
    return el;
  }
  
  return getOrCreateErrorElement();
}

//Handles Kount fraud decline
function handlePaymentDecline() {
  const cardNumberEl = document.querySelector("[data-card-number]");
  const expiryEl = document.querySelector("[data-month-year]");
  const cvvEl = document.querySelector("[data-card-cvv]");
  
  if (cardNumberEl) cardNumberEl.value = "";
  if (expiryEl) expiryEl.value = "";
  if (cvvEl) cvvEl.value = "";

  var paymentErrorEl = getOrCreatePaymentErrorElement();
  if (paymentErrorEl) {
    paymentErrorEl.innerText = i18n.errors.paymentDeclined;
    paymentErrorEl.style.display = "block";
    try {
      paymentErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (e) {}
  }

  var preload = document.querySelector("[data-preloader]");
  if (preload) preload.style.display = "none";
}

//Handles system/configuration errors (HTTP 400, 5xx)
function handleSystemError(errorCode) {
  var errorMsg = (errorCode === "offer_invalid" || errorCode === "campaign_invalid" || errorCode === "product_invalid")
    ? i18n.errors.systemErrorOffer
    : i18n.errors.systemErrorGeneric;

  var generalErrorEl = getOrCreateErrorElement();
  if (generalErrorEl) {
    generalErrorEl.innerText = errorMsg;
    generalErrorEl.style.display = "block";
    try {
      generalErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (e) {}
  }

  var preload = document.querySelector("[data-preloader]");
  if (preload) preload.style.display = "none";
}

async function createOrderViaPaypal() { 
  const formData = new FormData(formEl);
  const data = Object.fromEntries(formData);
  if (isTest && window.location.hostname === "localhost")
  console.log("Creating order", data);
  const preload = document.querySelector("#preload");
  if (preload) preload.style.display = "flex";
  const {
    firstName,
    lastName,
    email,
    phone,
    shippingAddress1,
    shippingCity,
    shippingState,
    shippingCountry,
    shippingZip,
    creditCardNumber,
    expirationDate,
    CVV,
  } = data;

  const [exp_month, exp_year] = expirationDate.split("/");
  const billShipSameCheckbox = document.getElementById("billShipSame");
  const orderData = {
    pageId: "4jM1JlazAwajs9m-mqP3Mm2M0c3qef1kc6HCB5aDqDSxRIZuo0wj7KpCjxiUexg_",
    action: "process",
    campaign_id: CAMPAIGN_ID,
    connection_id: 1, // VRIO URL ending /connection
    email: email,
    phone: phone,
    ship_fname: firstName,
    ship_lname: lastName,
    ship_address1: shippingAddress1,
    ship_city: shippingCity,
    ship_state: shippingState,
    ship_zipcode: shippingZip,
    ship_country: shippingCountry,
    same_address: true,
    payment_method_id: 1,
    card_type_id: getCardType(creditCardNumber),
    card_number: creditCardNumber,
    card_exp_month: exp_month,
    card_exp_year: exp_year,
    card_cvv: CVV,

    ...getDataFromSessionStorage(),
    ip_address: await getClientIP(),
  };

  if (!orderData.offers) {
    orderData.offers = [];
  }
  getCart().forEach((product) => {
    orderData.offers.push({
      offer_id: OFFER_ID,
      item_id: product.id,
      order_offer_quantity: product.qty,
    });
    const selectedProductElement = getProductElement(product.id);
    saveProductCustomData(selectedProductElement);
    let { product: shippable, quantity } = getBindedShippableProductAndQuantity(selectedProductElement) ?? {};
    if (shippable) {
      orderData.offers.push({
        offer_id: OFFER_ID,
        item_id: shippable.id,
        order_offer_quantity: quantity,
      });
    }
  });

  orderData.payment_method_id = "6";
  sessionStorage.setItem("orderData", JSON.stringify(orderData));
  const bodyCart = {
    campaignId: CAMPAIGN_ID,
    offers: [],
  };
  getCart().forEach((product) => {
    bodyCart.offers.push({
      offer_id: OFFER_ID,
      item_id: product.id,
      order_offer_quantity: product.qty,
    });
  });

  const sanitizedOrderData = removeObjectUndefinedProperties(bodyCart);
  let cartResponse = await fetch(
    `https://app-cms-api-proxy-dev-001.azurewebsites.net/vrio/carts`, {
    method: 'POST',
    headers: {
      authorization: `appkey ${INTEGRATION_ID}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      offers: sanitizedOrderData.offers,
      campaign_id: sanitizedOrderData.campaignId,
      connection_id: sanitizedOrderData.connection_id,
    }),
    keepalive: false,
  });
  if (cartResponse.status === 200) {
    cartResponse = await cartResponse.json();
    const cartToken = cartResponse.cart_token
    console.log("cartResponse", cartResponse)
    sessionStorage.setItem("cart_token", cartToken);
    let redirectUrl;
    if (cartToken) {
      const host = window.location.hostname;
      if (host === "localhost" || host === "127.0.0.1") {
        redirectUrl = "https://app-cms-api-proxy-staging-001.azurewebsites.net/checkout";
      } else {
        redirectUrl = window.location.href;
      }
      let paymentTokenResponse = await fetch(
        `https://app-cms-api-proxy-dev-001.azurewebsites.net/vrio/carts/${cartToken}/payment_tokens`,
        {
          method: "POST",
          headers: {
            authorization: `appkey ${INTEGRATION_ID}`,
            "Content-Type": "application/json",
            "connection": "keep-alive",
            "keep-alive": "utf-8"
          },
          body: JSON.stringify({ "redirect_url": redirectUrl, "payment_method_id": 6 })
        });
      orderData.redirect_url = redirectUrl;
      orderData.payment_token = paymentTokenResponse?.payment_token_id;
      orderData.cart_token = cartToken;
      const responseDataPaypal = await paymentTokenResponse.json();
      sessionStorage.setItem(
        "payment_token_id",
        responseDataPaypal.payment_token_id,
      );
      sessionStorage.setItem("productCustomData", JSON.stringify(productCustomData));

      window.location.href = responseDataPaypal.post_data;
    }
  }
}

async function createOrderViaCreditCard() {
  const formData = new FormData(formEl);
  const data = Object.fromEntries(formData);

  if (isTest && window.location.hostname === "localhost")
    console.log("Creating order", data);

  const preload = document.querySelector("#preload");

  if (preload) preload.style.display = "flex";

  const {
    firstName,
    lastName,
    email,
    phone,
    shippingAddress1,
    shippingCity,
    shippingState,
    shippingCountry,
    shippingZip,
    billingAddress1,
    billingCity,
    billingState,
    billingCountry,
    billingZip,
    creditCardNumber,
    expirationDate,
    CVV,
  } = data;

  const [exp_month, exp_year] = expirationDate.split("/");
  const billShipSameCheckbox = document.getElementById("billShipSame");
  const orderData = {
    pageId: "4jM1JlazAwajs9m-mqP3Mm2M0c3qef1kc6HCB5aDqDSxRIZuo0wj7KpCjxiUexg_",
    action: "process",
    campaign_id: CAMPAIGN_ID,
    connection_id: 1, // VRIO URL ending /connection
    email: email,
    phone: phone,
    ship_fname: firstName,
    ship_lname: lastName,
    ship_address1: shippingAddress1,
    ship_city: shippingCity,
    ship_state: shippingState,
    ship_zipcode: shippingZip,
    ship_country: shippingCountry,
    same_address: true,
    payment_method_id: 1,
    card_type_id: getCardType(creditCardNumber),
    card_number: creditCardNumber,
    card_exp_month: exp_month,
    card_exp_year: exp_year,
    card_cvv: CVV,

    ...getDataFromSessionStorage(),
    ip_address: await getClientIP(),
  };


  if (!orderData.offers) {
    orderData.offers = [];
  }
  getCart().forEach((product) => {
    orderData.offers.push({
      offer_id: OFFER_ID,
      item_id: product.id,
      order_offer_quantity: product.qty,
    });
    const selectedProductElement = getProductElement(product.id);
    saveProductCustomData(selectedProductElement);
    let { product: shippable, quantity } = getBindedShippableProductAndQuantity(selectedProductElement) ?? {};
    if (shippable) {
      orderData.offers.push({
        offer_id: OFFER_ID,
        item_id: shippable.id,
        order_offer_quantity: quantity,
      });
    }
  });

  const sanitizedOrderData = removeObjectUndefinedProperties(orderData);

  if (isTest && window.location.hostname === "localhost") {
    console.log("Sending order to VRIO", { sanitizedOrderData });
  }
  try {
    if (typeof validateAndSendToKlaviyo === "function") {
      const klaviyoPreOrderData = { ...sanitizedOrderData };
      validateAndSendToKlaviyo(
        klaviyoPreOrderData,
        "Order Attempt - Pre-VRIO Submission",
        "order"
      );
    }
  } catch (_) {}
  MVMT.track("ORDER_SUBMITTED", {
    page: "checkout2",
    page_type: "StorefrontCheckout",
    page_url: window.location.href,
    order_data: sanitizedOrderData,
  });

  try {

    const response = await fetch(
      "https://app-cms-api-proxy-dev-001.azurewebsites.net/vrio/orders",
      {
        method: "POST",
        headers: {
         authorization: `appkey ${INTEGRATION_ID}`,
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(sanitizedOrderData),
      }
    );

    if (response.status === 403) {
      handlePaymentDecline();
      if (window.MVMT) {
        MVMT.track("ORDER_ERROR", {
          page: "checkout2",
          page_type: "StorefrontCheckout",
          page_url: window.location.href,
          order_data: sanitizedOrderData,
          response: { error: "payment_declined", status: 403 },
        });
      }
      return;
    }

    const result = await response.json();

    if (isTest) console.log("VRIO Order Response", result);

    if (result.error) {
      var errorCode = (result.error && result.error.code) || null;
      
      if (response.status === 400 && errorCode && ["offer_invalid", "campaign_invalid", "product_invalid"].includes(errorCode)) {
        handleSystemError(errorCode);
        MVMT.track("ORDER_ERROR", {
          page: "checkout2",
          page_type: "StorefrontCheckout",
          page_url: window.location.href,
          order_data: sanitizedOrderData,
          response: result,
        });
        return;
      }

      if (preload) preload.style.display = "none";

      if (generalError) {
        generalError.innerText =
          result.error.message ||
          i18n.errors.creditCardOrderFailed;
        generalError.style.display = "block";
        const timer = setTimeout(() => {
          generalError.style.display = "none";
          clearTimeout(timer);
        }, 4000);
      }

      MVMT.track("ORDER_ERROR", {
        page: "checkout2",
        page_type: "StorefrontCheckout",
        page_url: window.location.href,
        order_data: sanitizedOrderData,
        response: result,
      });
      return;
    }

    MVMT.track("ORDER_SUCCESS", {
      page: "checkout2",
      page_type: "StorefrontCheckout",
      page_url: window.location.href,
      order_data: sanitizedOrderData,
      response: result,
    });

    sessionStorage.setItem("orderData", JSON.stringify(orderData));
    sessionStorage.setItem("productCustomData", JSON.stringify(productCustomData));
    sessionStorage.setItem("cms_oid", result.order_id);
    sessionStorage.setItem("orderids", JSON.stringify([result.order_id]));
    sessionStorage.removeItem('cart');

    try {
      if (typeof validateAndSendToKlaviyo === "function") {
        const klaviyoPostOrderData = {
          ...sanitizedOrderData,
          vrio_order_id: result.order_id,
          vrio_response_status: 'success',
        };
        await validateAndSendToKlaviyo(
          klaviyoPostOrderData,
          "Order Success - VRIO Confirmation",
          "order"
        );
      }
    } catch (_) {}

    window.location.href = "/" + nextPageSlug;

  } catch (error) {
    console.error(error);
  }


}

  async function sendLead() {
  const formData = new FormData(formEl);
  const orderData = {
    pageId: "4jM1JlazAwajs9m-mqP3Mm2M0c3qef1kc6HCB5aDqDSxRIZuo0wj7KpCjxiUexg_",
    connection_id: 1,
    campaignId: CAMPAIGN_ID,
    first_name: formData.get("firstName"),
    last_name: formData.get("lastName"),
    email: formData.get("email"),
    offers: [
      {
        offer_id: OFFER_ID,
        order_offer_quantity: 1,
      },
    ],
  };

 const sanitizedOrderData = removeObjectUndefinedProperties(orderData);

  if (isTest && window.location.hostname === "localhost") {
    console.log("Sending Lead/Partial to VRIO", { sanitizedOrderData });
  }
    MVMT.track("LEAD_SUBMITTED", {
    page: "checkout2",
    page_type: "StorefrontCheckout",
    page_url: window.location.href,
    order_data: sanitizedOrderData,
  });

  try {
    if (typeof validateAndSendToKlaviyo === "function") {
      const klaviyoLeadData = {
        ...sanitizedOrderData,
        firstName: sanitizedOrderData.first_name,
        lastName: sanitizedOrderData.last_name,
      };
      validateAndSendToKlaviyo(
        klaviyoLeadData,
        "Lead Submitted - VRIO Prospect",
        "lead"
      );
    }
  } catch (_) {}

   await fetch(`https://app-cms-api-proxy-dev-001.azurewebsites.net/vrio/customers`, {
      method: "POST",
      headers: {
        authorization: `appkey ${INTEGRATION_ID}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(sanitizedOrderData),
      keepalive: false,
  });

   let cartResponse = await fetch(
      `https://app-cms-api-proxy-dev-001.azurewebsites.net/vrio/carts`, {
        method: 'POST',
        headers: {
        authorization: `appkey ${INTEGRATION_ID}`,
        "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          offers: sanitizedOrderData.offers,
          campaign_id: sanitizedOrderData.campaignId,
          connection_id: sanitizedOrderData.connection_id,
        }),
        keepalive: false,
  });
  if (cartResponse.status === 200) {
    cartResponse = await cartResponse.json();
    sessionStorage.setItem("cart_token", cartResponse.cart_token);
  }
}

const fieldsAttributes = {
  "[data-email]": { name: "email" },
  "[data-first-name]": { name: "firstName" },
  "[data-last-name]": { name: "lastName" },
  "[data-telephone]": { name: "phone" },
  "[data-line-1]": { name: "shippingAddress1" },
  "[data-line-2]": { name: "shippingAddress2" },
  "[data-city]": { name: "shippingCity" },
  "[data-select-countries]": { name: "shippingCountry" },
  "[data-select-states]": { name: "shippingState" },
  "[data-zip-code]": { name: "shippingZip" },
  "[data-billing-line-1]": { name: "billingAddress1" },
  "[data-billing-line-2]": { name: "billingAddress2" },
  "[data-billing-city]": { name: "billingCity" },
  "[data-billing-select-countries]": { name: "billingCountry" },
  "[data-billing-select-states]": { name: "billingState" },
  "[data-billing-zip-code]": { name: "billingZip" },
  "[data-month-year]": { name: "expirationDate" },
  "[data-card-number]": { name: "creditCardNumber" },
  "[data-card-cvv]": { name: "CVV" },
  "[data-phone]": { name: "phone" },
  "[data-submit-button]": { name: "submit_button" },
  "[data-full-name]": { name: "full_name" },
};
 
document.addEventListener("DOMContentLoaded", async () => {
  
if (typeof validateAndSendToKlaviyo === "function") {
  try {
    var klaviyoDebugEnabled = false;
    try {
      klaviyoDebugEnabled = typeof isKlaviyoDebugEnabled === "function"
        ? isKlaviyoDebugEnabled()
        : !!(typeof window !== "undefined" && window.__KLAVIYO_DEBUG__ === true);
    } catch (e) {}
    var pageReadyPayload = {
      id: "log_" + Date.now() + "_" + Math.random().toString(16).slice(2, 8),
      timestamp: Date.now(),
      location: "builder-events/storefront/checkout-js-generator.ts" + ":KlaviyoLifecycle:page_ready",
      message: "Klaviyo lifecycle: page ready",
      runId: "initial",
      hypothesisId: "KlaviyoLifecycle",
      data: { pageName: "checkout2", pageType: "StorefrontCheckout" },
    };
    if (klaviyoDebugEnabled && typeof console !== "undefined" && console.log) {
      console.log("[Klaviyo lifecycle] page_ready " + JSON.stringify(pageReadyPayload.data));
    }
  } catch (e) {}
}

 let isSameShippingAddress = true;
  // Load International Telephone Input CSS
  const input = document.querySelector("[data-telephone]");
  if (input) {
    (function () {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdn.jsdelivr.net/npm/intl-tel-input@24.3.6/build/css/intlTelInput.css";
      document.head.appendChild(link);
      var script = document.createElement("script");
      script.setAttribute("is", "inline");
      script.src =
        "https://cdn.jsdelivr.net/npm/intl-tel-input@24.3.6/build/js/intlTelInput.min.js";
      document.body.appendChild(script);
    })();
    const renderIntlTelInput = function () {
      var PHONE_LOCALE_MAP = {"DE":"de-DE","ES":"es-ES","FR":"fr-FR","IT":"it-IT","US":"en-US","GB":"en-GB","AU":"en-AU","CA":"en-CA"};
      var regionNames = null;
      try { regionNames = new Intl.DisplayNames([PHONE_LOCALE_MAP[i18n.iso2] || LOCALE], { type: 'region' }); } catch {}
      var phoneI18n = Object.fromEntries(
        getCountries().map((c) => [
          c.iso_2.toLowerCase(),
          (regionNames ? regionNames.of(c.iso_2) : null) || c.name || c.iso_2,
        ])
      );
      phoneI18n.searchPlaceholder = i18n.labels.phoneSearchPlaceholder;
      const iti = window.intlTelInput(input, {
        utilsScript:
          "https://cdn.jsdelivr.net/npm/intl-tel-input@24.3.6/build/js/utils.js",
        initialCountry: i18n.phoneInitialCountry,
        strictMode: true,
        onlyCountries: getCountries().map((c) => c.iso_2.toLowerCase()),
        i18n: phoneI18n,
      });
      document.querySelector(".iti").style.width = "100%";
    };
    if (!window.intlTelInput) {
      setTimeout(() => {
        renderIntlTelInput();
      }, 200);
    } else {
      renderIntlTelInput();
    }
  }
  initializeFormValidation();
  function getInputs() {
    if (isSameShippingAddress) {
      return document.querySelectorAll(`
        [data-first-name], 
        [data-last-name], 
        [data-email], 
        [data-telephone],
        [data-card-number],
        [data-month-year],
        [data-card-cvv],
        [data-line-1],
        [data-city],
        [data-zip-code]
      `);
    }

    return document.querySelectorAll(`
      [data-first-name], 
      [data-last-name], 
      [data-email], 
      [data-telephone],
      [data-card-number],
      [data-month-year],
      [data-card-cvv],
      [data-line-1],
      [data-city],
      [data-zip-code],
      [data-billing-line-1],
      [data-billing-city],
      [data-billing-zip-code]
    `);
  }


formEl = document.querySelector("[data-payment-form]");
  if (formEl) {
    formEl.addEventListener("submit", () => {
      const selectedPaymentMethod = document.querySelector(
        'input[name="paymentOption"]:checked'
      )?.value;

      if (selectedPaymentMethod === "paypal") {
        validate.removeField("[data-month-year]");
        validate.removeField("[data-card-number]");
        validate.removeField("[data-card-cvv]");
      } else {
        validate
          .addField("[data-month-year]", [
            {
              rule: "required",
              errorMessage: i18n.validation.expirationDateRequired,
            },
            {
              validator: (value) => {
                // Expecting MM/YY
                const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
                if (!regex.test(value)) return false;

                const [month, year] = value.split('/').map(Number);

                // Convert YY → YYYY (20xx)
                const fullYear = 2000 + year;

                const now = new Date();
                const expiry = new Date(fullYear, month); // first day of next month

                return expiry > now;
              },
              errorMessage: i18n.validation.expirationDateInvalid,
            }
          ])
         .addField("[data-card-number]", [
          {
            rule: "required",
            errorMessage: i18n.validation.cardNumberRequired,
          },
          {
            validator: (value) => {
              const cardNumber = value.replace(/s/g, '');
              const testCards = [
                "1444444444444440",
                "4111222233334444"
              ];

              if (testCards.includes(cardNumber)) return true;

              if (!/^d{13,19}$/.test(cardNumber)) return false;

              let sum = 0;
              let shouldDouble = false;
              for (let i = cardNumber.length - 1; i >= 0; i--) {
                let digit = parseInt(cardNumber.charAt(i));
                if (shouldDouble) {
                  digit *= 2;
                  if (digit > 9) digit -= 9;
                }
                sum += digit;
                shouldDouble = !shouldDouble;
              }

              return sum % 10 === 0;
            },
            errorMessage: i18n.validation.cardNumberInvalid,
        },
       ])
          .addField("[data-card-cvv]", [
            {
              rule: "required",
              errorMessage: i18n.validation.cardCvvRequired,
            },
          ]);
      }
      return false;
    });
   
  }

    generalError = document.querySelector("[data-general-error]");
    const validate = new JustValidate(formEl, {
    errorFieldCssClass: ["field__is-invalid"],
    errorLabelCssClass: ["label__is-invalid"],
    validateBeforeSubmitting: true,
    validateOnBlur: true,
    focusInvalidField: true,
    lockForm: true,
    tooltip: {
      position: "top",
    },
    errorFieldCssClass: "is-invalid",
    errorLabelCssClass: "error-message",
    errorLabelStyle: {
      color: "#ff3860",
      marginTop: "0.25rem",
      fontSize: "0.875rem",
    },
  });

  const originalRevalidateField = validate.revalidateField.bind(validate);
  validate.revalidateField = async (selector) => {
    const aliasMap = {
      "[data-line-1]": "[data-line-1]",
      "[data-city]": "[data-city]",
      "[data-zip-code]": "[data-zip-code]",
      "[data-select-countries]": "[data-select-countries]",
      "[data-select-states]": "[data-select-states]",
      "[data-billing-line-1]": "[data-billing-line-1]",
      "[data-billing-city]": "[data-billing-city]",
      "[data-billing-zip-code]": "[data-billing-zip-code]",
      "[data-billing-select-countries]": "[data-billing-select-countries]",
      "[data-billing-select-states]": "[data-billing-select-states]",
    };

    const mappedSelector = aliasMap[selector] || selector;

    try {
      return await originalRevalidateField(mappedSelector);
    } catch (e) {
      if (isTest) {
        console.error("JustValidate revalidateField error", { selector, mappedSelector, error: e });
      }
      throw e;
    }
  };

  async function initializeFormValidation() {
    const expiryInput = document.querySelector('[data-month-year]');
    if (expiryInput) {
      expiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
          value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
      });
    }

    const fields = getInputs();
    const validateField = async (field) => {
      const dataAttr = Object.keys(field.dataset)[0]?.replace(
        /[A-Z]/g,
        (letter) => `-${letter.toLowerCase()}`
      );
      if (dataAttr) {
        const selector = `[data-${dataAttr}]`;
        const isValid = await validate.revalidateField(selector);
        if (!isValid) {
          field.classList.add("error");
        } else {
          field.classList.remove("error");
          field.classList.add("valid");
        }
      }
    };

    let debounceTimer;
    Array.from(fields).forEach((field) => {
      field.addEventListener("input", async () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          await validateField(field);
        }, 500);
      });
      field.addEventListener("blur", () => validateField(field));
    });
  }
 // Just Validate validation for each field in the form
  validate
    .addField("[data-email]", [
      {
        rule: "required",
        errorMessage: i18n.validation.emailRequired,
      },
      {
        rule: "email",
        errorMessage: i18n.validation.emailInvalid,
      },
      {
        rule: "maxLength",
        value: 255,
        errorMessage: i18n.validation.maxLength255,
      },
    ])
    .addField("[data-first-name]", [
      {
        rule: "required",
        errorMessage: i18n.validation.firstNameRequired,
      },

      {
        rule: "maxLength",
        value: 255,
        errorMessage: i18n.validation.maxLength255,
      },
      {
        rule: "customRegexp",
        value: i18n.validationPatterns.nameRegex,
        errorMessage: i18n.validation.invalidCharacter,
      },
    ])
    .addField("[data-last-name]", [
      {
        rule: "required",
        errorMessage: i18n.validation.lastNameRequired,
      },

      {
        rule: "maxLength",
        value: 255,
        errorMessage: i18n.validation.maxLength255,
      },
      {
        rule: "customRegexp",
        value: i18n.validationPatterns.nameRegex,
        errorMessage: i18n.validation.invalidCharacter,
      },
    ])
    .addField("[data-line-1]", [
      {
        rule: "required",
        errorMessage: i18n.validation.shippingAddressRequired,
      },
      {
        rule: "maxLength",
        value: 255,
        errorMessage: i18n.validation.maxLength255,
      },
    ])
    .addField("[data-city]", [
      {
        rule: "required",
        errorMessage: i18n.validation.cityRequired,
      },
      {
        rule: "maxLength",
        value: 255,
        errorMessage: i18n.validation.maxLength255,
      },
    ])
    .addField("[data-select-countries]", [
      {
        rule: "required",
        errorMessage: i18n.validation.countryRequired,
      },
    ])
    .addField("[data-select-states]", [
      {
        rule: "required",
        errorMessage: i18n.validation.stateRequired,
      },
    ])
    .addField("[data-zip-code]", [
      {
        rule: "required",
        errorMessage: i18n.validation.zipRequired,
      },
      {
        rule: "customRegexp",
        value: i18n.validationPatterns.zipCodeRegex,
        errorMessage: i18n.validation.zipInvalid,
      },
    ])
    .onFail((fields) => {
      const fieldsArray = Object.entries(fields);
      for (let i = 0; i < fieldsArray.length; i += 1) {
        const [fieldSelector, data] = fieldsArray[i];
        const field = document.querySelector(fieldSelector);
        data.isValid
          ? field.classList.remove("error")
          : field.classList.add("error");
      }
      const id = setTimeout(() => {
        const field = fieldsArray[0][1];
        field.elem.scrollIntoView({ behavior: "smooth", block: "center" });
        clearTimeout(id);
      }, 150);
    })
    .onSuccess((events) => {
      if (isTest) console.log(events);
       const isPaypal =
        document.querySelector('input[name="paymentOption"]:checked')?.value ===
        "paypal";
      if (isPaypal) {
        createOrderViaPaypal();
      } else {
        createOrderViaCreditCard();

      }
      

    });

  const billShipSameCheckbox = document.getElementById("billShipSame");
  if (billShipSameCheckbox) {
    billShipSameCheckbox.addEventListener("change", () => {
      isSameShippingAddress = billShipSameCheckbox.checked;
      modifyFormValidation();
      initializeFormValidation();
    });
  }

  function modifyFormValidation() {
    if (isSameShippingAddress) {
      [
        "[data-billing-line-1]",
        "[data-billing-city]",
        "[data-billing-zip-code]",
      ].forEach((field) => {
        validate.removeField(field);
      });
    } else {
      validate.addField("[data-billing-line-1]", [
        {
          rule: "required",
          errorMessage: i18n.validation.billingAddressRequired,
        },
      ]);
      validate.addField("[data-billing-city]", [
        {
          rule: "required",
          errorMessage: i18n.validation.billingCityRequired,
        },
      ]);
      validate.addField("[data-billing-zip-code]", [
        {
          rule: "required",
          errorMessage: i18n.validation.billingZipRequired,
        },
        {
          rule: "customRegexp",
          value: i18n.validationPatterns.zipCodeRegex,
          errorMessage: i18n.validation.zipInvalid,
        },
      ]);
    }
  }

  const cardInput = document.querySelector("[data-card-number]");
  cardInput.addEventListener("input", (e) => {
    if (e.target.value.length > 16) e.target.value = e.target.value.slice(0,16)
  });
  // Card expirity date validation
  const dateinput = document.querySelector("[data-month-year]");
  dateinput.addEventListener("beforeinput", (e) => {
    const input = e.data;
    if (input && !/[0-9/]/.test(input)) {
      e.preventDefault();
    }
  });

    for (const selector in fieldsAttributes) {
    const field = document.querySelector(selector);
    if (field) {
      Object.entries(fieldsAttributes[selector]).forEach(
        ([attribute, value]) => {
          field.setAttribute(attribute, value);
        }
      );
    }
  }

});


// Toast
function showToast(message, bg = "#333") {
  const container =
    document.querySelector("#toast-container") ||
    (() => {
      const div = document.createElement("div");
      div.id = "toast-container";
      div.style.position = "fixed";
      div.style.top = "10px";
      div.style.right = "10px";
      div.style.zIndex = "9999";
      document.body.appendChild(div);
      return div;
    })();

  const toast = document.createElement("div");
  toast.className = "mytoast";
  toast.textContent = message;
  toast.style.background = bg;
  toast.style.color = "#fff";
  toast.style.padding = "10px 15px";
  toast.style.marginTop = "5px";
  toast.style.borderRadius = "5px";
  toast.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3500);
}

 