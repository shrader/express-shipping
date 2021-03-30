"use strict";
const request = require("supertest");
const app = require("../app");
const shipItApi = require('../shipItApi');
shipItApi.shipProduct = jest.fn();


describe("POST /", function () {
  test("valid", async function () {
    shipItApi.shipProduct.mockReturnValue(1234);
    // console.log(shipItApi.shipProduct());
    
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zipcode: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: 1234 });
    expect(resp.statusCode).toEqual(200);
  });

  xtest("invalid", async function () {
    shipItApi.shipProduct.mockReturnValue({ receipt: { shipId: 2345 } });
    
    const resp = await request(app).post("/shipments").send({
      productId: 500,
      name: "Test Tester",
      addr: 20,
      zipcode: "1234",
    });

    expect(resp.body.error).toEqual({ message: expect.any(Array) }); //check for # of messages
    expect(resp.body.error.message.length).toEqual(3);
    expect(resp.statusCode).toEqual(400);
  });
});
