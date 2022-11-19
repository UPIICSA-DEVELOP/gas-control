import {FileCS} from '@app/utils/interfaces/file-cs';

export interface FRReport {
  date: number;
  diesel: boolean;
  endTime: number;
  fileCS?: FileCS;
  finalVol?: number;
  folio?: number;
  id?: string;
  magna: boolean;
  name: string;
  premium: boolean;
  receiveName: string;
  remission: number;
  remissionNumber: string;
  signature: FileCS;
  startTime: number;
  tankNumber?: string;
  taskId: string;
  volumetric: number;
  waste?: number;
}
