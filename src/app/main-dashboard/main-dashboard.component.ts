import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit {

  issues_per_row: number;
  rows: Object

  constructor() { }

  ngOnInit() {

    this.issues_per_row = 5;

    this.rows = [
      {'row_num': 1, 'row_data': [
        {'issue_id':1}, {'issue_id':2}, {'issue_id':3}, {'issue_id':4}, {'issue_id':5}
      ]},
      {'row_num': 2, 'row_data': [
        {'issue_id':6}, {'issue_id':7}, {'issue_id':8}, {'issue_id':9}, {'issue_id':10}
      ]},
      {'row_num': 3, 'row_data': [
        {'issue_id':11}, {'issue_id':12}, {'issue_id':13}, {'issue_id':14}, {'issue_id':15}
      ]},
      {'row_num': 4, 'row_data': [
        {'issue_id':16}, {'issue_id':17}, {'issue_id':18}, {'issue_id':19}, {'issue_id':20}
      ]},
    ];


  }

}
