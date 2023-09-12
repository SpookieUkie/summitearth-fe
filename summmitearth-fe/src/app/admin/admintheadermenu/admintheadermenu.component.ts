import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-admintheadermenu',
  templateUrl: './admintheadermenu.component.html',
  styleUrls: ['./admintheadermenu.component.scss'],
})
export class AdmintheadermenuComponent implements OnInit {

  isMobile = true;

  constructor(
    private router: Router,
    private sharedService: SharedService)
    {
      this.isMobile = this.sharedService.isCellPhone();
      console.log(this.isMobile);
    }

  ngOnInit() {}

  moveTo(item) {
    if (item === 'projects') {
      this.router.navigate(['admin', 'project']);
    } else if (item === 'users') {
      this.router.navigate(['admin', 'users']);
    } else if (item === 'clients') {
      this.router.navigate(['admin', 'clients']);
    } else if (item === 'epmDFR') {
      this.router.navigate(['admin', 'dfrs']);
    } else if (item === 'rrrDFR') {
      this.router.navigate(['admin', 'rrrdfrs']);
    } else if (item === 'dailyauditdwm') {
      this.router.navigate(['admin', 'dailyauditdwm']);
    }  else if (item === 'adminhome') {
      this.router.navigate(['admin']);
    }  else if (item === 'muds') {
      this.router.navigate(['admin', 'muds']);
    }
  }

}
