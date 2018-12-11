/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GasStationComponent } from './gas-station.component';

describe('GasStationComponent', () => {
  let component: GasStationComponent;
  let fixture: ComponentFixture<GasStationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GasStationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GasStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
