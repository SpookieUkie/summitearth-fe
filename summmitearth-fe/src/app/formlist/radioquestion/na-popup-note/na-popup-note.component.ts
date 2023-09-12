import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NavParams, ModalController, IonTextarea } from '@ionic/angular';

@Component({
  selector: 'app-na-popup-note',
  templateUrl: './na-popup-note.component.html',
  styleUrls: ['./na-popup-note.component.scss'],
})
export class NaPopupNoteComponent implements OnInit {
  @Input() sectionTitle: string;
  @Input() popupNote: string;
  @ViewChild('popupNoteTextArea') popupNoteTextArea: IonTextarea;

  constructor(private navParams: NavParams,
    private modalController: ModalController
    ) {
      
     }

  ngOnInit() {

  }


  onCancel() {
    console.log ('cancel');
    this.modalController.dismiss(this.popupNote);
  }

  onSubmit() {
    console.log ('save');
    this.modalController.dismiss(this.popupNoteTextArea.value);
  }


}
