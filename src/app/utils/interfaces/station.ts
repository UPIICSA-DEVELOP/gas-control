import {GeoPt} from '@app/utils/interfaces/geo-pt';
import {WorkShift} from '@app/utils/interfaces/work-shift';
import {Dispenser} from '@app/utils/interfaces/dispenser';
import {FuelTank} from '@app/utils/interfaces/fuel-tank';

export interface Station {
  address: string;
  businessName: string;
  complete?: boolean;
  crePermission?: string;
  dispensers?: Dispenser[];
  doneTasks?: number;
  email: string;
  endPaymentDate?: number;
  folio?: number;
  fuelTanks: FuelTank[];
  id?: string;
  idConsultancy: string;
  idLegalRepresentative: string;
  legalRepresentativeName: string;
  location: GeoPt;
  monitoringWells?: number;
  name: string;
  observationWells?: number;
  paymentDate?: number;
  paymentStatus: number;
  phoneNumber: string;
  progress?: number;
  rfc: string;
  stationTaskId?: string;
  totalTasks?: number;
  type: number;
  vapourRecoverySystem: boolean;
  workers?: number;
  workShifts?: WorkShift[];
}
