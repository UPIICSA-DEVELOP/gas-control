import {FileCS} from '@app/utils/interfaces/file-cs';
import {HWGReport} from '@app/utils/interfaces/reports/hwg-report';

export interface ScannedReport {
  date: number;
  fileCS: FileCS;
  folio?: number;
  hwgReport?: HWGReport;
  id?: string;
  name: string;
  signature: FileCS;
  taskId: string;
}
