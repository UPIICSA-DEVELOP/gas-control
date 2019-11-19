import {Station} from '@app/utils/interfaces/station';

export class ReportComplete<S,T>  {
  report: T;
  station: Station;
  task: S;
}
