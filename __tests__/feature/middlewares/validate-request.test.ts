import validator from "@/backend-api/middlewares/validate-request";
import { NextFunction, Request, Response } from "express";
import { checkSchema, ExpressValidator, param, query } from "express-validator";

describe("validate request middleware", () => {
  let mockedReq: Partial<Request>;
  let mockedRes: Partial<Response>;
  let mockedNext: NextFunction;

  beforeEach(() => {
    mockedReq = {};
    mockedRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockedNext = jest.fn();
  });

  it("accepts an array of validators and runs each of them", async () => {
    const mockedValidation = jest.fn().mockImplementation(() => true);
    const myCustomValidation = new ExpressValidator({ mockedValidation });
    const { param } = myCustomValidation;

    mockedReq.params = { id: "1" };
    mockedReq.query = { sort: "asc" };

    const validate = validator([
      param("id").exists(),
      query("sort").matches(/asc|desc/),
      param("fake").mockedValidation(),
    ]);

    await validate(mockedReq as Request, mockedRes as Response, mockedNext);

    expect(mockedValidation).toBeCalled();
  });

  it("continues the request process if there are no errors", async () => {
    mockedReq.params = { id: "exists" };

    const validate = validator([param("id").exists()]);

    await validate(mockedReq as Request, mockedRes as Response, mockedNext);

    expect(mockedNext).toBeCalled();
  });

  it("returns a 422 response if an error occurred", async () => {
    const validate = validator([param("id").exists()]);

    await validate(mockedReq as Request, mockedRes as Response, mockedNext);

    expect(mockedRes.status).toBeCalledWith(422);
  });

  it("also responses error messages when it issues a 422 response", async () => {
    const validation = new ExpressValidator({ willFail: () => false });
    const { param, validationResult } = validation;

    const validate = validator([param("fake").willFail()]);

    await validate(mockedReq as Request, mockedRes as Response, mockedNext);

    const errors = validationResult(mockedReq);

    expect(mockedRes.json).toBeCalledWith({ errors: errors.array() });
  });

  it("halts the remaining validations after one error occurs", async () => {
    const wontTrigger = jest.fn().mockImplementation(() => true);
    const myCustomValidation = new ExpressValidator({ wontTrigger });
    const { param } = myCustomValidation;

    const validate = validator([
      param("id").exists(),
      param("fake").wontTrigger(),
    ]);

    await validate(mockedReq as Request, mockedRes as Response, mockedNext);

    expect(wontTrigger).not.toBeCalled();
  });

  it("can pass a RunnableValidationChains instead of an array of ValidationChain", async () => {
    mockedReq.params = { id: "exists" };

    const validate = validator(
      checkSchema({
        id: { in: "params", exists: true },
      })
    );

    await validate(mockedReq as Request, mockedRes as Response, mockedNext);

    expect(mockedNext).toBeCalled();
  });
});
