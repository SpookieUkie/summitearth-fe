import { Component, OnInit, ElementRef, EventEmitter, ViewChild, Output, Input } from '@angular/core';
import { Plugins, CameraResultType, CameraSource, Capacitor, CameraPhoto} from '@capacitor/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit {
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string | File>();
  @Input() showPreview = false;
  selectedImage: string;
  usePicker = false;
  viewWidth = 0;

  constructor( private sanitizer: DomSanitizer, private platform: Platform) { }
  
  ngOnInit() {
    if ( this.platform.is('desktop')) {
      this.usePicker = true;
    }
   
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 90,
      source: CameraSource.Prompt,
      correctOrientation: true,
      allowEditing: true,
      // height: 320,
      //width: 1500,
      resultType: CameraResultType.DataUrl //CameraResultType.Base64
    })
      .then(image => {
        console.log('onPickImage camera');
        this.selectedImage = image.dataUrl;
        this.imagePick.emit(image.dataUrl);
      })
      .catch(error => {
        //console.log('ERROR ' + error);
        if (this.usePicker) {
          this.filePickerRef.nativeElement.click();
        }
        return false;
      });
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  }
  




}
