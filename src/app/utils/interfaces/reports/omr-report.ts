import {FileCS} from '@app/utils/interfaces/file-cs';
import {HWGReport} from '@app/utils/interfaces/reports/hwg-report';

export interface OMReport {
  activityType: string;
  cottonClothes: boolean;
  date: number;
  description?: string;
  endTime: number;
  faceMask: boolean;
  fileCS?: FileCS;
  folio?: number;
  gloves: boolean;
  goggles: boolean;
  helmet: boolean;
  hwgReport?: HWGReport;
  id?: string;
  industrialShoes: boolean;
  kneepads: boolean;
  maintenanceType: string;
  name: string;
  observations?: string;
  personnelNames: string[];
  personnelType: string;
  procedures?: number[];
  protectiveGoggles: boolean;
  signature: FileCS;
  startTime: number;
  taskId: string;
  toolsAndMaterials: string;
}
