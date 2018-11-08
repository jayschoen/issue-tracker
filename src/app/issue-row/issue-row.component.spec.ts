import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueRowComponent } from './issue-row.component';

describe('IssueRowComponent', () => {
  let component: IssueRowComponent;
  let fixture: ComponentFixture<IssueRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
