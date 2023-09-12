import { Component, OnInit } from '@angular/core';
import { DfrModel } from '../dfr-model';
import { DfrService } from '../dfr.service';
import { PopoverController, LoadingController, AlertController, NavController, IonInput, Platform} from '@ionic/angular';
import { PopoverComponent } from 'src/app/shared/popover/popover.component';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { StaticlistService } from 'src/app/shared/staticlist.service';
import { DfrActivityService } from '../activity-summary/dfr-activity.service';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { DfrRigService } from '../daily-summary/dfrrig.service';
import { DfrDailyRigModel } from '../daily-summary/daily-rig/daily-rig.model';
import { DfrPhotoModel } from '../daily-summary/dfr-photo/dfr-photo.model';
import { DFRPhotoService } from '../daily-summary/dfr-photo/dfr-photo.service';
import { DailyMudService } from '../daily-summary/daily-mud-list/daily-mud.service';
import { DailyMudModel } from '../daily-summary/daily-mud/daily-mud.model';
import { ManageConfigService } from 'src/app/admin/manageconfig.service';
import { ProjectLocationModel } from 'src/app/admin/project/projectlocation.model';
import * as moment from 'moment';
import { ProjectTypeModel } from 'src/app/admin/project/projecttype.model';
import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';

const { Filesystem } = Plugins;

@Component({
  selector: 'app-pdfview',
  templateUrl: './pdfview.component.html',
  styleUrls: ['./pdfview.component.scss'],
})
export class PdfviewComponent implements OnInit {


  dfrModel: DfrModel;
  currentDFR: DfrModel;
  currentDFRSub: Subscription;
  currentDFRActivitySubscription: Subscription;

  dfrRigList: DfrDailyRigModel[];
  dfrRigList$: Observable<DfrDailyRigModel[]>;
  dfrId;

  filterMudLocations: ProjectLocationModel[];

  logo = "";


  photoList: DfrPhotoModel[];
  dailyMudList: DailyMudModel[];
  cummulitveMudList: DailyMudModel[];

  projectTypeModel: ProjectTypeModel;
  
  subscriptions = new Array();

  constructor(
    private dfrService: DfrService,
    private sharedService: SharedService,
    private staticlistService: StaticlistService,
    private dfrActivityService: DfrActivityService,
    private dfrRigService: DfrRigService,
    private dfrPhotoService: DFRPhotoService,
    private dailyMudService: DailyMudService,
    private manageConfigService: ManageConfigService,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private platform: Platform,
    private fileOpener: FileOpener,
    private activatedRoute: ActivatedRoute
    ) {
     }

  ngOnInit() {

  }

  unsubscribe() {
    for (let i = this.subscriptions.length - 1; i >= 0; i--) {
      this.subscriptions[i].unsubscribe();
    }
  }

  createPDF() {
    console.log ('create pdf')
   this.dfrRigList$ = this.dfrRigService.dfrRigListObs;

   this.subscriptions.push(this.activatedRoute.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.dfrId = paramMap.get('id');
         if (this.currentDFR === undefined || this.currentDFR === null) {
          this.subscriptions.push(this.dfrService.getDFRByDfrId( this.dfrId ).subscribe(val => {
               this.currentDFR = val;
               this.getRelatedData();
            }));
          } else {
          this.getRelatedData();
         }
      }
    }));
  }

  getRelatedData() {
    this.subscriptions.push(this.manageConfigService.getProjectByProjectNumberAndProjectType(this.currentDFR.projectNumber, this.currentDFR.projectType).subscribe(val2 => {
      this.projectTypeModel = val2;
      const refDate = moment(this.currentDFR.dfrDate).endOf('day').toDate();
      this.filterMudLocations = this.sharedService.filterList(refDate, this.projectTypeModel.locations);
    }));

    this.subscriptions.push(this.dfrRigService.getDFRRigList2(this.dfrId).subscribe(val2 => {
      this.dfrRigList = val2;

      this.subscriptions.push(this.dfrPhotoService.getDFRPhotoListByDfrId(this.dfrId, true).subscribe( val3 => {
        this.photoList = val3;

        this.subscriptions.push(this.dailyMudService.getDailyMudListForDFR(this.dfrId).subscribe(val4 => {
              this.dailyMudList = val4;

              this.subscriptions.push(this.dailyMudService.getCalculatedMudByProjectCode(this.dfrId).subscribe(val5 => {
                this.cummulitveMudList = val5;
                this.subscriptions.push(this.dfrPhotoService.getLogoAsBase64().subscribe(logo => {
                   this.logo = logo;
                   this.preparePDF();
                }));
              }));
          }));
      }));
   }));
  }

  preparePDF() {
    pdfmake.vfs = pdfFonts.pdfMake.vfs;
    let def = {
     content: [
      {
        table: {
          style: 'noBorder',
          widths: ['50%', '50%'],
          width: '100%',
         
          body: [
            [{image: this.logo, fit: [166, 46],  border: [false, false, false, false]},
            {text: 'Daily Field Report: ' + this.currentDFR.dfrDate.toString().substring(0, 10), style: 'dfrTitle',  border: [false, false, false, false]}]
          ]
        },
    },
      
       {
        table: {
          style: 'tableStyle',
          widths: ['25%', '25%', '25%', '25%'],
          width: '100%',
          heights: [16, 16, 16, 16],
          body: [
            [{text: 'Project Name', style: 'subheader',  border: [true, true, true, false]}, {text: 'Project Number', style: 'subheader',  border: [true, true, true, false]}, 
            {text: 'Project Type', style: 'subheader', border: [true, true, true, false]}, {text: 'Date', style: 'subheader', border: [true, true, true, false]}],
            [{text: this.currentDFR.projectName, style: 'reg', border: [true, false, true, true]}, {text: this.currentDFR.projectNumber, style: 'reg', border: [true, false, true, true]}, 
            {text: this.currentDFR.projectType , style: 'reg', border: [true, false, true, true]}, {text:  this.currentDFR.dfrDate.toString().substring(0, 10), style: 'reg', border: [true, false, true, true]}],

            [{text: 'Project Location', style: 'subheader',  border: [true, true, true, false]}, {text: 'Superintendent', style: 'subheader',  border: [true, true, true, false]}, 
            {text: 'Enviro Lead', style: 'subheader',  border: [true, true, true, false]}, {text: 'Summit PM', style: 'subheader',  border: [true, true, true, false]}],
            [{text: this.currentDFR.projectLocation, style: 'reg', border: [true, false, true, true]}, {text: this.currentDFR.superIntendent, style: 'reg', border: [true, false, true, true]}, 
            {text: this.currentDFR.enviroLead , style: 'reg', border: [true, false, true, true]}, {text:  this.currentDFR.summitProjectManager, style: 'reg', border: [true, false, true, true]}],

            [{text: 'Client', style: 'subheader',  border: [true, true, true, false]}, {text: 'Solids Disposal Method', style: 'subheader',  border: [true, true, true, false]}, 
            {text: 'Liquid Disposal Method', style: 'subheader',  border: [true, true, true, false]}, {text: 'Contact', style: 'subheader',  border: [true, true, true, false]}],
            [{text: this.currentDFR.client, style: 'reg', border: [true, false, true, true]}, {text: this.currentDFR.solidsDisposalMethod, style: 'reg', border: [true, false, true, true]}, 
            {text: this.currentDFR.liquidsDisposalMethod , style: 'reg', border: [true, false, true, true]}, {text:  this.currentDFR.contactInformation, style: 'reg', border: [true, false, true, true]}],

            [{text: 'Installed Pipe Size', style: 'subheader',  border: [true, true, true, false]}, {text: 'Reaming Progression', style: 'subheader',  border: [true, true, true, false]}, 
            {text: 'Weather', style: 'subheader',  border: [true, true, true, false]}, {text: 'Forcast', style: 'subheader',  border: [true, true, true, false]}],
            [{text: this.currentDFR.installedPipeSize, style: 'reg', border: [true, false, true, true]}, {text: this.currentDFR.reamingProgression, style: 'reg', border: [true, false, true, true]}, 
            {text: this.currentDFR.enviroLead , style: 'reg', border: [true, false, true, true]}, {text:  this.currentDFR.forecastWeather, style: 'reg', border: [true, false, true, true]}],

            [{text: 'Summit Field Rep', style: 'subheader',  border: [true, true, true, false]}, {text: 'Summit Rep Contact', style: 'subheader',  border: [true, true, true, false]}, 
            {text: 'Hours of Work', style: 'subheader',  border: [true, true, true, false]}, {text: "", style: 'subheader',  border: [true, true, true, false]}],
            [{text: this.currentDFR.summitFieldRepresentative, style: 'reg', border: [true, false, true, true]}, 
            {text: this.currentDFR.summitFieldContactInformation, style: 'reg', border: [true, false, true, true] }, 
            {text: this.currentDFR.hoursOfWork, style: 'reg', border: [true, false, true, true]}, {text: "", style: 'subheader', border: [true, false, true, true]}],
          ]
        }
       }, {

        table: {
          style: 'tableStyle',
          widths: ['100%'],
          body: [
            [{text: ' ', style: 'subheader' , border: [false, false, false, false]}],
            [{text: 'Daily Activity Summary', style: 'subheader' , border: [false, false, false, false], 	fillColor: '#EEEEEE'}],
            [{text: this.currentDFR.dailyActivitySummary, style: 'reg'}],
          ]
        },
      }, {
        table: {
          style: 'tableStyle',
          widths: ['25%', '25%', '25%', '25%'],
          heights: [16, 16, 16, 16],
          body: this.generateDfrRigs()
        },
      },
      {
        table: {
          style: 'tableStyle',
          widths:  ['100%'],
          body: [
            [{text: 'Daily Mud Summary', style: 'subheader', border: [false, false, false, false], 	fillColor: '#EEEEEE'}]
          ]
        },
      },
      {
        table: {
          style: 'tableStyle',
          widths: this.generateDailyMudWidths(),
          headerRows: 1,
         //heights: [16, 16, 16, 16],
          body: this.generateDailyMud()
        },
      },
      {
        table: {
          style: 'tableStyle',
          widths:  ['100%'],
          body: [
            [{text: ' ', style: 'subheader', border: [false, false, false, false] }],
            [{text: 'Cummulitive Mud Summary', style: 'subheader', border: [false, false, false, false], 	fillColor: '#EEEEEE'}]
          ]
        },
      },
      {
        table: {
          style: 'tableStyle',
          widths: this.generateCummulitveMudWidths(),
          headerRows: 1,
         //heights: [16, 16, 16, 16],
          body: this.generateCummulitveMud()
        },
      },
     ],
     
      styles: {
        tableStyle: {
          fontSize: 18,
          bold: true
        },
        noBorders: {
          layout: 'noBorders'
        },
        dfrTitle: {
          fontSize: 16,
          bold: true,
          alignment: 'right',
          layout: 'noBorders'
        },
        header: {
          fontSize: 18,
          bold: true
        },
        subheader: {
          fontSize: 11,
          bold: true
        },
        quote: {
          italics: true
        },
        reg: {
          fontSize: 9,
          height: 16
        },
        photoComments: {
          fontSize: 9,
          alignment: 'buttom'
        },
        small: {
          fontSize: 8
        }
      }
    }

    if (this.platform.is('ios') || this.platform.is('android')) {
      let pdfObj = pdfmake.createPdf(def);
        this.writeFile(pdfObj);

    } else {
      pdfmake.createPdf(def).open();
    }
    this.unsubscribe();
  }


  writeFile(pdfObj) {
    pdfObj.getBase64((blob) => {
     
    //this.mkdir();
    const fileName = 'DFR'+this.currentDFR.dfrDate.toString().substring(0, 10);
    try {
      Filesystem.writeFile({
        path: fileName,
        data: blob,
        directory: FilesystemDirectory.Documents
        // encoding: FilesystemEncoding.UTF8
      }).then((writeFileResult) => {
        Filesystem.getUri({
            directory: FilesystemDirectory.Documents,
            path: fileName
        }).then((getUriResult) => {
            const path = getUriResult.uri;
            this.fileOpener.open(path, 'application/pdf')
            .then(() => console.log('File is opened'))
            .catch(error => console.log('Error openening file', error));
        }, (error) => {
            console.log(error);
        });
      });
    } catch (error) {
      console.error('Unable to write file', error);
    }
   
    });
  }


  generateDailyMudWidths() {
    if( this.dailyMudList.length > 0) {
      let dm = this.dailyMudList[0];

      let w = ['30%', '10%', '10%'];
      let v = Math.floor(50 / dm.locations.length );
      let total = 0;
      dm.locations.forEach(val => {
        w.push(v.toString() + '%');
        total = total + v;
      });
      w[0] = String(30 + 50 - total) + '%';
      return w;
    }
    return[];
  }

  generateDailyMud() {
   let mudStr = '';
   let allStr = '';

    let header = ['Product', 'Size', 'Toxicity'];
    if ( this.dailyMudList.length > 0) {
      let dm = this.dailyMudList[0];
      dm.locations.forEach(val => {
        header.push(val.locationName);
      });
    }

    let muds = [];

    this.dailyMudList.forEach(mud => {
      if (mud.size === null || mud.size === undefined) { mud.size = ""};
      if (mud.toxicity === null || mud.toxicity === undefined) { mud.toxicity = ""};
      
      let mudObj = [{text: mud.productName}, {text: mud.size},{text: mud.toxicity}];
      mud.locations.forEach(loc => {
        if (loc.total === null || loc.total === undefined) {
          loc.total = 0;
        }
        mudObj.push ({text: loc.total.toString()});
      });
      muds.push(mudObj);
      
    });
    muds.reverse();
    let list = this.buildTableBody(muds, header);
    
     console.log ('muds');
     console.log(list);
     return list;
  }



  generateCummulitveMudWidths() {
    if( this.dailyMudList.length > 0) {
      let  dm = this.filterMudLocations;

      let w = ['30%', '10%', '10%'];
      let v = Math.floor(50 / dm.length );
      let total = 0;
      dm.forEach(val => {
        w.push(v.toString() + '%'); 
        total = total + v;
      });
      w[0] = String(30 + 50 - total) + '%';
      return w;
    }
    return[];
  }

  generateCummulitveMud() {
   let mudStr = '';
   let allStr = '';

    let header = ['Product', 'Size', 'Toxicity'];
    if ( this.cummulitveMudList.length > 0) {
      let dm = this.filterMudLocations;
      dm.forEach(val => {
        header.push(val.locationName);
      });
    }

    let muds = [];

    this.cummulitveMudList.forEach(mud => {
      if (mud.size === null || mud.size === undefined) { mud.size = ""};
      if (mud.toxicity === null || mud.toxicity === undefined) { mud.toxicity = ""};
      
      let mudObj = [{text: mud.productName}, {text: mud.size},{text: mud.toxicity}];
      mud.locations.forEach(loc => {
        if (loc.total === null || loc.total === undefined) {
          loc.total = 0;
        }
        mudObj.push ({text: loc.total.toString()});
      });
      muds.push(mudObj);
      
    });
    muds.reverse();
    let list = this.buildTableBody(muds, header);
    
     console.log ('muds');
     console.log(list);
     return list;
  }

  buildTableBody(data, columns) {
    var body = [];

    body.push(columns);

    data.forEach(function(row) {
        var dataRow = [];

        let i = 0;
        columns.forEach(function(column) {
          console.log(row[i]);
          //dataRow.push(row[column].toString());
          dataRow.push(row[i]);
          i++;
        })

        body.push(dataRow);
    });

    return body;
}


  generateDfrRigs() {
    let allDataStr = '';
    let salStr = '';
    let photoStr = '';

    let rigTitle = [ 
      [{text: '', border: [false, false, false, false]}, {text: '', border: [false, false, false, false]}, 
      {text: '', border: [false, false, false, false]}, {text: '', border: [false, false, false, false]}],
      [{colSpan: 4, text: 'Daily Rigs', style: 'subheader', border: [false, false, false, false], 	fillColor: '#EEEEEE'}, 
      {text: '', }, {text: ''}, {text: ''}]]
      
    allDataStr = this.prepareJSON(rigTitle, allDataStr);

    this.dfrRigList.forEach(rig => {
      salStr = '';
      photoStr = '';

      if (rig.salinities.length > 0) {
        let salTitle = [ 
          [{colSpan: 4, text: 'Salinities', style: 'subheader'}, {text: ''}, {text: ''}, {text: ''}]]
          salStr = this.prepareJSON(salTitle, salStr);
      }

      rig.salinities.forEach(sal => {
        let salData = [ 
          [{colSpan: 4, style: 'subheader',  table: {
          style: 'tableStyle',
          widths: ['7%', '7%', '7%', '7%', '7%', '7%', '7%', '7%', '26%', '18%'],
          body: [
              ['pH', 'Ca', 'EC', 'Mg', 'Na', 'N', 'S', 'Cl', 'Water Body Crossing', 'Daily NTU'],
              [sal.pH, sal.Ca, sal.EC, sal.Mg, sal.Na, sal.N, sal.S, sal.Cl, sal.waterBodyCrossing, sal.dailyNTU]
            ]
          },  }, {text: ''}, {text: ''}, {text: ''},]
        ];

       salStr = this.prepareJSON(salData, salStr);
      });

     

      // Get all photos related to rig
      this.photoList.forEach(photo => {
        if (photo.dfrRigId === rig._id) {
          let photoData = [
              [{colSpan: 4, text: 'Photos', style: 'subheader'}, {text: ''}, {text: ''}, {text: ''}],
              [{colSpan: 4, style: 'subheader',  table: {
              style: 'tableStyle',
              widths: ['100%'],
              body: [
                  [' ' ],
                  [{ image: photo.photoUrl, fit: [400, 225],  alignment: 'center'}],
                  [{text: photo.photoComments, style: 'photoComments'} ]
                ]
              },  }, {text: ''}, {text: ''}, {text: ''}]
            ];
            photoStr = this.prepareJSON(photoData, photoStr);
        }
      });



      let newData = [
        [{text: 'Rig Name/Number', style: 'subheader', border: [true, true, true, false]}, {text: 'Disposal Method', style: 'subheader', border: [true, true, true, false]}, 
         {text: 'Entry Location', style: 'subheader', border: [true, true, true, false]}, {text: 'Exit Location', style: 'subheader', border: [true, true, true, false]}],
        [{text: rig.rigNameNumber, style: 'reg', border: [true, false, true, true]}, {text: rig.disposalMethod, style: 'reg', border: [true, false, true, true]},
        {text: rig.entryLocation, style: 'reg', border: [true, false, true, true]}, {text: rig.exitLocation, style: 'reg', border: [true, false, true, true]} ],

        [{text: 'Disposal Area', style: 'subheader', border: [true, true, true, false]}, {text: 'Daily Volume', style: 'subheader', border: [true, true, true, false]}, 
        {text: 'Crossing Location', style: 'subheader', border: [true, true, true, false]}, {text: 'Crossing Name', style: 'subheader', border: [true, true, true, false]}],
       [{text: rig.disposalArea, style: 'reg', border: [true, false, true, true]}, {text: rig.dailyVolume, style: 'reg', border: [true, false, true, true]},
       {text: rig.crossingLocation, style: 'reg', border: [true, false, true, true]}, {text: rig.crossingName, style: 'reg', border: [true, false, true, true]} ],

       [{text: 'Total Crossing Volume', style: 'subheader', border: [true, true, true, false]}, {text: 'Current Activity', style: 'subheader', border: [true, true, true, false]}, 
       {text: 'Have Mud Been Tested', style: 'subheader', border: [true, true, true, false]}, {text: 'Crossing Length', style: 'subheader', border: [true, true, true, false]}],
      [{text: rig.totalCrossingVolume, style: 'reg', border: [true, false, true, true]}, {text: rig.currentActivity, style: 'reg', border: [true, false, true, true]},
      {text: rig.mudTested, style: 'reg', border: [true, false, true, true]}, {text: rig.crossingLength, style: 'reg', border: [true, false, true, true]} ],

       [{text: 'Crossing Progress', style: 'subheader', border: [true, true, true, false]}, {colSpan: 3, text: 'Rig Progress', style: 'subheader', border: [true, true, true, false]}, 
       {text: '', border: [true, true, true, false]}, {text: '', border: [true, true, true, false]}],
     [{text: rig.crossingProgress, style: 'reg', border: [true, false, true, true]}, {colSpan: 3,  text: rig.rigComments, style: 'reg', border: [true, false, true, true]}, {text: '', border: [true, false, true, true]}, {text: '', border: [true, false, true, true]}],


      
      ];

      allDataStr = this.prepareJSON(newData, allDataStr);
      if (salStr !== '') {
        allDataStr = allDataStr + ',' + salStr;
      }
      if (photoStr !== '') {
        allDataStr = allDataStr + ',' + photoStr;
      }
      let spacerStr =  [[{colSpan: 4, text: ' ', border: [false, false, false, false]} , {text: ''}, {text: ''}, {text: ''}]];
      allDataStr = this.prepareJSON(spacerStr,  allDataStr);
    });
    allDataStr = '[' + allDataStr + ']';
    console.log ('defData');
    console.log (allDataStr);

    console.log ('defData parse');
    console.log (JSON.parse(allDataStr));
    return JSON.parse(allDataStr);
    //return (allDataStr);
  }

  prepareJSON(newData, currentData) {
    let strData = JSON.stringify(newData);
    strData = strData.substr(1, strData.length - 2);
    if (currentData !== '') {
      currentData = currentData + ', ';
    }
    currentData = currentData + strData;
    return currentData;
  }

  base64String(imageData) {
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      return dataUrl;
    };
    fr.readAsDataURL(imageData);
  
  }

}
