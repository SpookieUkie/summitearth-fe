import { Injectable, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportchartsService {

  private path = '/summaryreports';

  constructor(
    private router: Router,
    private httpClient: HttpClient) {
  }

  public getReport(reportType) {
    return this.httpClient.get(environment.apiURL + this.path + reportType);
  }
}
