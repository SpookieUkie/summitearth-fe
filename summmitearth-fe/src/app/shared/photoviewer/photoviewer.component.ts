import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavParams } from '@ionic/angular';
import { RouteEventsService } from '../route-events.service';

@Component({
  selector: 'app-photoviewer',
  templateUrl: './photoviewer.component.html',
  styleUrls: ['./photoviewer.component.scss'],
})
export class PhotoviewerComponent implements OnInit {
  navParams: NavParams;
  location: Location;
  photoUrl: string;
  dfrId: string;
  rigId: string;

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private routeEventsService: RouteEventsService) {
    activatedRoute.params.subscribe(val => {
      if (val.hasOwnProperty('photoURL')) {
        this.photoUrl = decodeURIComponent(val.photoURL);
      } else {
        this.photoUrl = decodeURIComponent(val.photourl);
      }
      
    });
  }

  ngOnInit() {

  }

  backToPage() {
    this.router.navigate([this.routeEventsService.previousRoutePath.value])
  }

}
