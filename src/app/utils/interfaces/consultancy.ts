import {GeoPt} from '@app/utils/interfaces/geo-pt';

export interface Consultancy {
  address: string;
  businessName: string;
  group: boolean;
  id?: string;
  location: GeoPt;
  officePhone?: string;
  rfc: string;
}
