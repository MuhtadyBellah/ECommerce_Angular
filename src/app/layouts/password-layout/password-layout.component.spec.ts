import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordLayoutComponent } from './password-layout.component';

describe('PasswordLayoutComponent', () => {
  let component: PasswordLayoutComponent;
  let fixture: ComponentFixture<PasswordLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
