import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs'; 
import { mergeMap, map, toArray } from 'rxjs/operators';

import { Tile } from '../tile';

import { IssuesService } from '../issues.service';

export interface RepoMapping {
  repoName: string;
  issues: any[];
}

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit {

  tiles: Tile[];

  processed_issues: Array<Tile[]>;

  allData: Observable<any>;

  cooked_issues: Array<RepoMapping> = [];

  constructor(private issuesService: IssuesService) {}

  ngOnInit() {
    this.tiles = this.test_data(23);

    this.issuesService.getRepos()
      .pipe(
        mergeMap( x => x),
        mergeMap((repo: string) => {
          const current = this.issuesService
          .getIssuesByRepo(null, repo)
          .pipe(
            toArray(),
            map((issues: any[]) => { return { repo: repo, issues: issues }}));
        return current
        }),
        toArray(),
      )
      .subscribe(
        data => {
          console.log(data);
        },
        error => console.error(error),
        () => "complete"
      )
  }

  processRepos(repos) {
    return repos.map(repo => {
      return this.processIssues(repo);
    });
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

  getRepoName(url) {
    let temp = url.split('/');
    return temp[5];
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
