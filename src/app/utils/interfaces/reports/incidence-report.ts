import {FileCS} from '@app/utils/interfaces/file-cs';

export interface IncidenceReport {
  area: string;
  date: number;
  description: string;
  fileCS?: FileCS;
  folio?: number;
  id?: string;
  name: string;
  procedures?: Array<number>;
  signature: FileCS;
  taskId: string;
  time: number;
  extraFileCS: Array<FileCS>;
}
