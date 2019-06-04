import {Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MapsAPILoader} from '@agm/core';

export interface SearchBoxResult{
  lat: number;
  lng: number;
  address?: string;
}

export interface SearchBoxStyles{
  padding: string;
  paddingLeft?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  width: string;
  height: string;
}

@Component({
  exportAs: 'app-search-box-core',
  selector: 'app-search-box-core',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxCoreComponent implements OnInit {

  @ViewChild('searchBoxCore') searchBoxCore: ElementRef;
  @Output() onChange: EventEmitter<SearchBoxResult>;
  @Output() inputSearchBox: EventEmitter<ElementRef>;
  @Input() styles: SearchBoxStyles;
  @Input() title: string;
  @Input() placeHolder: string;
  @Input() disabled: boolean;
  public searchControl: FormControl;
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private _ngZone: NgZone
  ) {
    this.searchControl = new FormControl();
    this.onChange = new EventEmitter<SearchBoxResult>();
    this.inputSearchBox = new EventEmitter<ElementRef>();
  }

  ngOnInit() {
   if(this.styles){
     this.setConfig(this.styles);
   }
    this.init();
  }

  private init(): void{
    this.inputSearchBox.emit(this.searchBoxCore);
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchBoxCore.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this._ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.onChange.emit({lat: place.geometry.location.lat(),  lng:  place.geometry.location.lng(), address: place.formatted_address});
        });
      });
    });
  }

  private setConfig(config: SearchBoxStyles): void{
    if(config.padding){
      this.searchBoxCore.nativeElement.style.padding = config.padding;
    }
    if(config.paddingLeft){
       this.searchBoxCore.nativeElement.style.paddingLeft = config.paddingLeft;
    }
    if(config.paddingTop){
       this.searchBoxCore.nativeElement.style.paddingTop = config.paddingTop;
    }
    if(config.paddingRight){
       this.searchBoxCore.nativeElement.style.paddingRight = config.paddingRight;
    }
    if(config.paddingBottom){
       this.searchBoxCore.nativeElement.style.paddingBottom = config.paddingBottom;
    }
    if(this.styles.width){
      this.searchBoxCore.nativeElement.style.width = this.styles.width;
    }
  }

}
