/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class HashService {

  static set(keys: any, value: any): string{
    try{
      const key = CryptoJS.enc.Utf8.parse(keys);
      const iv = CryptoJS.enc.Utf8.parse(keys);
      const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
        {
          keySize: 128 / 8,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });
      return encrypted.toString();
    }catch (e){
      console.error(e);
      return null;
    }
  }

  static get(keys: any, value: any): string{
    try{
      const key = CryptoJS.enc.Utf8.parse(keys);
      const iv = CryptoJS.enc.Utf8.parse(keys);
      const decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    }catch (e){
      console.error(e);
      return null;
    }
  }

}
