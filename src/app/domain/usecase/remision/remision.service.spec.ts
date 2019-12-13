import { TestBed, inject } from '@angular/core/testing';

import { RemisionServices } from './remision.service';

describe('RemisionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RemisionServices]
    });
  });

  it('should be created', inject([RemisionServices], (service: RemisionServices) => {
    expect(service).toBeTruthy();
  }));
});
