import {FileCS} from '@app/utils/interfaces/file-cs';

export interface HWCReport {
  carrierCompany: string;
  date: number;
  fileCS?: FileCS;
  finalDestination: string;
  folio?: number;
  id?: string;
  manifestNumber?: string;
  name: string;
  nextPhase?: string;
  quantity: number;
  signature: FileCS;
  taskId: string;
  unity: string;
  waste: string;
}
