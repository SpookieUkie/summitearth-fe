import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { ProjectTypeModel } from './project/projecttype.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ManageConfigService {

  private path = '/admin';
  public currentProjectType = new BehaviorSubject<ProjectTypeModel>(null); //For Management
  public projectTypeForJob = new BehaviorSubject<ProjectTypeModel>(null);
  
  public projectTypeModel$ = new BehaviorSubject<ProjectTypeModel>(null);

  public projectType: ProjectTypeModel;

  public projectTypeModel: ProjectTypeModel;
  //public currentProjectTypeObs = this.currentProjectType.asObservable();

  constructor(
    private router: Router,
    private httpClient: HttpClient) {
  }

  public isProjectTypeModelValid(projectNumber) {
    if (this.projectTypeModel$.value !== null && this.projectTypeModel$.value.projectNumber === Number(projectNumber) ) {
      return true;
    }
    return false;
  }

  public getAndSetProjectNumber(projectNumber) {
    this.httpClient
      .get<ProjectTypeModel>(environment.apiURL + this.path + '/projecttype/projectnumber/' + projectNumber)
      .subscribe((data) => {
        this.projectTypeModel$.next(data);
      });
  }

  public getProjectListByDate(startDate: Date, endDate: Date) {
    return this.httpClient.get(environment.apiURL + this.path + '/projecttype/startdate/' + startDate + '/enddate/' + endDate)
      .pipe(
        map((res: any) => {
          return res.data;
        })
      );
  }

  public getProjectByProjectNumberAndProjectType(projectNumber: string, projecttype: string) {
    return this.httpClient.get(environment.apiURL + this.path + '/projecttype/' + projecttype + '/projectnumber/' + projectNumber)
      .pipe(
          map((res: any) => {
            return res.data;
          })
        );
  }

  public isUniqueProjectNumberByProjectNumberAndProjectType(projectNumber: string, projectType: string) {
    return this.httpClient.get(environment.apiURL + this.path + '/projecttype/' + projectType + '/projectnumber/' + projectNumber + '/isunique')
      .pipe(
          map((res: any) => {
            return res.success;
          })
        );
  }

  public getProjectByJobNumber(jobNumber: string) {
    return this.httpClient.get(environment.apiURL + this.path + '/projecttype/jobnumber/' + jobNumber)
      .pipe(
          map((res: any) => {
            return res.data;
          })
        );
  }

  

  public getProjectByProjectId(id: string) {
    return this.httpClient.get(environment.apiURL + this.path + '/projecttype/id/' + id);
  }

  public getProjectByDfrId(id: string) {
    return this.httpClient.get(environment.apiURL + this.path + '/projecttype/dfrid/' + id);
  }


  public getValidateLocationsWithProject(projectDate: Date) {
    
  }

  public saveNewProject(disposalMethods, projectType, projectNumber, projectLabel) {
     const m = new ProjectTypeModel(null, projectType, projectLabel, projectNumber,  0, new Date(), 
                      null, true, null, null, null, null, null, [{disposalMethod: '', isActive: true}], null);
     delete m._id;

     m.disposalMethods.pop();
     disposalMethods.forEach((val: any) => {
      m.disposalMethods.push({disposalMethod: val.value, isActive: true});
    });
     return this.httpClient.post(environment.apiURL + this.path + '/projecttype', m);
  }

  public updateProject(data: ProjectTypeModel) {
    //TODO: Remove all ids that are new
     /* data.locations.forEach(element => {
        if (element._id.indexOf('_new') !== -1) {
          
        }
        
        }) */
      return this.httpClient.put(environment.apiURL + this.path + '/projecttype/' + data._id, data);
  }

}
