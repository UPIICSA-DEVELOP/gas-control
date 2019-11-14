import {FileCS} from '@app/utils/interfaces/file-cs';

export interface Document {
  file: FileCS;
  id: string;
  idStation: string;
  regulationType: number;
  type: number;
}
