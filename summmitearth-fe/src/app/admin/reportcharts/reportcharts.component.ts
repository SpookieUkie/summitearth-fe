import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ReportchartsService } from './reportcharts.service';
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'app-reportcharts',
  templateUrl: './reportcharts.component.html',
  styleUrls: ['./reportcharts.component.scss'],
})
export class ReportchartsComponent implements OnInit  {
  @Input() reportType;
  @Input() reportTitle;
  @Input() chartType  = 'pie';
  @ViewChild('chart', { static: true })  chart: UIChart;

  data;

  options = {
    /*title: {
        display: true,
        text: 'My Title',
        fontSize: 16
    }, */
    legend: {
        position: 'bottom'
    }
};

  constructor(
    private reportChartsService: ReportchartsService
  ) {
  }

  ngOnInit() {
    console.log('on init');
    this.getChart();
  }

  ionViewWillEnter() {
    console.log('did view enter');
    this.getChart();
  }

  update(event: Event) {
    this.getChart();
    
  }

  getChart() {
    this.reportChartsService.getReport(this.reportType).subscribe((val: any) =>{
      this.data = val.report;
      if (this.chart !== undefined) {
        // this.chart.refresh();
      }
    });
  }

}
