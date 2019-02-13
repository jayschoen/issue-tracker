import { Component, OnInit } from '@angular/core';

import { IssuesService } from '../issues.service';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit {

  issueColors = this.issuesService.issueColors;

  processed_repos = [];

  interval: any;

  breakpoint = 4;

  constructor(
    private issuesService: IssuesService
  ) {}

  ngOnInit() {

    this.breakpoint = (window.innerWidth <= 1250) ? 3 : 4;

    this.issuesService.data$.subscribe(
      data => this.processed_repos = data,
      error => console.error(error),
    );

    this.issuesService.updateData();
    this.interval = setInterval(() => {
      this.issuesService.updateData();
    }, 300000);
  }

  checkWindowSize(event) {
    this.breakpoint = (event.target.innerWidth <= 1250) ? 3 : 4;
  }
}
