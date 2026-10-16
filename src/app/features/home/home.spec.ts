import { TestBed } from '@angular/core/testing';
import { Home } from './home';

describe('Home', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Home] }).compileComponents();
  });

  it('should create and list feature bullets', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const items = (fixture.nativeElement as HTMLElement).querySelectorAll('li');
    expect(items.length).toBeGreaterThan(0);
  });
});
