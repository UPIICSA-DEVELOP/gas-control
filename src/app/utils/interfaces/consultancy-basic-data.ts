import {Consultancy} from '@app/utils/interfaces/consultancy';
import {StationLite} from '@app/utils/interfaces/station-lite';

export interface ConsultancyBasicData {
  consultancy: Consultancy;
  stationLites: StationLite[];
}
