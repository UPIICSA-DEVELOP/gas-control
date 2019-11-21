import {DefaultResponse} from '@app/utils/interfaces/default-response';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';

export class EntityCollectionResponse<T> implements DefaultResponse {
  code: HttpResponseCodes;
  description: string;
  items: T[];
  nextPageToken: string;
}
