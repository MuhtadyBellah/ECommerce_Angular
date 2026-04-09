import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaduredSideComponent } from './feadured-side.component';

describe('FeaduredSideComponent', () => {
  let component: FeaduredSideComponent;
  let fixture: ComponentFixture<FeaduredSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaduredSideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaduredSideComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
