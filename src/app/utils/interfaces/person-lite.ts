import {FileCS} from '@app/utils/interfaces/file-cs';

export interface PersonLite {
  active: boolean;
  countryCode: string;
  email: string;
  id: string;
  jobTitle: string;
  lastName: string;
  name: string;
  phoneNumber: string;
  profileImage: FileCS;
  refId: string;
  role: number;
  signature: FileCS;
}
