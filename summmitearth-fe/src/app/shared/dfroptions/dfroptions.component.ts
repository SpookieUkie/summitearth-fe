import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DfrModel } from 'src/app/dfr/dfr-model';
import { DfrService } from 'src/app/dfr/dfr.service';
import { PopoverController, LoadingController, AlertController, NavController, IonInput, Platform, NavParams} from '@ionic/angular';
import { PopoverComponent } from 'src/app/shared/popover/popover.component';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { StaticlistService } from 'src/app/shared/staticlist.service';
import { DfrActivityService } from 'src/app/dfr/activity-summary/dfr-activity.service';
import { DfrActivityModel } from 'src/app/dfr/activity-summary/dfr-activity-model';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { DfrRigService} from 'src/app/dfr/daily-summary/dfrrig.service';
import { DfrDailyRigModel } from 'src/app/dfr/daily-summary/daily-rig/daily-rig.model';
import { DfrPhotoModel } from 'src/app/dfr/daily-summary/dfr-photo/dfr-photo.model';
import { DFRPhotoService } from 'src/app/dfr/daily-summary/dfr-photo/dfr-photo.service';
import { DailyMudService } from 'src/app/dfr/daily-summary/daily-mud-list/daily-mud.service';
import { DailyMudModel } from 'src/app/dfr/daily-summary/daily-mud/daily-mud.model';
import { ManageConfigService } from 'src/app/admin/manageconfig.service';
import { ProjectLocationModel } from 'src/app/admin/project/projectlocation.model';
import * as moment from 'moment';
import { ProjectTypeModel } from 'src/app/admin/project/projecttype.model';
import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilesService } from '../genericfile/genericfile.service';
import { CacheSaveDataService } from 'src/app/auth/cache-save-data.service';

const { Filesystem } = Plugins;

@Component({
  selector: 'app-dfroptions',
  templateUrl: './dfroptions.component.html',
  styleUrls: ['./dfroptions.component.scss'],
})
export class DfroptionsComponent implements OnInit {
  @Output() itemSelected =  new EventEmitter();

  dfrModel: DfrModel;
  dfrActivityModel: DfrActivityModel;
  
  currentView: string;
  fileSub: Subscription;

  currentDFR: DfrModel;
  currentDFRSub: Subscription;
  currentDFRActivitySubscription: Subscription;

  dfrRigList: DfrDailyRigModel[];
  dfrRigList$: Observable<DfrDailyRigModel[]>;
  dfrId;

  filterMudLocations: ProjectLocationModel[];

  logo = "";
  isLocked = false;


  photoList: DfrPhotoModel[];
  dailyMudList: DailyMudModel[];
  cummulitveMudList: DailyMudModel[];

  projectTypeModel: ProjectTypeModel;
  loaderElement;
  
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
    private filesService: FilesService,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private platform: Platform,
    private fileOpener: FileOpener,
    private navParams: NavParams,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cacheSaveDataService: CacheSaveDataService
    ) {
      this.dfrId = this.navParams.data.dfrId;
      this.currentView = this.navParams.data.currentView;
      if (this.navParams.data.isLocked !== undefined) {
        this.isLocked = this.navParams.data.isLocked;
      }
     }


  ngOnInit() {
    console.log ('pdf on init');
    
  }


  menuItem(loc: string) {
    console.log (loc);
    //this.itemSelected.emit(loc);
    if (loc === 'submitDFR') {
      if (this.currentDFR === undefined || this.currentDFR === null) {
        this.subscriptions.push(this.dfrService.getDFRByDfrId( this.dfrId ).subscribe(val => {
             this.currentDFR = val;
             this.submitDFR();
          }));
        }
    
    }
    this.popoverController.dismiss(loc);
  }

  submitDFR() {
    const sub: Subscription =  this.dfrService.submitDFR(this.currentDFR).subscribe((val: any) => {
      if (val.success === true) {
        sub.unsubscribe();
        this.sharedService.showNotification('Daily Field Report Submitted Successfully');
        this.router.navigate(['/', 'tabs']);
      } else {
        this.sharedService.showNotification('Daily Field Report Failed to Submit', 'danger');
      }
    });
  }

  unsubscribe() {
    for (let i = this.subscriptions.length - 1; i >= 0; i--) {
        this.subscriptions[i].unsubscribe();
    }
  }

  async cacheOptions() {
      const alert = await this.alertController.create({
        header: 'Caching Options',
        message: 'Please select an option related to caching',
        cssClass: 'cacheAlert',
        buttons: [
          {
            text: 'Cache DFR',
            cssClass: 'primary',
            handler: () => {
             this.cacheDFR();
            }
          },
          {
            text: 'Clear Cache',
            cssClass: 'secondary',
            handler: () => {
              this.cacheSaveDataService.clear();
              this.sharedService.showNotification('Cache Cleared');
            }
          },
          {
            text: 'Save Cached Data',
            cssClass: 'secondary',
            handler: () => {
               this.cacheSaveDataService.saveCachedData();
            }
          },
          {
            text: 'Cancel',
            cssClass: 'secondary',
            handler: () => {
              //Do nothing
            }
          }
        ]
      });
      await alert.present();
  }

 

  async cacheDFR() {
    this.popoverController.dismiss();
    this.dfrRigList$ = this.dfrRigService.dfrRigListObs;

    const loader = await this.loadingController.create({
      message: 'Caching Current DFR. One Moment Please.'
    }).then(loaderElement => {
        loaderElement.present();
        this.loaderElement = loaderElement;
        if (this.currentDFR === undefined || this.currentDFR === null) {
          this.dfrService.getDFRByDfrId( this.dfrId ).subscribe(val => {
            this.currentDFR = val;
            this.getRelatedData(false);
          }), err => {
              loaderElement.remove();
          };
        } else {
          this.getRelatedData(false);
        }
   });
  }

  //Note this is out of the subscription as it causes it to fail
  async createPDF(dfrId) {

        this.popoverController.dismiss();
        this.dfrRigList$ = this.dfrRigService.dfrRigListObs;

        const loader = await this.loadingController.create({
          message: 'Generating Daily Field Report PDF. One Moment Please.'
        }).then(loaderElement => {
            loaderElement.present();
            this.loaderElement = loaderElement;
            if (this.currentDFR === undefined || this.currentDFR === null) {
              this.dfrService.getDFRByDfrId( this.dfrId ).subscribe(val => {
                this.currentDFR = val;
                this.getRelatedData(true);
              }), err => {
                  loaderElement.remove();
              };
            } else {
              this.getRelatedData(true);
            }
      });
  } 

  createPDF2(dfrId) {
    console.log ('create pdf')
    this.popoverController.dismiss();
    this.dfrRigList$ = this.dfrRigService.dfrRigListObs;

   //this.subscriptions.push(this.activatedRoute.paramMap.subscribe(paramMap => {
      //if (paramMap.has('id')) {
         if (this.currentDFR === undefined || this.currentDFR === null) {
          this.subscriptions.push(this.dfrService.getDFRByDfrId( this.dfrId ).subscribe(val => {
               this.currentDFR = val;
               this.getRelatedData(true);
            }));
          } else {
          this.getRelatedData(true);
         }
     // }
    //}));
  }

  getRelatedData(createPDF: boolean) {
    this.subscriptions.push(this.manageConfigService.getProjectByProjectNumberAndProjectType(this.currentDFR.projectNumber, this.currentDFR.projectType).subscribe(val2 => {
      this.projectTypeModel = val2;
      const refDate = moment(this.currentDFR.dfrDate).endOf('day').toDate();
      this.filterMudLocations = this.sharedService.filterList(refDate, this.projectTypeModel.locations);
    }));

    this.subscriptions.push(this.dfrActivityService.getDFRActByDfrId(this.dfrId).subscribe(val1 => {
      this.dfrActivityModel = val1;

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
                      console.log ('prepare pdf');
                      if (createPDF) {
                        this.preparePDF();
                      } else {
                        this.sharedService.showNotification('Current DFR Cached');
                        if (this.loaderElement !== undefined) {
                          this.loaderElement.dismiss();
                        }
                      }

                    }));
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
          heights: [14, 14, 14, 14],
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
      }, 
      {
        table: {
          style: 'tableStyle',
          widths: ['33%', '33%', '34%'],
          heights: [16, 16, 16],
          body: [
            [{text: '# of Active Rigs', style: 'subheader',  border: [true, false, false, false]}, 
            {text: 'Spray Field Conditions', style: 'subheader',  border: [true, false, false, false]}, 
            {text: 'Remaining Vol in Storage', style: 'subheader',  border: [true, false, true, false]}],
            [{text: this.dfrActivityModel.numberOfActiveDrillsAndRigs, style: 'reg', border: [true, false, false, false]}, 
            {text: this.dfrActivityModel.sprayFieldConditions, style: 'reg', border: [true, false, false, false]}, 
            {text: this.dfrActivityModel.remainingVolumeInStorage, style: 'reg', border: [true, false, true, false]}]

          ]
        },
      },
      {
        table: {
          style: 'tableStyle',
          widths: ['25%', '25%', '25%', '25%'],
          heights: [16, 16, 16, 16],
          body: this.generateActivitySummary()
        },
      },
      { 
        table: {
        style: 'tableStyle',
        widths: ['100%'],
        body: [
          [{text: ' ', style: 'subheader' , border: [false, false, false, false]}],
          [{text: 'Project to Date Disposal Summary', style: 'subheader' , border: [false, false, false, false], 	fillColor: '#EEEEEE'}]
        ]
        }
      }, 
      {
        table: {
          style: 'tableStyle',
          widths: ['25%', '25%', '25%', '25%'],
          heights: [16, 16, 16, 16],
          body: this.generateProjectToDateDisposalSummary()
        },
      },  
      { 
        table: {
        style: 'tableStyle',
        widths: ['100%'],
        body: [
          [{text: ' ', style: 'subheader' , border: [false, false, false, false]}],
          [{text: 'Project to Date Crossing Summary', style: 'subheader' , border: [false, false, false, false], 	fillColor: '#EEEEEE'}]
          ]
        }
      }, 
       
      {
        table: {
          style: 'tableStyle',
          widths: ['25%', '25%', '25%', '25%'],
          heights: [16, 16, 16, 16],
          body: this.generateProjectToDateCrossingSummary()
        },
      },
     
      {
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
       this.generateDailyMudView(),
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
      this.generateCummulitiveMudView(),
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
          height: 14
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

    try {
      if (this.platform.is('ios') || this.platform.is('android')) {
        this.sharedService.showNotification("Generating PDF. This may take a few seconds");
        let pdfObj = pdfmake.createPdf(def);
          this.writeFile(pdfObj);
      } else {
        console.log ('OPEN PDF');
        pdfmake.createPdf(def).open();
      }
       if (this.loaderElement !== undefined) {
        this.loaderElement.dismiss();
       }
    } catch (err) {
      this.sharedService.showNotification("Error Generating PDF. Try saving the Rigs and Mud Product sections again. Please contact support if this continues to happen.", "danger", 4000);
      if (this.loaderElement !== undefined) {
        this.loaderElement.dismiss();
      }
      console.log (err);
    }
    this.unsubscribe();
  }


  writeFile(pdfObj) {
    pdfObj.getBase64((blob) => {
     

    const fileName = 'DFR' + this.currentDFR.dfrDate.toString().substring(0, 10);
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

  generateActivitySummary() {
    this.filterDisposals('dailyDisposalSummary')
    return this.generateSummary('dailyDisposalSummary', 'disposalMethod', 'summaryTotal' );
  }

  //TODO. Ensure the display order is honored
  generateProjectToDateCrossingSummary() {
    return this.generateSummary('crossingSummary', 'crossingLocation', 'totalCrossingVolume');
  }

  generateProjectToDateDisposalSummary() {
    this.filterDisposals('projectDisposalSummary')
    return this.generateSummary('projectDisposalSummary', 'disposalMethod', 'dailyVolume' );
  }

  filterDisposals(col) {
    const fnlList = [];
    this.projectTypeModel.disposalMethods.forEach((val: any) => {
      if (val.isActive) {
        this.dfrActivityModel[col].forEach((val2: any) => {
          if (val.disposalMethod === val2.disposalMethod) {
            fnlList.push(val2);
          }
        });
      }
    });

    this.dfrActivityModel[col] = fnlList;
  }
  

  generateSummary(col, header, value) {
    // Get Count of summary locations
    let arrHeader = new Array();
    let arrValue = new Array();
    let arrTotal = new Array();
    let i = 0;
    let ttl = 0;
    this.dfrActivityModel[col].forEach(el => {
      var obj = {};
      if (el[header] === null) { el[header] = ''}
      obj['text'] = el[header];
      obj['style'] = 'subheader';
      obj['border'] = [];
      obj['border'].push(true);
      obj['border'].push(true);
      obj['border'].push(true);
      obj['border'].push(false);
      arrHeader.push(obj);


      obj = {};
      obj['text'] = el[value];
      obj['style'] = 'reg';
      obj['border'] = [];
      obj['border'].push(true);
      obj['border'].push(false);
      obj['border'].push(true);
      obj['border'].push(true);
      //console.log (obj);
      arrValue.push(obj);
      
      if (i === 3) {
        arrTotal.push (arrHeader);
        arrTotal.push(arrValue);
        arrHeader = [];
        arrValue =[];
        i = 0;
      } else {
        i++;
      }
      ttl++;
      
    });

    // Determine how many padded results
    console.log (i)
    if (i != 0) {
      do {
        var obj = {};
        obj['text'] = '';
        obj['style'] = 'subheader';
        obj['border'] = [] //[true, true, true, false];;
        obj['border'].push(true);
        obj['border'].push(true);
        obj['border'].push(true);
        obj['border'].push(false);
        arrHeader.push(obj);

        obj = {};
        obj['text'] = '';
        obj['style'] = 'reg';
        obj['border'] = [] //[true, true, true, false];;
        obj['border'].push(true);
        obj['border'].push(false);
        obj['border'].push(true);
        obj['border'].push(true);
        arrValue.push(obj);

        if (i >= 3) {
          arrTotal.push (arrHeader);
          arrTotal.push(arrValue);
        }
        i++;
      }
      while (i < 4);
    }

    console.log(arrTotal);
    let val = this.prepareJSON(arrTotal, '');
    let val2 = "[" + val + "]"

    return JSON.parse(val2);

  }

  generateCummulitiveMudView() {
    if (this.cummulitveMudList.length === 0) {
      return { }
    }

    let json =  {
      table: {
        style: 'tableStyle',
        widths: this.generateCummulitveMudWidths(),
        headerRows: 1,
       //heights: [16, 16, 16, 16],
        body: this.generateCummulitveMud()
      },
    }
    return json;
  }

  generateDailyMudView() {
    if (this.dailyMudList.length === 0) {
      return { }
    } 

    let json = {
      table: {
        style: 'tableStyle',
        widths: this.generateDailyMudWidths(),
        headerRows: 1,
       //heights: [16, 16, 16, 16],
        body: this.generateDailyMud()
      },
    }
    return json;
  }

  generateDailyMudWidths()  {
    return (this.generateMudListColumsnFinal(this.dailyMudList));
  }

  generateDailyMud() {
    return this.generateMudListFinal(this.dailyMudList);
  }

  generateCummulitveMudWidths() {
     return (this.generateMudListColumsnFinal(this.cummulitveMudList));
  }

  generateCummulitveMud() {
     return this.generateMudListFinal(this.cummulitveMudList);
  }

  generateMudListColumsnFinal(mudList) {
    if( mudList.length > 0) {
      let dm = mudList[0];

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
    return['100%'];
  }

  generateMudListFinal(mudList) {
    let mudStr = '';
    let allStr = '';
   /* if (mudList.length === 0) {
     // return [' '];
      return this.buildTableBody([' '], [' ']);
    }*/
    let header = [{text: 'Product', style: 'subheader' }, 
    {text: 'Size', style: 'subheader'},
    {text: 'Toxicity', style: 'subheader'}];
     if ( mudList.length > 0) {
       let dm = this.filterMudLocations;
       dm.forEach(val => {
         header.push({text: val.locationName,  style: 'subheader'});
       });
     }
 
     let muds = [];
 
      mudList.forEach(mud => {
       if (mud.size === null || mud.size === undefined) { mud.size = ""};
       if (mud.toxicity === null || mud.toxicity === undefined) { mud.toxicity = ""};
       
       let mudObj = [{text: mud.productName, style: 'reg' }, {text: mud.size, style: 'reg' }, {text: mud.toxicity, style: 'reg' }];
       mud.locations.forEach(loc => {
         if (loc.total === null || loc.total === undefined) {
           loc.total = 0;
         }
         mudObj.push ({text: loc.total.toString(), style: 'reg' });
       });
       muds.push(mudObj);
       
     });
     muds.reverse();
     let list = this.buildTableBody(muds, header);
 
     return list;
   }

  buildTableBody(data, columns) {
    var body = [];

    body.push(columns);

    data.forEach(function(row) {
        var dataRow = [];

        let i = 0;
        columns.forEach(function(column) {
         // console.log(row[i]);
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
    let disStr = '';

    let rigTitle = [ 
      [{text: '', border: [false, false, false, false]}, {text: '', border: [false, false, false, false]}, 
      {text: '', border: [false, false, false, false]}, {text: '', border: [false, false, false, false]}],
      [{colSpan: 4, text: 'Daily Rigs', style: 'subheader', border: [false, false, false, false], 	fillColor: '#EEEEEE'}, 
      {text: '', }, {text: ''}, {text: ''}]]
      
    allDataStr = this.prepareJSON(rigTitle, allDataStr);

    this.dfrRigList.forEach(rig => {
      salStr = '';
      photoStr = '';
      disStr = '';

      if (rig.disposalAreas.length > 0) {
          let disposalTitle = [ 
            [{colSpan: 4, text: 'Disposal', style: 'subheader'}, {text: ''}, {text: ''}, {text: ''}]]
            disStr = this.prepareJSON(disposalTitle, disStr);

          let disData = [ 
            [{colSpan: 4, style: 'reg',  table: {
            style: 'tableStyle',
            widths: ['33%', '33%', '34%'],
            body: this.getDisposalTable(rig.disposalAreas)
            },  }, {text: ''}, {text: ''}, {text: ''}]
          ];
          disStr = this.prepareJSON(disData, disStr);
      }

      if (rig.salinities.length > 0) {
          let salTitle = [ 
            [{colSpan: 4, text: 'Salinities', style: 'subheader'}, {text: ''}, {text: ''}, {text: ''}]]
            salStr = this.prepareJSON(salTitle, salStr);
          
          let salData = [ 
            [{colSpan: 4, style: 'subheader',  table: {
            style: 'tableStyle',
            widths: ['7%', '7%', '7%', '7%', '7%', '7%', '7%', '7%', '26%', '18%'],
            body: this.getSalinityTable(rig.salinities)
            },  }, {text: ''}, {text: ''}, {text: ''}]
          ];
  
          salStr = this.prepareJSON(salData, salStr);   
      }

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
        [{text: 'Rig Name/Number', style: 'subheader', border: [true, true, true, false]}, {text: 'Crossing Location', style: 'subheader', border: [true, true, true, false]}, 
         {text: 'Entry Location', style: 'subheader', border: [true, true, true, false]}, {text: 'Exit Location', style: 'subheader', border: [true, true, true, false]}],
        [{text: rig.rigNameNumber, style: 'reg', border: [true, false, true, true]}, {text: rig.crossingLocation, style: 'reg', border: [true, false, true, true]},
        {text: rig.entryLocation, style: 'reg', border: [true, false, true, true]}, {text: rig.exitLocation, style: 'reg', border: [true, false, true, true]} ],

        [{text: 'Crossing Name', style: 'subheader', border: [true, true, true, false]}, {text: 'Total Crossing Volume', style: 'subheader', border: [true, true, true, false]}, 
        {text: 'Current Activity', style: 'subheader', border: [true, true, true, false]}, {text: 'Crossing Length', style: 'subheader', border: [true, true, true, false]}],
       [{text: rig.crossingName, style: 'reg', border: [true, false, true, true]}, {text: rig.totalCrossingVolume, style: 'reg', border: [true, false, true, true]},
       {text: rig.currentActivity, style: 'reg', border: [true, false, true, true]},  {text: rig.crossingLength, style: 'reg', border: [true, false, true, true]} ],

       [{text: 'Crossing Progress', style: 'subheader', border: [true, true, true, false]}, {text: 'Have Mud Been Tested', style: 'subheader', border: [true, true, true, false]},
       {colSpan: 2, text: 'Rig Progress', style: 'subheader', border: [true, true, true, false]}, {text: '', border: [true, true, true, false]}],
      [{text: rig.crossingProgress, style: 'reg', border: [true, false, true, true]},  {text: rig.mudTested, style: 'reg', border: [true, false, true, true]},
      {colSpan: 2,  text: rig.rigComments, style: 'reg', border: [true, false, true, true]}, {text: '', border: [true, false, true, true]}],

      ];

      allDataStr = this.prepareJSON(newData, allDataStr);
      if (disStr !== '') {
        allDataStr = allDataStr + ',' + disStr;
      }
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
    /*console.log ('defData');
    console.log (allDataStr);

    console.log ('defData parse');
    console.log (JSON.parse(allDataStr));  */
    return JSON.parse(allDataStr);
    //return (allDataStr);
  }

  getSalinityTable(sal) {
   // ['pH', 'Ca', 'EC', 'Mg', 'Na', 'N', 'S', 'Cl', 'Water Body Crossing', 'Daily NTU']

   let arrValue = new Array();
   let arrTotal = new Array();
    var obj = {};
    obj = this.setObjHeader(obj, 'pH');
    arrValue.push(obj);

    obj = {};
    obj = this.setObjHeader(obj, 'Ca');
    arrValue.push(obj);

    obj = {};
    obj = this.setObjHeader(obj, 'EC');
    arrValue.push(obj);

    obj = {};
    obj = this.setObjHeader(obj, 'Mg');
    arrValue.push(obj);

    obj = {};
    obj = this.setObjHeader(obj, 'Na');
    arrValue.push(obj);

    obj = {};
    obj = this.setObjHeader(obj, 'N');
    arrValue.push(obj);

    obj = {};
    obj = this.setObjHeader(obj, 'S');
    arrValue.push(obj);

    obj = {};
    obj = this.setObjHeader(obj, 'Cl');
    arrValue.push(obj);

    obj = {};
    obj = this.setObjHeader(obj, 'Water Body Crossing');
    arrValue.push(obj);

    obj = {};
    obj = this.setObjHeader(obj, 'Daily NTU');
    arrValue.push(obj);

    arrTotal.push(arrValue);
    arrValue = [];

  
    sal.forEach(el => {
      obj = {};
      obj = this.setObj(obj, el['pH']);
      arrValue.push(obj);

      obj = {};
      obj = this.setObj(obj, el['Ca']);
      arrValue.push(obj);

      obj = {};
      obj = this.setObj(obj, el['EC']);
      arrValue.push(obj);

      obj = {};
      obj = this.setObj(obj, el['Mg']);
      arrValue.push(obj);

      obj = {};
      obj = this.setObj(obj, el['Na']);
      arrValue.push(obj);

      obj = {};
      obj = this.setObj(obj, el['N']);
      arrValue.push(obj);

      obj = {};
      obj = this.setObj(obj, el['S']);
      arrValue.push(obj);

      obj = {};
      obj = this.setObj(obj, el['Cl']);
      arrValue.push(obj);

      obj = {};
      obj = this.setObj(obj, el['waterBodyCrossing']);
      arrValue.push(obj);

      obj = {};
      obj = this.setObj(obj, el['dailyNTU']);
      arrValue.push(obj);

      arrTotal.push(arrValue);
      arrValue = [];
    });
    console.log ('arrTotal');
    console.log (arrTotal);
    return arrTotal;
   // [sal.pH, sal.Ca, sal.EC, sal.Mg, sal.Na, sal.N, sal.S, sal.Cl, sal.waterBodyCrossing, sal.dailyNTU]
  }

  getDisposalTable(data) {

    let arrValue = new Array();
    let arrTotal = new Array();

    //['Disposal Method', 'Disposal Area', 'Daily Volume'],
    var obj = {};
    obj = this.setObjHeader(obj, 'Disposal Method');
    arrValue.push(obj);

    obj = {};
    obj = this.setObjHeader(obj, 'Disposal Area');
    arrValue.push(obj);

    obj = {};
    obj = this.setObjHeader(obj, 'Daily Volume');
    arrValue.push(obj);

    arrTotal.push(arrValue);
    arrValue = [];

    data.forEach(el => {
      obj = {};
      obj = this.setObj(obj, el['disposalMethod']);
      arrValue.push(obj);

      obj = {};
      obj = this.setObj(obj, el['disposalArea']);
      arrValue.push(obj);

      obj = {};
      obj = this.setObj(obj, el['dailyVolume']);
      arrValue.push(obj);

      arrTotal.push(arrValue);
      arrValue = [];
    });
    console.log ('arrTotal');
    console.log (arrTotal);
    return arrTotal;
  }

  private setObjHeader(obj, headerValue) {
    obj['text'] = {text: headerValue, style: 'subheader'};
    //obj['style'] = 'reg';
    obj['border'] = [];
    obj['border'].push(true);
    obj['border'].push(true);
    obj['border'].push(true);
    obj['border'].push(true);
    return obj;
  }

  private setObj(obj, text) {
    obj['text'] = text;
    obj['style'] = 'reg';
    obj['border'] = [];
    obj['border'].push(true);
    obj['border'].push(true);
    obj['border'].push(true);
    obj['border'].push(true);
    return obj;
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

// -------------- Field Ticket and Excel DFR -------

async createFieldTicket () {
  console.log (this.cacheSaveDataService.status.connected);
  if (!this.cacheSaveDataService.status.connected) {
    this.sharedService.showNotification('This feature is not available offline', 'warning', 2000);
  } else {
      const loader = await this.loadingController.create({
        message: 'Generating Field Ticket, One Moment Please.',
        animated: true
      }).then(loaderElement => {
        loaderElement.present();
        const str = this.dfrId;
        this.fileSub = this.filesService.createDailyFieldTicket(str).subscribe((val: any) => {
            const filePath = val.data.filePath;
            const fileName = val.data.fileName;
    
            if (this.sharedService.isMobileDevice()) {
                this.openOnDevice(filePath, fileName);
            } else {
              window.open(filePath, '_blank');
            }
            loaderElement.remove();
            this.fileSub.unsubscribe();
            }, (err) => {
              this.sharedService.showNotification('Error generating field ticket.  Please check all the information in the daily field report.', 'danger', 2000);
            });
      });
    }
  }

  async createExcelDFR() {
    console.log (this.cacheSaveDataService.status.connected);
    if (!this.cacheSaveDataService.status.connected) {
      this.sharedService.showNotification('This feature is not available offline', 'warning', 2000);
    } else {
      const loader = await this.loadingController.create({
        message: 'Creating DFR Excel Document, One Moment Please.',
        animated: true
      }).then(loaderElement => {
        loaderElement.present();
        const str = this.dfrId;
        this.fileSub = this.filesService.createExcelDFR(str).subscribe((val: any) => {
            const filePath = val.data.filePath;
            const fileName = val.data.fileName;

            if (this.sharedService.isMobileDevice()) {
                this.openOnDevice(filePath, fileName);
            } else {
              window.open(filePath, '_blank');
            }
            loaderElement.remove();
            this.fileSub.unsubscribe();
          }, (err) => {
            this.sharedService.showNotification('Error generating daily field report.  Please check all the information in the daily field report.', 'danger', 2000);
            loaderElement.remove();
          });
      });
    }
  }

  openOnDevice(filePath: string, fileName: string) {
    const ft = FileTransfer.create();
    try {
      ft.download(filePath, File.dataDirectory + fileName).then((writeFileResult) => {

        this.fileOpener.open(writeFileResult.toURL(), 'application/vnd.ms-excel')
              .then(() => console.log('File is opened'))
              .catch(error => console.log('Error openening file', error));
        }, (error) => {
            console.log(error);
        });

    } catch (error) {
      console.error('Unable to read file', error);
    }
  }

}
