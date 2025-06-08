import { Response } from "express";
import { ResponseValidator, ServerError } from "../../../../shared/responses/base";

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
  /**
   * Convenience method to enforce server error contract
   * @param error 
   * @returns 
   */
  returnError(error: ServerError) {
    return error;
  }
  /**
   * Convenience method to send an error message.
   * Mainly used to enforce types on the error object.
   * @param res 
   * @param error 
   */
  sendError(res: Response, error: ServerError) {
    this.sendResponse(res, error);
  }
}