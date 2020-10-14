import {FileCS} from '@app/utils/interfaces/file-cs';

export interface CustomProcedure {
  customProcedureId: number;
  fileCS: FileCS;
  id: string;
  name: string;
  stationId: string;
}
