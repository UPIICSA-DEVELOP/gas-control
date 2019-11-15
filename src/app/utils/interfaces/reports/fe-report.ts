import {FileCS} from '@app/utils/interfaces/file-cs';
import {FireExtinguisher} from '@app/utils/interfaces/fire-extinguisher';

export interface FEReport {
  date: number;
  endTime: number;
  fireExtinguishers: FireExtinguisher[];
  folio?: number;
  id?: string;
  name: string;
  signature: FileCS;
  startTime: number;
  taskId: string;
}
