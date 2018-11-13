import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';

import { Tile } from '../tile';

import { IssuesService } from '../issues.service';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit {

  tiles: Tile[];

  processed_issues: Tile[];


  constructor(private issuesService: IssuesService) {}

  ngOnInit() {
    this.tiles = this.test_data(23);

    this.issuesService.getIssues()
      .subscribe(
        issues => {
          this.processed_issues = this.processIssues(issues);
          console.log(issues);
        },
        error => console.error(error),
        () => console.log('complete')
      );
  }

  processIssues(issues) {
    return issues.map(issue => {
      const color = (issue['state'] == 'open') ? '#CFFFBE' : '#FFDDDD';
      return { 
      text: "#" + issue['number'] + ": " + issue['title'].substr(0, 20),
      rows: 1,
      cols: 1,
      color: color 
    }
    });
  }

  /* *** */
  test_data(count) {
    let temp = [];
    for (let i = 1; i <= count; i++) {
      let color = '';
      if (this.isPrime(i) ) {
        color = 'orange';
      } else {
        color = 'blue';
      }
      temp.push({
        text: 'issue ' + i,
        rows: 1,
        cols: 1,
        color: color
      })
    }
    return temp;
  }

  isPrime(num) {
    for(var i = 2; i < num; i++)
      if(num % i === 0) return false;
    return num !== 1 && num !== 0;
  }
  /* *** */

}
