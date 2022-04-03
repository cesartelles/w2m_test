import { TestBed } from '@angular/core/testing';

import { HeroesService } from './heroes.service';
import { CoreModule } from '@core/core.module'
describe('HeroesService', () => {
  let service: HeroesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule ]
    });
    service = TestBed.inject(HeroesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
