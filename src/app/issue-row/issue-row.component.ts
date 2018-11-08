import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-issue-row',
  templateUrl: './issue-row.component.html',
  styleUrls: ['./issue-row.component.css']
})
export class IssueRowComponent implements OnInit {

  @Input() row;
  row_num;
  row_data;

  constructor() { }

  ngOnInit() {
    this.row_num = this.row['row_num'];
    this.row_data = this.row['row_data'];
  }

}
