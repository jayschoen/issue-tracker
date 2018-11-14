import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {

  constructor(private httpClient: HttpClient) {}

  getIssues() {
    return this.httpClient.get("https://api.github.com/repos/jayschoen/issue-tracker/issues?state=all&sort=created&direction=asc&access_token=???");
  }
}
