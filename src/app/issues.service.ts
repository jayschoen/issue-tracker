import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, expand, catchError } from 'rxjs/operators';
import { empty, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {

  // probably need to move this int the environment file
  private github_url = "https://api.github.com";

  private access_token = "";
  private owner = "";
  private organization = "";

  constructor(private httpClient: HttpClient) {
    this.getRepos();
  }

  getIssues() {
    return this.httpClient.get(`${this.github_url}/repos/${this.owner}/issue-tracker/issues?state=all&sort=created&direction=asc&per_page=100&access_token=${this.access_token}`);
  }

  getIssuesByRepo(url?, repo_name?) {
    return this.getAllPages(url, repo_name)
    .pipe(
      expand(data => data.next ? this.getAllPages(data.next) : empty()),
      map(({content}) => content),
    );
  }

  getAllPages(url?, repo_name?){
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
    return this.httpClient.get<any[]>(`${this.github_url}/orgs/${this.organization}/repos?access_token=${this.access_token}`)
      .pipe(
        map(
          repos => {
            let temp = [];
            for (let repo of repos) {
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

    let parts = header.split(',');
    var links = {};
    parts.forEach( p => {
      let section = p.split(';');
      var url = section[0].replace(/<(.*)>/, '$1').trim();
      var name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;

    }); 
    return links["next"];
  }

  retrieve_pagination_links(response){
    const nextHeader = this.parse_next_header(response.headers.get('Link'));
    return {
      content: response.body,
      next: nextHeader ? nextHeader : null
    }
    
}
}
