import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';

import { IssueBoxComponent } from './issue-box/issue-box.component';
import { IssueRowComponent } from './issue-row/issue-row.component';

@NgModule({
  declarations: [
    AppComponent,
    MainDashboardComponent,
    IssueBoxComponent,
    IssueRowComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: []
})
export class AppModule { }
