const engines = require("consolidate");
const express = require("express");

const {
  renderCheckout,
  renderCheckoutWithShippingSection,
  renderSuccess
} = require("./controllers/checkout.js");
const { createOrder } = require("./controllers/transaction.js");

function configureServer(app) {
  app.engine("html", engines.mustache);
  app.set("view engine", "html");
  app.set("views", "./server/src/views");

  app.enable("strict routing");

  app.use(express.json());

  app.get("/", renderCheckout);
  app.get("/shipping", renderCheckoutWithShippingSection);
  app.get("/success",   renderSuccess);
  app.post("/transaction", createOrder);
  app.use(express.static("./client"));
}

module.exports = {
  configureServer,
};
