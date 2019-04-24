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

  default_width = '5:1';
  default_height = '4:1';
  issue_width = window.innerWidth <= 1250 ? 3 : 4;
  issue_height = window.innerWidth <= 1250 ? this.default_width : this.default_height;

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

  checkWindowSize(event?) {
    let window_width = window.innerWidth;
    const issue_size = {};

    if (event) {
      window_width = event.target.innerWidth;
      issue_size['width'] = (window_width <= 1250) ? 3 : 4;
      issue_size['height'] = (window_width <= 1250) ? this.default_width : this.default_height;
    }

    this.issue_width = issue_size['width'];
    this.issue_height = issue_size['height'];

    return issue_size;
  }

  calculateSize(issue_count, type) {
    const size = {};

    if (issue_count >= 4) {
      size['width'] = this.issue_width;
      size['height'] = this.issue_height;
    } else if (issue_count === 3) {
      size['width'] = 3;
      size['height'] = '5:1';
    } else if (issue_count === 2) {
      size['width'] = 2;
      size['height'] = '8:1';
    } else {
      size['width'] = 1;
      size['height'] = '15:1';
    }

    if (type === 'width') {
      return size['width'];
    } else {
      return size['height'];
    }
  }
}
