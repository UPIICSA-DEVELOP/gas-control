import {TaskTemplate} from '@app/utils/interfaces/task-template';

export class Task implements TaskTemplate {
  active: boolean;
  editable: boolean;
  evidence: boolean;
  frequency: number;
  hwg: boolean;
  level: number;
  name: string;
  typeReport: number;
  zone: number;
  asea: boolean;
  cre: boolean;
  date: number;
  id: string;
  norm005: boolean;
  norm016: boolean;
  sasisopa: boolean;
  sgm: boolean;
  stationId: string;
  stationTaskId: string;
  status: number;
  type: number;
}
