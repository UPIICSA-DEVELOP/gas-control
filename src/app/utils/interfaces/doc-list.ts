import {FileCS} from '@app/utils/interfaces/file-cs';

export interface DocList {
  name: string;
  type?: number;
  docFile?: {
    file?: FileCS;
    id?: string;
    idStation: string;
    regulationType: number;
    type: number;
  };
}
