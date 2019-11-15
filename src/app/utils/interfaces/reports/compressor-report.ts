import {FileCS} from '@app/utils/interfaces/file-cs';
import {HWGReport} from '@app/utils/interfaces/reports/hwg-report';

export interface CompressorReport {
  brand?: string;
  controlNumber?: string;
  date: number;
  endTime: number;
  fileCS: FileCS;
  folio?: number;
  hwgReport?: HWGReport;
  id?: string;
  model?: string;
  modifications?: string;
  name: string;
  observations?: string;
  pressure: number;
  purge: string;
  securityValve: string;
  signature: FileCS;
  startTime: number;
  taskId: string;
}
