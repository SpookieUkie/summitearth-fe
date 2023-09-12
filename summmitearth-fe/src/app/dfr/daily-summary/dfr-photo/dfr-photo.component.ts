import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DFRPhotoService } from './dfr-photo.service';
import { DfrPhotoModel } from './dfr-photo.model';
import { AlertController, LoadingController, PopoverController, IonToggle, Platform } from '@ionic/angular';
import { PhotoviewerComponent } from 'src/app/shared/photoviewer/photoviewer.component';
import { Route } from '@angular/compiler/src/core';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { GeolocationComponent } from 'src/app/shared/geolocation/geolocation.component';
import { CameraPhoto } from '@capacitor/core';
import { CacheSaveDataService } from 'src/app/auth/cache-save-data.service';

@Component({
  selector: 'app-dfr-photo',
  templateUrl: './dfr-photo.component.html',
  styleUrls: ['./dfr-photo.component.scss'],
})
export class DfrPhotoComponent implements OnInit {
  @ViewChild('geolocation', { static: true }) geolocation: GeolocationComponent;
  @ViewChild('geoRef', { static: true }) geoRefToggle: IonToggle;
  @Input() rigPhoto: DfrPhotoModel;
  @Input() rigPhotoId: string;

  form: FormGroup;
  viewWidth = 0;
  selectedImage: string;
  dfrId: string;
  rigId: string;
  coords: any = {};
  orientation: any = {};


  constructor(
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private dfrPhotoService: DFRPhotoService,
    private cacheSaveDataService: CacheSaveDataService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private popoverController: PopoverController,
    private platform: Platform,
    private router: Router
    ) {
     
      this.activatedRoute.params.subscribe(val => {
        console.log(val);
        this.dfrId = val.dfrid;
        this.rigId = val.rigid;
      });

      this.viewWidth = this.sharedService.getPlaformWidth();
      console.log ('view width');
      console.log (this.viewWidth);
   }


  ngOnInit() {
    this.form = new FormGroup({
      dfrId: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dfrRigId: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      photoComments: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        updateOn: 'blur'
      }),
      useGeoRef: new FormControl(null, {
        updateOn: 'blur'
      }),
      additionalGeoRefComments: new FormControl(null, {
        updateOn: 'blur'
      }),
    });

   
    if (this.rigPhoto !== null) {
      this.form.get('photoComments').setValue(this.rigPhoto.photoComments);
      this.form.get('additionalGeoRefComments').setValue(this.rigPhoto.additionalGeoRefComments);
      if (this.rigPhoto.thumbnailUrl === undefined) { // This is local and offline
        this.form.get('image').setValue(this.rigPhoto.image);
        const fr = new FileReader();
        fr.onload = () => {
          const dataUrl = fr.result.toString();
          this.selectedImage =  dataUrl;
          //this.form.patchValue({ image: imageData});
          //this.coords = null; //Can't get coord from laptop
        };
        fr.readAsDataURL(this.rigPhoto.image);
      } else {
        if (this.rigPhoto.useGeoRef) {
          this.selectedImage = this.rigPhoto.thumbnailGeoRefUrl;
        } else {
          this.selectedImage = this.rigPhoto.thumbnailUrl;
        }
        this.form.get('image').setValue(this.rigPhoto.thumbnailUrl);
      }
      this.coords = this.rigPhoto.coords;
      this.form.get('useGeoRef').setValue(this.rigPhoto.useGeoRef);
    }
    if (this.coords === null || this.rigPhoto === null || this.rigPhoto.photoGeoRefUrl === null || this.rigPhoto.photoGeoRefUrl === undefined ) {
      this.geoRefToggle.disabled = true;
    }
  }



  showImage() {
    if (this.rigPhoto !== null && this.rigPhoto.photoUrl !== null) {
      let url = '';
      if (this.rigPhoto.useGeoRef) {
        url = this.rigPhoto.photoGeoRefUrl;
      } else {
        url = this.rigPhoto.photoUrl;
      }
      console.log (url);
      this.router.navigate(['tabs', 'dfr', this.dfrId, 'dfrrigs', this.rigId, 'photo', encodeURIComponent(url)]);
    } else {
      this.sharedService.showNotification('Please save the image first before previewing', 'danger');
    }
  }
 
  async showImage2(event) {
    if (this.rigPhoto !== null && this.rigPhoto.photoUrl !== null) {
      let url = '';
      if (this.rigPhoto.useGeoRef) {
        url = this.rigPhoto.photoGeoRefUrl;
      } else {
        url = this.rigPhoto.photoUrl;
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
    this.form.get('dfrId').setValue(this.dfrId);
    this.form.get('dfrRigId').setValue(this.rigId);
    if (this.rigPhoto === null || this.rigPhotoId === undefined || this.rigPhotoId === null) {
        this.addNewPhoto();
    } else {
        this.updatePhoto();
    }
  }

  async addNewPhoto() {
    const loader = await this.loadingController.create({
      message: 'Saving Photo, one moment please.',
      animated: true
    }).then(loaderElement => {
        loaderElement.present();
        this.dfrPhotoService.saveNewRigPhoto(this.form, this.coords).subscribe((val: any) => {
           this.sharedService.showNotification('Photo Record Added to Daily Rig');
           this.form.markAsPristine();
           this.rigPhoto = val.data;
           this.rigPhotoId = this.rigPhoto._id;
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
        this.dfrPhotoService.updateRigPhoto(this.form, this.rigPhotoId, this.coords).subscribe((val: any) => {
            this.sharedService.showNotification('Photo Record Updated to Daily Rig');
            this.form.markAsPristine();
            this.rigPhoto = val.data;
            this.rigPhotoId = this.rigPhoto._id;
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
            this.dfrPhotoService.deletePhoto(this.rigPhotoId).subscribe(val => {
                console.log ('Delete request complete');
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
    this.rigPhoto.useGeoRef = this.geoRefToggle.checked;
    if (this.rigPhoto.useGeoRef) {
      this.selectedImage = this.rigPhoto.thumbnailGeoRefUrl;
    } else {
      this.selectedImage = this.rigPhoto.thumbnailUrl;
    }
  }


}
