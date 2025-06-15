
import * as axios from "axios";
import { API_ENDPOINT } from "../../../shared";
import { ServerError } from "../../../shared/responses/base";
import { Log } from "../context/logger/logger";

/**
 * Define the API utility contract for POST requests
 */
export interface IPostBody {
  withBodyExpectDownload(body: any): Promise<void>;
  /**
   * Attach body to request
   * @param body 
   */
  withBody<T>(body: any): Promise<T | ServerError>;
  /**
   * No body to request
   */
  noBody<T>(): Promise<T | ServerError>;
}

/**
 * Define contract for the API authentication header
 */
export interface IApiAuth {
  /**
   * No auth headers
   */
  notAuthenticated(): IRestAction;
  /**
   * Attach `Bearer: <jwt>` token
   * @param jwt 
   */
  useJwt(jwt: string): IRestAction;
  /**
   * Attach `api-key: <key>` token
   * @param api 
   */
  useApiKey(api: string): IRestAction;
}

/**
 * Define the API utility contract
 */
export interface IRestAction {
  /**
   * POST to an endpoint
   * @param url 
   */
  postTo(url: string): IPostBody;
  /**
   * GET an endpoint
   * @param url 
   */
  get(url: string): Promise<number>;
}

/**
 * Implement the API service
 */
export class ApiService implements IRestAction, IPostBody, IApiAuth {
  static getInstance(): IApiAuth {
    return new ApiService();
  }
  private tag = "ApiService";
  private axiosInstance: axios.AxiosInstance;
  private url: string = '';
  private apiKey: string = '';
  private jwt: string = '';

  private constructor() {
    this.axiosInstance = axios.default.create({
      baseURL: API_ENDPOINT
    });
  }

  notAuthenticated() {
    return this;
  }

  useApiKey(api: string) {
    this.apiKey = api;
    this.axiosInstance.defaults.headers.common['X-API-KEY'] = this.apiKey;
    return this;
  }

  useJwt(jwt: string) {
    this.jwt = jwt
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer: ${this.jwt}`;
    return this;
  }

  async get(url: string): Promise<number> {
    try {
      const response = await this.axiosInstance.get(url);
      return response.status;
    } catch (error: axios.AxiosError | unknown) {
      const casted = error as axios.AxiosError;
      return 500;
    }
  }

  postTo(url: string) {
    this.url = url;
    return this;
  }

  async noBody<T>(): Promise<T | ServerError> {
    try {
      const response = await this.axiosInstance.post(
        this.url
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

  async withBody<T>(body: any): Promise<T | ServerError> {
    try {
      const response = await this.axiosInstance.post(
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

  async withBodyExpectDownload(body: any): Promise<void> {
    try {
      this.axiosInstance.defaults.responseType = 'blob';
      const response = await this.axiosInstance.post(
        this.url,
        body
      )
      // create file link in browser's memory
      const href = URL.createObjectURL(response.data);
      let filename: string = response.headers['content-disposition'] || 'file';
      filename = filename.split('filename=')[1].replace(/"/g, '').trim();
      // create "a" HTML element with href to file & click
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', filename); //or any other extension
      link.click();
      URL.revokeObjectURL(href);
    } catch (error: axios.AxiosError | unknown) {
      const casted = error as axios.AxiosError;
      Log.warn(this.tag, `axios error (download): ${casted.message}`);
    }
  }

  private returnError(error: ServerError) {
    return error;
  }
}