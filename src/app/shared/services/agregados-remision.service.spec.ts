import { TestBed, inject } from '@angular/core/testing';

import { AgregadosRemisionService } from './agregados-remision.service';

describe('AgregadosRemisionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgregadosRemisionService]
    });
  });

  it('should be created', inject([AgregadosRemisionService], (service: AgregadosRemisionService) => {
    expect(service).toBeTruthy();
  }));
});
