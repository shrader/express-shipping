"use strict";
const request = require("supertest");
const shipItApi = require('../shipItApi');
shipItApi.shipProduct = jest.fn();
const app = require("../app");


describe("POST /", function () {
  test("valid", async function () {
    shipItApi.shipProduct.mockReturnValue(1234);
    // console.log(shipItApi.shipProduct());
    
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: 1234 });
    expect(resp.statusCode).toEqual(200);
  });

  test("invalid", async function () {
    shipItApi.shipProduct.mockReturnValue( 2345 );
    
    const resp = await request(app).post("/shipments").send({
      productId: 500,
      name: "Test Tester",
      addr: 20,
      zip: "1234",
    });

    expect(resp.body.error).toEqual({ message: expect.any(Array), status: 400 }); //check for # of messages
    expect(resp.body.error.message.length).toEqual(3);
  });
});

describe("POST /multi", function () {
  test("valid", async function () {
    shipItApi.shipProduct.mockReturnValue(1234);
    // console.log(shipItApi.shipProduct());
    
    const resp = await request(app).post("/shipments/multi").send({
      productIds: [1000, 1500],
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: [1234, 1234] });
    expect(resp.statusCode).toEqual(200);
  });

  test("invalid", async function () {
    shipItApi.shipProduct.mockReturnValue( 2345 );
    
    const resp = await request(app).post("/shipments/multi").send({
      productIds: [500,600],
      name: "Test Tester",
      addr: 20,
      zip: "1234",
    });

    expect(resp.body.error).toEqual({ message: expect.any(Array), status: 400 }); 
    expect(resp.body.error.message.length).toEqual(4);
  });
});

