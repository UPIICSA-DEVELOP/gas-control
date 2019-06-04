/*
 *  Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */

import {MDateResponse} from 'app/utils/interfaces/interfaces';

/**
 * @summary generic class to control dates formats
 * @description this class work with static methods, the main objective is parse
 * the different possibilities to use a date
 * @version 1.0.0, 08/05/2018
 */
export class MDate extends Date{
  private _day: number;
  private _month: number;
  private _year: number;
  constructor(){
    super();
  }

  /**
   * get the name of the mont written in three characters
   * @param {number} month
   * @returns {string} month value in code ISO-3
   *
   * @example
   * month = 3
   * return value = mar
   */
  private static selectMonthText(month: number): string{
    try {
      let text;
      switch (Number(month)){
        case 1: text = "ene";
          break;
        case 2: text = "feb";
          break;
        case 3: text = "mar";
          break;
        case 4: text = "abr";
          break;
        case 5: text = "may";
          break;
        case 6: text = "jun";
          break;
        case 7: text = "jul";
          break;
        case 8: text = "ago";
          break;
        case 9: text = "sep";
          break;
        case 10: text = "oct";
          break;
        case 11: text = "nov";
          break;
        case 12: text = "dic";
          break;
      }
      return text;
    }catch (error){
      console.error(error);
      return null;
    }
  }


  /**
   * get type of value number or Date
   * @param value
   * @returns {number}
   * 0: other
   * 1: Date
   * 2: number
   */
  public static getTypeData(value: any): number{
    try{
      let type;
      if(value instanceof Date){
        type = 1
      }else if(typeof(value) === 'number'){
        type = 2;
      }else{
        type = 0;
      }
      return type;
    }catch (error){
      console.error(error);
      return null;
    }
  }

  public getFullMDate(value: any): MDateResponse{
    try{
      if(MDate.getTypeData(value) === 1){
        this._day = value.getDate();
        this._month = value.getMonth()+1;
        this._year = value.getFullYear();
      }else if(MDate.getTypeData(value) === 2){
        this._day = value.toString().slice(6,8);
        this._month = value.toString().slice(4,6);
        this._year = value.toString().slice(0,4);
      }
      const baseValue = new Date(this._year, this._month - 1, this._day);
      return {
        arrayDate: MDate.getDateArray(baseValue),
        dateText: MDate.getStringDate(baseValue),
        fullDate: baseValue,
        timeStamp: MDate.getTimeStamp(baseValue),
      };
    }catch (error){
      console.error(error);
      return null;
    }
  }

  /**
   * get original date with timeStamp; format: yyyymmdd
   * @param {number} timeStamp
   * @returns {Date} original date with value of timeStamp
   */
  public static getPrimitiveDate(timeStamp: number): Date{
    try {
      let day: any = timeStamp.toString().slice(6,8);
      day = (day.length === 1? '0'+day:day);
      let month: any = timeStamp.toString().slice(4,6);
      month = Number(month) - 1;
      const year: any = timeStamp.toString().slice(0,4);
      return new Date(Number(year), Number(month), Number(day));
    }catch (error){
      console.error(error);
      return null;
    }
  }

  /**
   *  get timeStamp
   * @param {Date} date
   * @returns {number} timeStamp with of original date
   */
  public static getTimeStamp(date: Date): number{
    try {
      let day = date.getDate().toString();
      let month = (date.getMonth() + 1).toString();
      const year = date.getFullYear().toString();
      day = (day.length === 1 ? '0' + day: day);
      month = (month.length === 1 ? '0' + month: month);
      return Number(year + month + day);
    } catch (error){
      console.error(error);
      return null;
    }
  }


  /**
   *
   * @param value
   * @returns {Array<string>}
   */
  public static getDateArray(value: any): Array<string>{
    try{
      let date = [];
      let day;
      if(MDate.getTypeData(value) === 1){
        day = value.getDate().toString();
        day = (day.length === 1? '0'+day: day);
        date.push(day);
        date.push(MDate.selectMonthText(value.getMonth()+1));
        date.push(value.getFullYear().toString());
        return date
      }else if(MDate.getTypeData(value) === 2){
        day = value.toString().slice(6,8);
        day = (day.length === 1? '0'+day: day);
        date.push(day);
        date.push(MDate.selectMonthText(value.toString().slice(4,6)));
        date.push(value.toString().slice(0,4));
      }else{
        return null;
      }
      return date;
    }catch (error){
      console.error(error);
      return null;
    }
  }

  /**
   *
   * @param value
   * @returns {string} date Date with format dd/mm/yyyy
   */
  public static getStringDate(value: any): string{
    try{
      let date = null;
      let day;
      if(MDate.getTypeData(value) === 1){
        day = value.getDate().toString();
        day = (day.length === 1? '0'+day: day);
        date = day+'/'+MDate.selectMonthText(value.getMonth()+1)+'/'+value.getFullYear().toString();
        return date
      }else if(MDate.getTypeData(value) === 2){
        day = value.toString().slice(6,8);
        day = (day.length === 1? '0'+day: day);
        date = day+'/'+MDate.selectMonthText(value.toString().slice(4,6))+'/'+value.toString().slice(0,4);
      }else{
        return null;
      }
      return date;
    }catch (error){
      console.error(error);
      return null;
    }
  }
}
