//import {Cat} from './Cat';
import {UserOutput} from './User';

export default interface DBMessageResponse {
  message: string;
  data: UserOutput;
  //data: UserOutput | Cat;
}
