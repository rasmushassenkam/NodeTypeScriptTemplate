import { EStatusCode } from "../enums/EStatusCode";

export interface IResponse {
    status: EStatusCode;
    response: any;
}