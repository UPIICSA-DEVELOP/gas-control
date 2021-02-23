import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '@app/shared/shared.module';
import { ArchiveTasksComponent } from './pages/archive-tasks/archive-tasks.component';
import {RouterModule} from '@angular/router';
import {archiveRoutes} from '@app/ui/archive/archive.routes';



@NgModule({
  declarations: [ArchiveTasksComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(archiveRoutes)
  ]
})
export class ArchiveModule { }
