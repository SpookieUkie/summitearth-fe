import { Component, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  isProduction = false;

  public RT_SubmittedDfrs = '/submitteddfrs/';
  public RT_MudUsed = '/mudused/';
  public RT_DisposalSummary = '/disposalsummary/';
  public RT_LoginByOS = '/loginbyos/';
  public RT_LoginByDevice = '/loginbydevice/';
  public RT_LoginByAgent = '/loginbyagent/';

  constructor() {
    this.isProduction = environment.production;
   }

  ngOnInit() {}


  
}
