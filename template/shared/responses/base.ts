
export interface ServerErrorResponse {
  message: string;
  httpStatus: number;
  internalCode?: number | string;
}

export interface BaseResponse {
  serverError?: ServerErrorResponse;
}

export class ResponseValidator {
  static isError(model: BaseResponse | unknown): model is BaseResponse {
    const valid = model as BaseResponse;
    return Boolean(valid.serverError);
  }
}