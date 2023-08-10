import bindEntity, {
  HasId,
} from "@/backend-api/middlewares/route-entity-binding";
import { Request, Response } from "express";

describe("route entity binding middleware", () => {
  const findOneBy = jest.spyOn(HasId, "findOneBy");
  let mockedReq: Partial<Request>;
  let mockedRes: Partial<Response>;
  const mockedNext = jest.fn();

  beforeEach(() => {
    mockedReq = {
      params: {},
    };
    mockedRes = {
      sendStatus: jest.fn(),
    };
  });

  it("fetchs a entity and injects the entity into Request object", async () => {
    const entity = new HasId();
    entity.id = 1;
    findOneBy.mockResolvedValue(entity);

    mockedReq.params = { hasid: String(entity.id) };

    const shouldBind = bindEntity(HasId);

    await shouldBind(mockedReq as Request, mockedRes as Response, () => {});

    expect(mockedReq["hasid"]).toBeInstanceOf(HasId);
    expect(mockedReq["hasid"].id).toEqual(entity.id);
  });

  it("continues the request process after the binding is completed", async () => {
    const entity = new HasId();
    findOneBy.mockResolvedValue(entity);

    mockedReq.params = { hasid: "1" };

    const shouldBind = bindEntity(HasId);

    await shouldBind(mockedReq as Request, mockedRes as Response, mockedNext);

    expect(mockedNext).toBeCalled();
  });

  it("returns 404 response if the corresponding param cannot be found", async () => {
    const shouldBind = bindEntity(HasId);

    await shouldBind(mockedReq as Request, mockedRes as Response, mockedNext);

    expect(mockedReq["hasid"]).toBeUndefined();
    expect(mockedNext).not.toBeCalled();
  });

  it("returns 404 response if cannot find an existed entity", async () => {
    findOneBy.mockResolvedValue(null);

    mockedReq.params = { hasid: "NOT_EXISTS" };

    const shouldBind = bindEntity(HasId);

    await shouldBind(mockedReq as Request, mockedRes as Response, mockedNext);

    expect(findOneBy).toBeCalled();
    expect(mockedRes.sendStatus).toBeCalledWith(404);
    expect(mockedNext).not.toBeCalled();
  });
});
