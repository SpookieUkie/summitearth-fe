import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { FieldTicketOptionsModel } from './fieldticketoptions.model';

@Injectable({
  providedIn: 'root'
})
export class FieldticketoptionsService {

  path = '/fieldticketoptions';

  constructor(private httpClient: HttpClient, private router: Router, private sharedService: SharedService) {}

  public saveFieldTicketOption(fieldTicketModel: FieldTicketOptionsModel) {
    delete fieldTicketModel._id;
    return this.httpClient.post(environment.apiURL + this.path + '/fto/', fieldTicketModel);
  }

  public updateFieldTicketOption(fieldTicketModel: FieldTicketOptionsModel) {
    return this.httpClient.put(environment.apiURL + this.path + '/fto/' + fieldTicketModel._id, fieldTicketModel);
  }

  public getAllFieldTicketOptions() {
    return this.httpClient.get(environment.apiURL + this.path + '/fto/');
  }

  public getSingleFieldTicketOption(id: string) {
    return this.httpClient.get(environment.apiURL + this.path + '/fto/' + id);
  }

}
