import axios, { RawAxiosRequestHeaders } from "axios";

interface RequestConfig {
  headers?: RawAxiosRequestHeaders;
  body?: any;
  url: string;
  params?: any;
}

export default class HttpService {
  private instance;

  constructor() {
    this.instance = axios.create({
      baseURL: "/api",
    });
  }

  public async post(requestData: RequestConfig) {
    try {
      const { url, body, params, headers } = requestData;

      const response = await this.instance.post(url, body, {
        ...params,
        ...headers,
      });

      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
