import {GroupIcon} from '@app/utils/interfaces/group-icon';
import {Procedure} from '@app/utils/interfaces/procedure';
import {SasisopaTemplate} from '@app/utils/interfaces/sasisopa-template';
import {SgmDocument} from '@app/utils/interfaces/sgm-document';
import {TaskTemplate} from '@app/utils/interfaces/task-template';
import {UTaskTemplate} from '@app/utils/interfaces/u-task-template';
import {VersionInSpector} from '@app/utils/interfaces/version-in-spector';

export interface AppUtil {
  groupIcons: GroupIcon[];
  procedures: Procedure[];
  sasisopaTemplates: SasisopaTemplate[];
  sgmDocuments: SgmDocument[];
  taskTemplates: TaskTemplate[];
  uTaskTemplates: UTaskTemplate[];
  versionInSpector: VersionInSpector;
}
