import {FileCS} from '@app/utils/interfaces/file-cs';
import {VRSTank} from '@app/utils/interfaces/vrs-tank';
import {VRSDispensary} from '@app/utils/interfaces/vrs-dispensary';

export interface VRSReport {
  date: number;
  emergencyStop: string;
  fileCS?: FileCS;
  folio?: number;
  id?: string;
  name: string;
  observations?: string;
  signature: FileCS;
  taskId: string;
  vrsAlarm: string;
  vrsDispensary: VRSDispensary;
  vrsTanks: VRSTank[];
}
