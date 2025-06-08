import { Response } from "express";
import { ResponseValidator } from "../../../../shared/responses/base";

/**
 * Base API Handler. Implements shared logic.
 */
export class BaseApiHandler {
  /**
   * Send an object back to client. Will examine the passed model
   * to determine if it is a server error - if so, will set the HTTP code
   * and send JSON error object.
   * 
   * Otherwise, sends the passed model with a 200 status
   * 
   * @param res express Response instance
   * @param model Model to send
   * @returns 
   */
  sendResponse(res: Response, model: unknown) {
    if (ResponseValidator.isError(model)) {
      res.status(model.httpStatus);
      res.send(model);
      res.end();
      return;
    }
    res.status(200);
    res.send(model);
    res.end();
  }
}