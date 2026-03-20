export interface Error {}

export interface ErrorResponse {
  success: false;
  statusMsg: string;
  message: string;
  errors: any;
}
