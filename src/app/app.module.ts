import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';

import { IssueBoxComponent } from './issue-box/issue-box.component';

@NgModule({
  declarations: [
    AppComponent,
    MainDashboardComponent,
    IssueBoxComponent
  ],
  imports: [
    BrowserModule
  ],
  bootstrap: [ AppComponent ],
  providers: []
})
export class AppModule { }
