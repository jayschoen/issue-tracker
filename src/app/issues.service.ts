import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap, expand, catchError, toArray, filter, tap } from 'rxjs/operators';
import { empty, throwError, BehaviorSubject } from 'rxjs';

import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {

  // probably need to move this int the environment file
  private github_url = '';

  private access_token = '';
  private owner = '';
  private organization = '';

  includedRepos: Array<string>;

  data$ = new BehaviorSubject<any[]>(undefined);

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigurationService
  ) {
    this.includedRepos = this.configService.settings['includedRepos'];
  }

  getIssues() {
    return this.httpClient.get(
      `${this.github_url}/repos/${this.owner}/issue-tracker/issues?state=all&sort=created&direction=asc&per_page=100&access_token=${this.access_token}`
    );
  }

  getIssuesByRepo(url?, repo_name?) {
    return this.getAllPages(url, repo_name)
    .pipe(
      expand(data => data.next ? this.getAllPages(data.next) : empty()),
      map(({content}) => content),
    );
  }

  getAllPages(url?, repo_name?) {
    if (repo_name) {
      url = `${this.github_url}/repos/${this.owner}/${repo_name}/issues?state=all&sort=created&direction=asc&per_page=100&access_token=${this.access_token}`
    }
    return this.httpClient.get(
      url,
      {observe: 'response'}
    )
    .pipe(
      catchError(error => {
        return throwError(error);
      }),
      map(response =>
        this.retrieve_pagination_links(response)
      )
      );
  }

  getRepos() {
    return this.httpClient.get<any[]>(`${this.github_url}/orgs/${this.organization}/repos?access_token=${this.access_token}&per_page=100`)
      .pipe(
        map(
          repos => {
            const temp = [];
            for (const repo of repos) {
              temp.push(repo['name']);
            }
            return temp;
          })
      );
  }

  parse_next_header(header) {
    if (!header) {
      return ;
    }

    const parts = header.split(',');
    const links = {};
    parts.forEach( p => {
      const section = p.split(';');
      const url = section[0].replace(/<(.*)>/, '$1').trim();
      const name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;

    });
    return links['next'];
  }

  retrieve_pagination_links(response) {
    const nextHeader = this.parse_next_header(response.headers.get('Link'));
    return {
      content: response.body,
      next: nextHeader ? nextHeader : null
    };
  }

  processRepos(repos): any[] {
    const datalist = [];
    for (const data of repos) {
      let tmp = {};
      const repo = data['repo'];
      if (data['issues'].length > 0) {
        tmp = {
          'name': repo,
          'data': this.processIssues(data)
        };
      } else {
        tmp = {
          'name': repo,
          'data': null
        };
      }
      datalist.push(tmp);
    }
    return datalist;
  }

  processIssues(repo) {
    const data = [];
    for (const issues of repo['issues']) {
      for (const issue of issues) {
        const color = (issue['state'] === 'open') ? '#CFFFBE' : '#FFDDDD';
        data.push({
          text: '#' + issue['number'] + ': ' + issue['title'].substr(0, 20),
          url: issue['html_url'],
          rows: 1,
          cols: 1,
          color: color
        });
      }
    }
    return data;
  }

  getRepoName(url) {
    const temp = url.split('/');
    return temp[5];
  }

  updateData() {
    return this.getRepos()
      .pipe(
        mergeMap( x => x ),
        filter( x => this.includedRepos.includes(x)),
        mergeMap((repo: string) => {
            const current = this.getIssuesByRepo(null, repo)
            .pipe(
              toArray(),
              map((issues: any[]) => { return { repo: repo, issues: issues }})
            );
            return current;
        }),
        toArray(),
        map(data => this.processRepos(data)),
        tap(data => {
          data.sort(this.alphaSort('name'));
          this.data$.next(data);
        })
      )
      .subscribe(
        data => data,
        error => console.error(error),
      );
  }

  alphaSort(property) {
    let sortOrder = 1;

    if (property[0] === '-') {
      sortOrder = -1;
      property = property.substr(1);
    }

    return ((a, b) => {
      if (sortOrder === -1) {
        return b[property].localeCompare(a[property]);
      } else {
        return a[property].localeCompare(b[property]);
      }
    });
  }

}
