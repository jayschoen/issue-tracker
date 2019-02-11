import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { mergeMap, map, toArray, filter } from 'rxjs/operators';

import { Tile } from '../tile';
import { IssuesService } from '../issues.service';
import { ConfigurationService } from '../configuration.service';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit {

  includedRepos: Array<string>;

  processed_repos = [];

  constructor(
    private configService: ConfigurationService,
    private issuesService: IssuesService,
    private cdr: ChangeDetectorRef
    ) {}

  ngOnInit() {

    this.includedRepos = this.configService.settings['includedRepos'];

    this.issuesService.getRepos()
      .pipe(
        mergeMap( x => x ),
        filter( x => this.includedRepos.includes(x)),
        mergeMap((repo: string) => {
            const current = this.issuesService
            .getIssuesByRepo(null, repo)
            .pipe(
              toArray(),
              map((issues: any[]) => { return { repo: repo, issues: issues }})
            );
            return current;
        }),
        toArray(),
        map(data => this.issuesService.processRepos(data)),
      )
      .subscribe(
        data => {
          this.processed_repos = data;
        },
        error => console.error(error),
        () => 'complete'
      );
  }
}
