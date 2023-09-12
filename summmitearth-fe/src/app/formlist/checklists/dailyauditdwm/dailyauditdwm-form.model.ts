import { FormControl, Validators, FormArray } from '@angular/forms';
import { DailyAuditDwmModel } from './dailyauditdwm.model';
import { DailyAuditDwmSprayfieldModel } from './dailyauditdwmsprayfield.model';


export class DailyAuditDWMFormModel {
      _id = new FormControl(null, {
        updateOn: 'blur',
      });
      jobNumber =  new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      province = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      clientName = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      inspectionDate = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      environmentalTechnician = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      client = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      wellLocation = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      drillingRig = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      uwi = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      timeOfInspection = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      sprayfieldLocations =  new FormArray([
        
      ]);
    
      regCompSeason = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      regCompReceivingSoilEC = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      regCompReceivingSoilSAR = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      regCompSlope = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      regCompProximityToWater = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      regCompUpgradientBarrier = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      tdlWaterPermit =  new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      tdlCondtionsMetAndDocumented =  new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      tdlPermitPostAtRig = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      tdlPermitInWaterTruck = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      trackingSheetsInUse = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      labResultsPostedAtRig =  new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      maxAllowablesPostedAtRig = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      onsiteInfoWellType = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      onsiteInfoSpills = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      onsiteInfoDripTrays = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      cementDisposalLocation =  new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      cementStorageType =  new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      drilloutFluidsDisposal =  new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      preventativeCorrectiveActions =  new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      comments =  new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      auditorName =  new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      auditorSignature =  new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      documentSafetyMeeting = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      documentLandUseAgreement = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      documentWaterUseAgreement = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });

      documentTDLWaterPermit = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });

      documentOnsitePresprayMap = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });

      documentWaterAccessOrientation = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }); 
      
      documentAerialPhotoSubmission = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });

      documentLandTitleSearch = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });

      documentDWMP = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });

      fieldTestTestKit = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      fieldTestProperEquipment = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      fieldTestProperTestingProcedures = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      });
      assignedToUserId = new FormControl(null, { });
      reportStatus = new FormControl(null, { });
      naNotes = new FormControl(null, { });


      constructor() {
         // this.sprayfieldLocations.push(new DailyAuditDwmSprayfieldModel() );
        //this._id.setValue(mod._id);
      }
}

