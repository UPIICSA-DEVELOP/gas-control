import {Station} from '@app/utils/interfaces/station';
import {Consultancy} from '@app/utils/interfaces/consultancy';

export interface StationBasicData {
  activeNotification: boolean;
  consultancy: Consultancy;
  newNotification: boolean;
  station: Station;
}
