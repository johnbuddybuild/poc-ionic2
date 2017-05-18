import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import {ListPage} from './list';
import {IonicModule, NavController, NavParams, Platform} from 'ionic-angular';
import {NavParamsMock, PlatformMock} from '../../../test-config/mocks-ionic';

describe('ListPage template', () => {

  let comp:    ListPage;
  let fixture: ComponentFixture<ListPage>;
  let de:      DebugElement;
  let el:      HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPage ], // declare the test component
      imports: [
        IonicModule.forRoot(ListPage)
      ],
      providers: [
        {provide: NavParams, useClass: NavParamsMock},
        NavController,
        { provide: Platform, useClass: PlatformMock}
      ]
    });

    fixture = TestBed.createComponent(ListPage);

    comp = fixture.componentInstance; // ListPage test instance

    de = fixture.debugElement.query(By.css('button'));
    el = de.nativeElement;

  });

  it('should display original title', () => {
    fixture.detectChanges();
    console.log(el);
  });
});
