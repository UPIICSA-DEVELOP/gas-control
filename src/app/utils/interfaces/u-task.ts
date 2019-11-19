import {UTaskTemplate} from '@app/utils/interfaces/u-task-template';

export class UTask implements UTaskTemplate{
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
