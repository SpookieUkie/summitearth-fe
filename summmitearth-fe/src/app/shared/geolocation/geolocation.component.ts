import { Component, OnInit, ViewChild, Input, Output, EventEmitter, AfterContentInit, SimpleChanges, OnChanges } from '@angular/core';
import { IonInput, LoadingController } from '@ionic/angular';
import { Plugins, MotionOrientationEventResult, MotionEventResult } from '@capacitor/core';
import { SharedService } from '../shared.service';


const { Geolocation } = Plugins;
const { Motion } = Plugins;

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss'],
})

export class GeolocationComponent implements OnInit, OnChanges {
  @Input() coords;
  @Input() orientation;
  @Input() showButton = true;
  @Input() getOrientation = false;
  @Output() newCoords: EventEmitter<any> = new EventEmitter<any>();
  @Output() newOrientation: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('latitude', { static: true }) latitude: IonInput;
  @ViewChild('longitude', { static: true }) longitude: IonInput;
  @ViewChild('altitude', { static: true }) altitude: IonInput;
  @ViewChild('direction') direction: IonInput;
  @ViewChild('degrees') degrees: IonInput;
  pointer;


  constructor(
    private loadingController: LoadingController, 
    private sharedService: SharedService) {
   }

  ngOnInit() {
   
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.coords !== undefined && this.coords !== null) {
      this.latitude.value = this.coords.latitude;
      this.longitude.value = this.coords.longitude;
      this.altitude.value = this.coords.altitude;
    }
    
    /*
    if (this.orientation !== undefined && this.orientation !== null) {
      this.degrees.value = this.orientation.degrees;
      this.direction.value = this.orientation.direction;
    }
    */

  }


  async getGeoLocation() {
    console.log ('getlocation');
    const loader = await this.loadingController.create({
      message: 'Trying to load current coordinates. One Moment.',
      animated: true
    }).then(loaderElement => {
      loaderElement.present();
     
      this.getCoordinates(loaderElement);
      this.getOrientationResult();
    })
  }

  private async getCoordinates(loaderElement) {
    try {
      const message = 'Current Coodinates Added';
      const coordinates = await Geolocation.getCurrentPosition();
      this.longitude.value = coordinates.coords.longitude.toFixed(6);
      this.latitude.value =  coordinates.coords.latitude.toFixed(6);
      this.altitude.value =  coordinates.coords.altitude.toFixed(6);
      this.newCoords.emit(coordinates.coords);

      console.log('Current', coordinates);
      loaderElement.dismiss();
      this.sharedService.showNotification(message);

    } catch (err) {
      console.log ('Error' + err);
      this.sharedService.showNotification('Failed Getting Current Coordinates', 'danger');
      loaderElement.dismiss();
    }
  }

  private getOrientationResult() {
    if (this.getOrientation ) {
      const message = 'Current Orientation Added';
      this.pointer = Motion.addListener('orientation', (event: MotionOrientationEventResult) => {
        console.log ('Orientation');
        console.log (event);
        const orientation: any = {};
        orientation.alpha = event.alpha;
        orientation.beta = event.beta;
        orientation.gamma = event.gamma;
        orientation.degrees = this.sharedService.compassHeading(event.alpha, event.beta, event.gamma);
        orientation.direction = this.sharedService.degToCompass(orientation.degrees);
        this.orientation = orientation;
        console.log (this.orientation);
        console.log (this.orientation.degrees.toFixed(9))
        this.direction.value = this.orientation.direction;
        this.degrees.value = this.orientation.degrees.toFixed(6);
        this.newOrientation.emit(this.orientation);
        this.sharedService.showNotification('message');

        this.pointer.remove();
      });
    }
  }

  
  
}