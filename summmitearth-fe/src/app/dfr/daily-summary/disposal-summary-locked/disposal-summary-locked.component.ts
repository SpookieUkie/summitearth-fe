import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { DfrRigService } from '../dfrrig.service';
import { IonInput, NavController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { DfrDailyRigModel } from '../daily-rig/daily-rig.model';
import { DfrActivityService } from '../../activity-summary/dfr-activity.service';

@Component({
  selector: 'app-disposal-summary-locked',
  templateUrl: './disposal-summary-locked.component.html',
  styleUrls: ['./disposal-summary-locked.component.scss'],
})
export class DisposalSummaryLockedComponent implements OnInit, OnDestroy {
  @Input() disposal;
  @ViewChild('sumTotal', { static: true }) sumTotal: IonInput;

  dfrDisposal$: Observable<DfrDailyRigModel[]>;
  sub: Subscription;

  constructor(
    private dfrRigService: DfrRigService,
    private dfrActivityService: DfrActivityService
    ) {
  }

  ngOnInit() {
    this.dfrDisposal$ = this.dfrActivityService.dfrProjectDisposalSummaryListObs;
    this.sub = this.dfrDisposal$.subscribe(val => {
      this.getTotalDisposalSummary();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getTotalDisposalSummary() {
    this.sumTotal.value = this.dfrActivityService.getTotalRigSummaryForType(this.disposal.disposalMethod).toString();
  }

}
