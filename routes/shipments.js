"use strict";
const jsonschema = require("jsonschema");
const orderSchema = require("../schemas/shippingSchema.json");
const express = require("express");
const router = new express.Router();
const {BadRequestError} = require("../expressError.js");

const { shipProduct } = require("../shipItApi");

/** POST /ship
 *
 * VShips an order coming from json body:
 *   { productId, name, addr, zip }
 *
 * Returns { shipped: shipId }
 */

router.post("/", async function (req, res, next) {
  const result = jsonschema.validate(req.body, orderSchema);
  if (!result.valid) {
    // pass validation errors to error handler
    //  (the "stack" key is generally the most useful)
    let errs = result.errors.map(err => err.stack);
    throw new BadRequestError(errs);
  }
  const { productId, name, addr, zip } = req.body;
  const shipId = await shipProduct({ productId, name, addr, zip });

  return res.json({ shipped: shipId });
});


module.exports = router;