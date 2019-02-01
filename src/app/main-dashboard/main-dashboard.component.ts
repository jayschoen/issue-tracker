import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { mergeMap, map, toArray } from 'rxjs/operators';

import { Tile } from '../tile';
import { IssuesService } from '../issues.service';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit {

  test_tiles: Tile[];

  processed_repos = [];

  constructor(private issuesService: IssuesService, private cdr : ChangeDetectorRef) {}

  ngOnInit() {
    this.test_tiles = this.test_data(23);

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
        map(data => this.processRepos(data)),
      )
      .subscribe(
        data => {
          this.processed_repos = data
        },
        error => console.error(error),
        () => "complete"
      )
  }

  processRepos(repos): any[] {
    const datalist = [];
    for (let data of repos) {
      let tmp = {}
      let repo = data['repo'];
      if (data['issues'].length > 0) {
        tmp = {
          "name": repo,
          "data": this.processIssues(data)
        }
      } else {
        tmp = {
          "name": repo,
          "data": null
        }
      }
      datalist.push(tmp);
    }
    return datalist;
  }

  processIssues(repo) {
    let data = [];
    for (let issues of repo['issues']) {
      for (let issue of issues) {
        const color = (issue['state'] == 'open') ? '#CFFFBE' : '#FFDDDD';
        data.push({
          text: "#" + issue['number'] + ": " + issue['title'].substr(0, 20),
          rows: 1,
          cols: 1,
          color: color
        });
      }
    }
    return data;
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
