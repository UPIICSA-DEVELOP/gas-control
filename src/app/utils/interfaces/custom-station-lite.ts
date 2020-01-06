import {StationLite} from '@app/utils/interfaces/station-lite';

export interface CustomStationLite extends StationLite {
  logo: string;
  groupName: string;
}
