import {FuelTypeEnum} from '@app/utils/enums/fuel-type.enum';

export interface FuelTank {
  capacity: number;
  fuelType: FuelTypeEnum;
  year: number;
}
