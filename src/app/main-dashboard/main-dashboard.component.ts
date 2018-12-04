import { Component, OnInit } from '@angular/core';

import { combineLatest, forkJoin ,of, from, zip, Observable, empty } from 'rxjs'; 
import { mergeMap, tap, combineAll,map, expand } from 'rxjs/operators';

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

  allData: Observable<any>;

  constructor(private issuesService: IssuesService) {}

  ngOnInit() {
    this.tiles = this.test_data(23);

    this.issuesService.getRepos()
      .pipe(

        /* .pipe(
          expand(data => data.next ? this.getAllPages(data.next) : empty()),
          mergeMap(({content}) => content),
        ); */
        // map(
        mergeMap( x => x),
        tap(data => console.log(data)),
        expand(repo => repo ? this.issuesService.getIssuesByRepo(null, repo).pipe(tap(data => console.log(data))) : empty()),
        // mergeMap(
        //   repos => {
        //   let temp = [];
        //   let count = 0;
        //   // for (let repo of repos) {
        //   //   temp.push(this.issuesService.getIssuesByRepo(null, repo).pipe(tap(data => console.log(data))));
        //   //   count++;
        //   //   if (count > 0) {
        //   //     break;
        //   //   }
        //   // }

        //   // let temp = repos.map(
        //   //   repo => { 
        //   //     console.log(repo);
        //   //     return this.issuesService.getIssuesByRepo(null, repo)
        //   //     .pipe(
        //   //       tap(data => console.log("herpderp", data))
        //   //     )
        //   //   }
        //   // );
        //   console.log('pre_combineLatest');
        //   console.log(temp);
        //   // return temp
        //   return combineLatest(temp);
        // }),
        tap(data => console.log(data)),
        // mergeMap(data => of(data)),
        // mergeMap(data => zip(...data)),
        tap(data => console.log("fired")),

      )
      .subscribe(
        repos => {
          console.log('SUBSCRIBE!!!');
          console.log(repos);
          // let organized_repos = [];
          // for (let repo of repos) {
          //   if (repo !== null && repo.length > 0) {
          //     let repo_name = this.getRepoName(repo[0]['repository_url']);
          //     organized_repos[repo_name] = repo;
          //   }
          // }
          
          // console.log(organized_repos);

          // console.log(this.processRepos(organized_repos));


        },
        error => console.error(error),
        () => "complete"
      )
     
  }

  processRepos(repos) {
    console.log('processRepos');
    return repos.map(repo => {
      return this.processIssues(repo);
    });
  }

  processIssues(issues) {
    console.log('processIssues');
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
