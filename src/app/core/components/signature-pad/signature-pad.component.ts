/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Component, OnInit } from '@angular/core';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss']
})
export class SignaturePadComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  /*signaturePad = new SignaturePad(canvas,{
    minWidth: 5,
    maxWidth: 10,
    penColor: "rgb(0, 0, 0)"
  })*/
}
