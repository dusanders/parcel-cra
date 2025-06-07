
import * as axios from "axios";
import { API_ENDPOINT } from "../../../shared";

export class AxiosUtils {
  static withDefaultAxios(apiKey?: string): axios.AxiosInstance {
    let api = axios.default.create({
      baseURL: API_ENDPOINT,
      validateStatus: () => true
    });
    api.defaults.headers.common['apikey'] = apiKey || '';
    return api;
  }
  static withAuthAxios(jwt: string, apiKey?: string): axios.AxiosInstance {
    let api = axios.default.create({
      baseURL: API_ENDPOINT,
      validateStatus: () => true
    });
    api.defaults.headers.common['apikey'] = apiKey || '';
    api.defaults.headers.common['authorization'] = `Bearer ${jwt}`;
    return api;
  }
}