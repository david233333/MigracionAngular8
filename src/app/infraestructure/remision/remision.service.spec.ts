import {async, inject, TestBed} from '@angular/core/testing';
import {RemisionService} from './remision.service';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RemisionGatewayAbstract} from '../../domain/model/remision/gateway/remision-gateway.abstract';


describe('RemisionServices', () => {
   beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClient ],
      providers: [ {
        provide: RemisionGatewayAbstract,
        useClass: RemisionService,
      }]
    });
  });
});

xit('Crear', inject([RemisionGatewayAbstract], (services: RemisionGatewayAbstract) => {
  expect(services).toBeTruthy();
}));

it('Crear remision', async(() => {
  const services:  RemisionGatewayAbstract = TestBed.get(RemisionGatewayAbstract);
  expect(services).toBeTruthy();
  //services.generarRemision();

}) );
