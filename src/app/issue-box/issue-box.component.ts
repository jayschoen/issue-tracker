import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-issue-box',
  templateUrl: './issue-box.component.html',
  styleUrls: ['./issue-box.component.css']
})
export class IssueBoxComponent implements OnInit {

  @Input() issue;

  constructor() { }

  ngOnInit() {
  }

}
