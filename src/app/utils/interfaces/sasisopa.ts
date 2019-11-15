import {FileCS} from '@app/utils/interfaces/file-cs';

export interface SasisopaDocument {
  annexed: number;
  file: FileCS;
  id?: string;
  stationId: string;
  type: number;
}
