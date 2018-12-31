import { Component, OnInit } from '@angular/core';
import {Constants} from '@app/core/constants.core';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-country-code',
  templateUrl: './country-code.component.html',
  styleUrls: ['./country-code.component.scss']
})
export class CountryCodeComponent implements OnInit {

  public counties: any[];
  constructor(
    public _dialogRef: MatDialogRef<CountryCodeComponent>
  ) { }

  ngOnInit() {
    this.counties = Constants.countries;
  }

  public search(event: any): void{
    const newArray = [];
    const text = event.srcElement.value;
    if(text === ''){
      this.counties = Constants.countries;
    }else{
      for(let x=0; x < this.counties.length; x++){
        if(UtilitiesService.removeDiacritics(this.counties[x].name).toLowerCase().includes(text) || this.counties[x].code.replace('+', '').toLowerCase().includes(text)){
          newArray.push(this.counties[x]);
        }
      }
      if(newArray.length > 0){
        this.counties = newArray;
      }else{
        this.counties = Constants.countries;
      }
    }
  }

  public selectCountry(country: any): void{
    this._dialogRef.close(country);
  }

}
