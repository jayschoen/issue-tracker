import { Component, OnInit } from '@angular/core';

import { combineLatest } from 'rxjs'; 
import { mergeMap, tap,  } from 'rxjs/operators';

import { Tile } from '../tile';

import { IssuesService } from '../issues.service';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit {

  tiles: Tile[];

  processed_issues: Array<Tile[]>;

  constructor(private issuesService: IssuesService) {}

  ngOnInit() {
    this.tiles = this.test_data(23);

    this.issuesService.getRepos()
      .pipe(
        mergeMap(
          repos => {
          let temp = [];
          let i = 0;
          for (let repo of repos) {
            temp.push(this.issuesService.getIssuesByRepo(null, repo).pipe(tap(data=> console.log(data))));
          }
          return combineLatest(temp);
        })
      )
      .subscribe(
        repos => {
          console.log(repos);
          let organized_repos = [];
          for (let repo of repos) {
            if (repo !== null && repo.length > 0) {
              let repo_name = this.getRepoName(repo[0]['repository_url']);
              organized_repos[repo_name] = repo;
            }
          }
          console.log(organized_repos);

        },
        error => console.error(error),
        () => "complete"
      )
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
