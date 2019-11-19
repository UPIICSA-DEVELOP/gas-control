import { Task } from './task';

export interface OfflineData {
  activeTask: Task[];
  lateTasks: Task[];
}
