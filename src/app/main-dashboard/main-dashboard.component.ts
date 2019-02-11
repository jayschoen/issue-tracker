import { Component, OnInit } from '@angular/core';

import { IssuesService } from '../issues.service';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit {

  processed_repos = [];

  interval: any;

  constructor(
    private issuesService: IssuesService
  ) {}

  ngOnInit() {

    this.issuesService.data$.subscribe(
      data => this.processed_repos = data,
      error => console.error(error),
    );

    this.issuesService.updateData();
    this.interval = setInterval(() => {
      this.issuesService.updateData();
    }, 300000);
  }
}
