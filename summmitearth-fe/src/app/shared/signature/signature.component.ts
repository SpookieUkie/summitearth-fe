import { Component, OnInit, ViewChild, Input, AfterContentInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { SharedService } from '../shared.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Plugins } from '@capacitor/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GenericPhotoFormModel } from '../genericphoto/genericphoto-form.model';
import { GenericPhotoService } from '../genericphoto/genericphoto.service';
import { GenericPhotoModel } from '../genericphoto/genericphoto.model';
import { Subscription } from 'rxjs';
import { IonImg } from '@ionic/angular';
const { Screen } = Plugins;

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss'],
})
export class SignatureComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('signaturePad') signaturePad: SignaturePad;
  @ViewChild('signatureImage') signatureImage: IonImg;
  @Input() currentSig: string;
  @Input() title: String;
  @Input() genericId: string = null;
  @Input() genericIdType: string  = null;
  @Input() genericSubId: string = null;
  @Input() genericSubIdType: string = null;
  @Output() signatureDone: EventEmitter<String> = new EventEmitter();


  currentSignature: GenericPhotoModel;
  form: FormGroup;
  subs: Subscription[];
  genericPhoto: GenericPhotoModel;
  isHidden = false;
  interval: any;

  public signaturePadOptions: Object = {
    'minWidth': 1,
    'canvasWidth': 200,
    'canvasHeight': 200,
    'backgroundColor': '#f6fbff',
    'penColor': '#666a73'
  };

  constructor(private sharedService: SharedService,
     private genericPhotoService: GenericPhotoService,
     private screenOrientation: ScreenOrientation,
     private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    console.log ('get signature');
    this.subs = [];
    this.subs.push(this.genericPhotoService.getGenericPhotoList(this.genericId, this.genericIdType, 'signature').subscribe (val => {
      this.genericPhoto = val[val.length - 1];
      if (this.genericPhoto !== null && this.genericPhoto !== undefined) {
        this.setPhoto();
        this.hasImage();
        console.log ('got image');
      }
    }));

  }

  ngOnDestroy() {
    for (let i = this.subs.length - 1; i > 0; i--) {
      this.subs[i].unsubscribe();
    }
  }

  ionViewWillEnter( ) {
    console.log('view did enter!!!!!');
  }

  ngAfterContentInit() {
    console.log (' after init');
    //this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime, does not work
    setTimeout(() => { //Required to set
      //this.signaturePad.set('minWidth', 10);
        this.setPadSize();
     }, 5);
  }

  setPhoto() {
    this.signatureImage.src = this.genericPhoto.photoUrl;
  }

  clearPad() {
    this.signaturePad.clear();
    if (this.genericPhoto !== undefined && this.genericPhoto !== null) {
      this.subs.push(this.genericPhotoService.deletePhoto(this.genericPhoto._id).subscribe (val => {
        this.genericPhoto = null;
        this.hasImage();
        this.sharedService.showNotification('Signature Removed');
      }));
    }
  }

  setPadSize() {
    this.signaturePad.set('canvasWidth', this.sharedService.getPlaformWidth() - 50);
  }

  hasImage() {
    this.isHidden = this.genericPhoto !== null && this.genericPhoto !== undefined;
    console.log (this.isHidden);
  }

  drawComplete() {
   // console.log(this.signaturePad.toDataURL());
   clearInterval(this.interval);
   this.interval = setInterval(() => {
        this.saveSignatureImage();
    }, 2000);
  }


  saveSignatureImage() {
    this.currentSig = this.signaturePad.toDataURL();
    this.signatureDone.emit(this.currentSig);
    this.saveSignature();
    clearInterval(this.interval);
  }

  drawStart() {
    console.log('begin drawing');
  }

  imageClicked() {
    this.sharedService.showNotification('Please remove the current signature first before adding a new one.');
  }


  saveSignature() {
    this.form = this.formBuilder.group(new GenericPhotoFormModel());
    this.form = this.genericPhotoService.preparePhotoForSaving(
        this.form, this.genericId, this.genericIdType, this.genericSubId, this.genericSubIdType,  'signature');

     const imageFile = this.sharedService.dataURLToBlob(this.currentSig);
     this.form.patchValue({ image: imageFile});
     this.genericPhotoService.saveNewGenericPhoto(this.form, null).subscribe((val: any) => {
        console.log( val);
        this.genericPhoto = val.data;
        this.setPhoto();
        this.hasImage();
        this.sharedService.showNotification('Signature Saved');
     });
  }


}
