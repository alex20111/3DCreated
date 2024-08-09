import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteSearchComponent } from './quote-search.component';

describe('QuoteSearchComponent', () => {
  let component: QuoteSearchComponent;
  let fixture: ComponentFixture<QuoteSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoteSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
