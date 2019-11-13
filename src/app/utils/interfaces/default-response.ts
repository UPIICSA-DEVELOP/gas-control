import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';

export interface DefaultResponse {
  code: HttpResponseCodes;
  description: string;
}
