import {Component, ElementRef, Inject, NgZone, OnInit, ViewEncapsulation} from '@angular/core';
import {UtilitiesService} from '@app/core/utilities/utilities.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SearchBoxResult} from '@app/core/components/search-box/search-box.component';
import {MouseEvent} from '@agm/core/map-types';
import {SnackBarService} from '@app/core/services/snackbar/snackbar.service';
import {MapsAPILoader} from '@agm/core';
declare var google: any;


@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LocationComponent implements OnInit {

  public mapOptions: any;
  public clear: boolean;
  private _location: SearchBoxResult;
  private _inputSearchBox: ElementRef;
  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    public dialogRef: MatDialogRef<LocationComponent>,
    private _snackBarService: SnackBarService,
    private _ngZone: NgZone,
    private _agm: MapsAPILoader
  ) {
    this.mapOptions = UtilitiesService.getDefaultParamsMap();
    this.mapOptions.styles = [];
  }

  ngOnInit() {
    if(this._data){
      this._location = {lat: this._data.lat, lng: this._data.lng};
      this.mapOptions.center.lat = this._data.lat;
      this.mapOptions.center.lng = this._data.lng;
    }else{
      this._location = {lat: this.mapOptions.center.lat, lng:this.mapOptions.center.lng};
    }
    this.reverseGeoCode(this._location.lat, this._location.lng);
  }

  public onInputSearchBox(event: ElementRef): void{
    this._inputSearchBox = event;
  }

  public onPlaceChanged(event: SearchBoxResult): void{
    this.clear = true;
    this._location = event;
    this.mapOptions.center.lat = event.lat;
    this.mapOptions.center.lng = event.lng;
  }

  public onMarkerDragEnd(event: MouseEvent): void{
    this._location = {lat: event.coords.lat, lng: event.coords.lng};
    this.reverseGeoCode(event.coords.lat, event.coords.lng);
  }

  public clearInput(): void{
    this.clear = false;
    this._inputSearchBox.nativeElement.value = '';
  }

  public close(): void{
    this.dialogRef.close({code: -1});
  }

  public accept(): void{
    if(this._location){
      this.dialogRef.close({code: 1, location: this._location});
    }else{
      this.dialogRef.close({code: -1});
    }
  }

  public getCurrentPositionByGPS(): void{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position) => {
        this._ngZone.run(() => {
          this._location = {lat: position.coords.latitude, lng:  position.coords.longitude};
          this.mapOptions.center.lat = position.coords.latitude;
          this.mapOptions.center.lng = position.coords.longitude;
          this.reverseGeoCode( position.coords.latitude, position.coords.longitude);
        })
      }, (error) => {
        this._snackBarService.openSnackBar('No pudimos obtener su ubicación actual', 'OK', 2000);
      });
    }
  }

  private reverseGeoCode(latitude: number, longitude: number): void{
   this._agm.load().then(() => {
     const geoCoder = new google.maps.Geocoder();
     let latLng = new google.maps.LatLng(latitude, longitude);
     let request  = {location: latLng};
     geoCoder.geocode(request, (results: any[], status: any) => {
       if (status === google.maps.GeocoderStatus.OK) {
         if (results[0] !== null) {
           this._location.address = results[0].formatted_address;
           this._inputSearchBox.nativeElement.value = this._location.address;
         }
       }
     });
   }).then(err => {
     console.log(err);
   });
  }

}
