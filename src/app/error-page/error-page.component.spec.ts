/* ::START::LICENCE::
Copyright eQualityTime ©2018, ©2019, ©2020, ©2021, ©2022, ©2023, ©2024, ©2025
This file is part of OVFPlayer.
OVFPlayer is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
OVFPlayer is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with OVFPlayer.  If not, see <https://www.gnu.org/licenses/>.
::END::LICENCE:: */
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';

import { ErrorPageComponent } from './error-page.component';
import { OBFPageComponent } from '../obfpage/obfpage.component';
import { MatCardModule } from '@angular/material/card';
import { ErrorDetails, ErrorService } from '../services/error/error.service';
import { RouterModule } from '@angular/router';

describe('ErrorPageComponent', () => {
  let component: ErrorPageComponent;
  let fixture: ComponentFixture<ErrorPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [MatCardModule, RouterModule, ErrorPageComponent, OBFPageComponent],
    providers: [ErrorService]
})
    .compileComponents();
  }));

  beforeEach(() => {
    const errorService = TestBed.inject(ErrorService);
    const errorDetails: ErrorDetails = {"location": "test", "message": "testing", "causeChain": "none"};
    errorService.lastError = errorDetails;
    fixture = TestBed.createComponent(ErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should produce the right href for the last error', () => {
    const expectedHref = "mailto:support@equalitytime.co.uk?subject=testing&body=Location:%20test%0AMessage:%20testing%0ACause:%20none";
    expect(component.errorHRef).toBe(expectedHref);
  });
});
