import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailShippingComponent } from './detail-shipping.component';

describe('DetailShippingComponent', () => {
  let component: DetailShippingComponent;
  let fixture: ComponentFixture<DetailShippingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailShippingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailShippingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
