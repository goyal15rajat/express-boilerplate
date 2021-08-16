const app = require("../../app");
const request = require("supertest");
const supertest = require("supertest");
const mongoose_conn = require("../../core/connections/mongoose");

afterAll(async () => await mongoose_conn.connection.close());


describe("GET /boilerplate/test_app/_version", () => {
    test("It should respond with 200", async () => {
        const response = await supertest(app).get("/boilerplate/test_app/_version");
        expect(response.statusCode).toBe(200);
    });
});