import {UserOutput} from './DBTypes';

type MessageResponse = {
  message: string;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};

type LoginResponse = {
  token: string;
  user: UserOutput;
};

type UploadResponse = MessageResponse & {
  id: number;
  output: UserOutput;
};

export {MessageResponse, ErrorResponse, LoginResponse, UploadResponse};
