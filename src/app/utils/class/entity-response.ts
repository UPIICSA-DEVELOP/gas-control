import {DefaultResponse} from '@app/utils/interfaces/default-response';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';

export class EntityResponse<T> implements DefaultResponse {
  code: HttpResponseCodes;
  description: string;
  item: T;
}
