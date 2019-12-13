import { TestBed, inject } from '@angular/core/testing';

import { DiagnosticosService } from './diagnosticos.service';

describe('DiagnosticosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiagnosticosService]
    });
  });

  it('should be created', inject([DiagnosticosService], (service: DiagnosticosService) => {
    expect(service).toBeTruthy();
  }));
});
