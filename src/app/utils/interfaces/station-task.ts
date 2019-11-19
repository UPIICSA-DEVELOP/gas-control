import {EditedTask} from '@app/utils/interfaces/edited-task';

export interface StationTask {
  creationDate: number;
  editedTasks: EditedTask[];
  id?: string;
  modificationDate?: number;
  progress: number;
  startDate: number;
  stationId: string;
  status: number;
}
