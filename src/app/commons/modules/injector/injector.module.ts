import {Injector, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

export let InjectorInstance: Injector;

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class InjectorModule {
  constructor(
    private injector: Injector
  ){
    InjectorInstance = this.injector;
  }
}

