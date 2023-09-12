import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';
import { environment } from './../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { ClientModel } from './client.model';
import { map, filter, catchError } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  private  clientList =  new BehaviorSubject<ClientModel | any>(null);
  private path = '/clients';

  constructor(private httpClient: HttpClient, private router: Router, private sharedService: SharedService) {}

  public saveClient(clientModel: ClientModel) {
    delete clientModel._id;
    return this.httpClient.post(environment.apiURL + this.path + '/client/', clientModel);
  }

  public updateClient(clientModel: ClientModel) {
    return this.httpClient.put(environment.apiURL + this.path + '/client/' + clientModel._id, clientModel);
  }

  public getAllClients() {
    return this.httpClient.get(environment.apiURL + this.path + '/allclients/');
  }

  public getClientsByGroup(type = 'RRR') {
    if (this.clientList.value === undefined || this.clientList.value == null) {
       this.httpClient.get(environment.apiURL + this.path + '/allclients/')
        .pipe(map ( (res: any)  => {
          this.clientList.next(res.data);
        })).subscribe();
    }
    
  }

  public getClientsInList() {
    /*return this.clientList.pipe(
      map(items => items.filter(val => val.clientType === type)),
    ); */
    return this.clientList;
  }

  public getSingleClient(id: string) {
    return this.httpClient.get(environment.apiURL + this.path + '/client/' + id);
  }



}
