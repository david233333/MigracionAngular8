import { TestBed, inject } from '@angular/core/testing';

import { DatosRemisionService } from './datos-remision.service';

describe('DatosRemisionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatosRemisionService]
    });
  });

  it('should be created', inject([DatosRemisionService], (service: DatosRemisionService) => {
    expect(service).toBeTruthy();
  }));
});
