import { TestBed } from '@angular/core/testing';

import { VersiculoService } from './versiculo.service';

describe('VersiculoService', () => {
  let service: VersiculoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VersiculoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
