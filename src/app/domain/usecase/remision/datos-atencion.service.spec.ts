import { TestBed, inject } from '@angular/core/testing';

import { DatosAtencionService } from './datos-atencion.service';

describe('DatosAtencionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatosAtencionService]
    });
  });

  it('should be created', inject([DatosAtencionService], (service: DatosAtencionService) => {
    expect(service).toBeTruthy();
  }));
});
