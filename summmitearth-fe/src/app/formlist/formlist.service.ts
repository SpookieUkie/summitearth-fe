import { Injectable } from '@angular/core';
import { CacheSaveDataService } from '../auth/cache-save-data.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FormlistService {

  private path = '/formlists';
  private currentDFR = new BehaviorSubject<null>(null);

  constructor(private router: Router,
    private httpClient: HttpClient,
    private cacheSaveDataService: CacheSaveDataService) { }

  getAllActiveFormsByType(formType) {
    return this.httpClient.get(environment.apiURL + this.path + '/active/formtype/' + formType)
    .pipe(
        map((res: any) => {
          return res.data;
        })
      );
  }
}
