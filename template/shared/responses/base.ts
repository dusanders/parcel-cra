
/**
 * Model the server error response for all server errors.
 * 
 * Note: Regardless of API endpoint - they will all return this model on failed calls
 */
export interface ServerError {
  httpStatus: number;
  message: string;
  internalCode: string | number;
}

export class ResponseValidator {
  static isError(model: ServerError | unknown): model is ServerError {
    const valid = model as ServerError;
    return Boolean(valid.httpStatus) && Boolean(valid.message);
  }
}