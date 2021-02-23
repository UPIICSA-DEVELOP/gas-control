/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Routes} from '@angular/router';
import {environment} from '@env/environment';
import {ArchiveTasksComponent} from '@app/ui/archive/pages/archive-tasks/archive-tasks.component';

const URL_BASE = environment.url;

export const archiveRoutes: Routes = [
  {
    path: '',
    component: ArchiveTasksComponent,
    data: {
      title: 'Archivo de tareas',
      url: URL_BASE + '/archive'
    }
  }
];

