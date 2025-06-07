import { Response } from "express";
import { ResponseValidator } from "../../../../shared/responses/base";

export class BaseApiHandler {
  sendResponse(res: Response, model: unknown) {
    if (ResponseValidator.isError(model) && model.serverError) {
      res.status(model.serverError.httpStatus);
      res.send(model);
      res.end();
      return;
    }
    res.status(200);
    res.send(model);
    res.end();
  }
}