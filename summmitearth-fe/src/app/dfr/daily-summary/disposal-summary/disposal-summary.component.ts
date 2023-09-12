import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { DfrRigService } from '../dfrrig.service';
import { IonInput, NavController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { DfrDailyRigModel } from '../daily-rig/daily-rig.model';
import { DfrActivityService } from '../../activity-summary/dfr-activity.service';

@Component({
  selector: 'app-disposal-summary',
  templateUrl: './disposal-summary.component.html',
  styleUrls: ['./disposal-summary.component.scss'],
})
export class DisposalSummaryComponent implements OnInit, OnDestroy {
  @Input() disposal;
  @Output() valChanged = new EventEmitter();
  @ViewChild('sumTotal', { static: true }) sumTotal: IonInput;

  oriVal = '';
  dfrDisposal$: Observable<DfrDailyRigModel[]>;
  sub: Subscription;

  constructor(
    private dfrRigService: DfrRigService,
    private dfrActivityService: DfrActivityService
    ) {
  }

  ngOnInit() {
    this.dfrDisposal$ = this.dfrRigService.dfrRigListObs;
    this.sub = this.dfrDisposal$.subscribe(val => {
      this.getDailyDisposalSummary();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getDailyDisposalSummary() {
    this.sumTotal.value = this.dfrRigService.getDailyRigSummaryForType(this.disposal.disposalMethod).toString();
    this.oriVal = this.sumTotal.value;
  }

  emitChange() {
    if (this.oriVal !== this.sumTotal.value) {
      this.valChanged.emit();
    }
  }

}
