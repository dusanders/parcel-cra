
import * as axios from "axios";
import { API_ENDPOINT } from "../../../shared";
import { ServerError } from "../../../shared/responses/base";

/**
 * Define the API utility contract for POST requests
 */
export interface IPostBody {
  /**
   * Attach body to request
   * @param body 
   */
  withBody<T>(body: any): Promise<T | ServerError>;
}

/**
 * Define contract for the API authentication header
 */
export interface IApiAuth {
  /**
   * No auth headers
   */
  notAuthenticated(): IPostUrl;
  /**
   * Attach `Bearer: <jwt>` token
   * @param jwt 
   */
  useJwt(jwt: string): IPostUrl;
  /**
   * Attach `api-key: <key>` token
   * @param api 
   */
  useApiKey(api: string): IPostUrl;
}

/**
 * Define the API utility contract
 */
export interface IPostUrl {
  /**
   * POST to an endpoint
   * @param url 
   */
  postTo(url: string): IPostBody;
}

/**
 * Implement the API service
 */
export class ApiService implements IPostUrl, IPostBody, IApiAuth {
  static getInstance(): IApiAuth {
    return new ApiService();
  }
  private instance: axios.AxiosInstance;
  private url: string = '';
  private apiKey: string = '';
  private jwt: string = '';

  private constructor() {
    this.instance = axios.default.create({
      baseURL: API_ENDPOINT
    });
  }

  notAuthenticated(): IPostUrl {
    return this;
  }

  useApiKey(api: string): IPostUrl {
    this.apiKey = api;
    this.instance.defaults.headers.common['X-API-KEY'] = this.apiKey;
    return this;
  }

  useJwt(jwt: string): IPostUrl {
    this.jwt = jwt
    this.instance.defaults.headers.common['Authorization'] = `Bearer: ${this.jwt}`;
    return this;
  }

  postTo(url: string) {
    this.url = url;
    return this;
  }

  async withBody<T>(body: any): Promise<T | ServerError> {
    try {
      const response = await this.instance.post(
        this.url,
        body
      );
      return response.data;
    } catch (error: axios.AxiosError | unknown) {
      const casted = error as axios.AxiosError;
      return this.returnError({
        httpStatus: casted.status!,
        message: casted.message,
        internalCode: casted.response?.data as any
      })
    }
  }

  private returnError(error: ServerError) {
    return error;
  }
}