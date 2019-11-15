import {FileCS} from '@app/utils/interfaces/file-cs';
import {BCard} from '@app/utils/interfaces/b-card';

export interface Person {
  active: boolean;
  bCard?: BCard;
  country: string;
  countryCode: string;
  creationDate?: number;
  email: string;
  id?: string;
  jobTitle: string;
  lastName: string;
  name: string;
  password?: string;
  phoneNumber: string;
  profileImage?: FileCS;
  refId: string;
  role: number;
  signature: FileCS;
  website?: string;
}
