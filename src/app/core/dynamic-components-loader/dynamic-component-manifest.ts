/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import { InjectionToken } from '@angular/core';

export const DYNAMIC_COMPONENT = new InjectionToken<any>('DYNAMIC_COMPONENT');

export const DYNAMIC_COMPONENT_MANIFESTS = new InjectionToken<any>('DYNAMIC_COMPONENT_MANIFESTS');

export interface DynamicComponentManifest {

  /** Unique identifier, used in the application to retrieve a ComponentFactory. */
  componentId: string;

  /** Unique identifier, used internally by Angular. */
  path: string;

  /** Path to component module. */
  loadChildren: string;
}
