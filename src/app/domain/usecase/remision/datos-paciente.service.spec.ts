import { TestBed, inject } from '@angular/core/testing';

import { DatosPacienteService } from './datos-paciente.service';

describe('DatosPacienteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatosPacienteService]
    });
  });

  it('should be created', inject([DatosPacienteService], (service: DatosPacienteService) => {
    expect(service).toBeTruthy();
  }));
});
