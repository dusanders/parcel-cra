
import * as axios from "axios";
import { API_ENDPOINT } from "../../../shared";
import { ServerError } from "../../../shared/responses/base";

export interface PostApi {
  withBody<T>(body: any): Promise<T | ServerError>;
}

export interface Api {
  postTo(url: string): PostApi;
}

export class AxiosUtils implements Api, PostApi {
  static withDefaultAxios(apiKey?: string): Api {
    let api = axios.default.create({
      baseURL: API_ENDPOINT,
      validateStatus: () => true
    });
    api.defaults.headers.common['apikey'] = apiKey || '';
    return new AxiosUtils(api);
  }
  static withAuthAxios(jwt: string, apiKey?: string): Api {
    let api = axios.default.create({
      baseURL: API_ENDPOINT,
      validateStatus: () => true
    });
    api.defaults.headers.common['apikey'] = apiKey || '';
    api.defaults.headers.common['authorization'] = `Bearer ${jwt}`;
    return new AxiosUtils(api);
  }

  private instance: axios.AxiosInstance;
  private url: string = '';

  private constructor(axiosInstance: axios.AxiosInstance) {
    this.instance = axiosInstance
  }

  postTo(url: string) {
    this.url = url;
    return this;
  }

  async withBody<T>(body: any): Promise<T | ServerError> {
    const response = await this.instance.post(
      this.url,
      body
    )
    return response.data
  }
}