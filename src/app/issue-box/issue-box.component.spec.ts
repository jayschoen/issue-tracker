import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueBoxComponent } from './issue-box.component';

describe('IssueBoxComponent', () => {
  let component: IssueBoxComponent;
  let fixture: ComponentFixture<IssueBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
