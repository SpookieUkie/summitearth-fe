import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';


import { AlertController, LoadingController, PopoverController, IonToggle, Platform } from '@ionic/angular';
import { PhotoviewerComponent } from 'src/app/shared/photoviewer/photoviewer.component';
import { Route } from '@angular/compiler/src/core';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { GeolocationComponent } from 'src/app/shared/geolocation/geolocation.component';
import { CameraPhoto } from '@capacitor/core';
import { CacheSaveDataService } from 'src/app/auth/cache-save-data.service';
import { GenericPhotoModel } from './genericphoto.model';
import { GenericPhotoService } from './genericphoto.service';
import { GenericPhotoFormModel } from './genericphoto-form.model';

@Component({
  selector: 'app-generic-photo',
  templateUrl: './genericphoto.component.html',
  styleUrls: ['./genericphoto.component.scss'],
})
export class GenericPhotoComponent implements OnInit {
  @ViewChild('geolocation', { static: true }) geolocation: GeolocationComponent;
  @ViewChild('geoRef', { static: true }) geoRefToggle: IonToggle;
  @Input() genericPhoto: GenericPhotoModel;
  @Input() reportType: string;
  @Input() basePath: string;

  form: FormGroup;
  sharedService: SharedService;
  cacheSaveDataService: CacheSaveDataService;
  activatedRoute: ActivatedRoute;
  alertController: AlertController;
  loadingController: LoadingController;
  popoverController: PopoverController;
  platform: Platform;
  router: Router;
  viewWidth = 0;


  selectedImage: string;
  genericPhotoService: GenericPhotoService;
  photoRoute = [];

  coords: any = {};
  orientation: any = {};


  constructor(sharedService: SharedService,
    activatedRoute: ActivatedRoute,
    genericPhotoService: GenericPhotoService,
    cacheSaveDataService: CacheSaveDataService,
    alertController: AlertController,
    loadingController: LoadingController,
    popoverController: PopoverController,
    platform: Platform,
    router: Router,
    private formBuilder: FormBuilder
    ) {
      this.sharedService = sharedService;
      this.activatedRoute = activatedRoute;
      this.genericPhotoService = genericPhotoService;
      this.alertController = alertController;
      this.loadingController = loadingController;
      this.popoverController = popoverController;
      this.cacheSaveDataService = cacheSaveDataService;
      this.platform = platform;
      this.router = router;

      this.viewWidth = this.sharedService.getPlaformWidth();
     
   }


  ngOnInit() {
    this.form = this.formBuilder.group(new GenericPhotoFormModel());

    console.log (this.genericPhoto);
    if (this.genericPhoto !== null && this.genericPhoto._id !== undefined) {
      this.form.get('photoComments').setValue(this.genericPhoto.photoComments);
      this.form.get('additionalGeoRefComments').setValue(this.genericPhoto.additionalGeoRefComments);
      if (this.genericPhoto.thumbnailUrl === undefined) { // This is local and offline
        this.form.get('image').setValue(this.genericPhoto.image);
        const fr = new FileReader();
        fr.onload = () => {
          const dataUrl = fr.result.toString();
          this.selectedImage =  dataUrl;
          //this.form.patchValue({ image: imageData});
          //this.coords = null; //Can't get coord from laptop
        };
        if (this.genericPhoto.image !== undefined) {
          fr.readAsDataURL(this.genericPhoto.image);
        }
      } else {
        if (this.genericPhoto.useGeoRef) {
          this.selectedImage = this.genericPhoto.thumbnailGeoRefUrl;
        } else {
          this.selectedImage = this.genericPhoto.thumbnailUrl;
        }
        this.form.get('image').setValue(this.genericPhoto.thumbnailUrl);
      }
      this.coords = this.genericPhoto.coords;
      this.form.get('useGeoRef').setValue(this.genericPhoto.useGeoRef);
    } else {
      this.form.get('useGeoRef').setValue(false);
    }
    if (this.genericPhoto === null || this.genericPhoto.photoGeoRefUrl === null || this.genericPhoto.photoGeoRefUrl === undefined ) {
      this.geoRefToggle.disabled = true;
    }
  }



  showImage() {
    if (this.genericPhoto !== null && this.genericPhoto.photoUrl !== null && this.genericPhoto.photoUrl !== undefined) {
      let url = '';
      if (this.genericPhoto.useGeoRef) {
        url = this.genericPhoto.photoGeoRefUrl;
      } else {
        url = this.genericPhoto.photoUrl;
      }
   

      this.router.navigate([this.basePath, 'photoid', this.genericPhoto._id, 'photo', encodeURIComponent(url)]);
    } else {
      this.sharedService.showNotification('Please save the image first before previewing', 'danger');
    }
  }

  async showImage2(event) {
    if (this.genericPhoto !== null && this.genericPhoto.photoUrl !== null) {
      let url = '';
      if (this.genericPhoto.useGeoRef) {
        url = this.genericPhoto.photoGeoRefUrl;
      } else {
        url = this.genericPhoto.photoUrl;
      }

      const popover = await this.popoverController.create({
          component: PhotoviewerComponent,
          cssClass: 'photo',
          event: event,
          translucent: true,
          componentProps: {
            photoUrl: url,
          }
        });

      return await popover.present();
    }
  }
 

  onImagePicked(imageData: string | File, dataUrl: string = null) {
    let imageFile;
   if (typeof imageData === 'string') {
      try {
        imageFile = this.sharedService.base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );

        this.selectedImage = imageData;
        this.form.patchValue({ image: imageFile});
        this.geolocation.getGeoLocation();
      } catch (error) {
        console.log('Err' + error);
        return;
      }
    } else {
      // Convert to base64 string so it can be displayed, but keep file for upload
     const fr = new FileReader();
      fr.onload = () => {
        const dataUrl = fr.result.toString();
        this.selectedImage =  dataUrl;
        this.form.patchValue({ image: imageData});
        this.coords = null; //Can't get coord from laptop
      };
      fr.readAsDataURL(imageData);
    }
    this.form.get('image').updateValueAndValidity();
    
  }

  async savePhoto() {
    if (this.genericPhoto.genericId !== null && this.genericPhoto.genericId !== undefined &&
      this.genericPhoto.genericIdType !== null && this.genericPhoto.genericIdType !== undefined) {
      const g = this.genericPhoto;

      this.form = this.genericPhotoService.preparePhotoForSaving(
          this.form, g.genericId, g.genericIdType, g.genericSubId, g.genericSubIdType, 'form');

      if (this.genericPhoto._id === undefined || this.genericPhoto._id === null) {
          this.addNewPhoto();
      } else {
          this.updatePhoto();
      }
    } else {
      this.sharedService.showNotification('The ' + this.reportType + ' must be saved first before saving the photo.', 'danger');
    }
  }

  async addNewPhoto() {
    const loader = await this.loadingController.create({
      message: 'Saving Photo, one moment please.',
      animated: true
    }).then(loaderElement => {
        loaderElement.present();
        this.genericPhotoService.saveNewGenericPhoto(this.form, this.coords).subscribe((val: any) => {
           this.sharedService.showNotification('Photo Record Added to Report');
           this.form.markAsPristine();
           this.genericPhoto = val.data;
           this.genericPhotoService.replacePhoto(this.genericPhoto);
           loaderElement.remove();
        }, err => {
           loaderElement.remove();
        });
    });
  }

  async updatePhoto() {
    const loader = await this.loadingController.create({
      message: 'Saving Photo, one moment please.',
      animated: true
    }).then(loaderElement => {
        loaderElement.present();
        this.genericPhotoService.updateGenericPhoto(this.form, this.genericPhoto._id, this.coords).subscribe((val: any) => {
            this.sharedService.showNotification('Photo Record Updated');
            this.form.markAsPristine();
            this.genericPhoto = val.data;
            loaderElement.remove();
        }, err => {
          loaderElement.remove();
        });
    });
  }

  async deletePhoto() {
    const alert = await this.alertController.create({
      message: 'Are you sure you want to delete this photo?',
      buttons: [
        {text: 'Yes',
        handler: (val) => {
          // Check if record is actually created first
            this.genericPhotoService.deletePhoto(this.genericPhoto._id).subscribe(val => {
                console.log ('Delete request complete');
                //remove from list
                this.sharedService.showNotification('Photo Deleted');
            });
        }},
        {text: 'No', handler: (val) => {
          console.log('Do Nothing');
        }}
    ],
      header: 'Delete Record'
    }).then(alertElement => {
      alertElement.present();
    }); 
  }

  updateCoords(event) {
    console.log (' Update Coords');
    console.log (event);
    this.coords = event;
    this.form.markAsDirty();
  }

  updateOrientation(event) {
    console.log (' Update Orientation');
    this.orientation = event;
    this.form.markAsDirty();
  }

  geoRefChanged() {
    console.log(this.geoRefToggle.checked);
    this.form.get('useGeoRef').setValue(this.geoRefToggle.checked);
    this.genericPhoto.useGeoRef = this.geoRefToggle.checked;
    if (this.genericPhoto.useGeoRef) {
      this.selectedImage = this.genericPhoto.thumbnailGeoRefUrl;
    } else {
      this.selectedImage = this.genericPhoto.thumbnailUrl;
    }
  }


}
