//import {Cat} from './Cat';
import {UserOutput} from './User';
import {CatOutput} from './Cat';

export default interface DBMessageResponse {
  message: string;
  data: UserOutput | CatOutput;
}
