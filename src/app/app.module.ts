import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {LocalStorageModule} from '@ngx-pwa/local-storage';
import {NbMenuService, NbThemeModule} from '@nebular/theme';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {AppComponent} from './app.component';
import {CustomHttpInterceptor} from './shared/services/custom-http-interceptors.service';
import {routing} from './app.routing';
import {SharedModule} from './shared/shared.module';
import {RemisionModule} from './view/remision/remision.module';
import {NovedadModule} from './view/novedad/novedad.module';
import {ToasterModule, ToasterService} from 'angular2-toaster';
import {CargandoComponent} from './shared/components/cargando/cargando.component';
import {CargandoService} from './shared/services/cargando.service';
import {LineaUnicaModule} from './view/lineaUnica/lineaUnica.module';
import {EquipoBiomedicoModule} from './view/equipoBiomedico/equipo-biomedico.module';
import {AmbulatorioModule} from './view/ambulatorio/ambulatorio.module';
import {LoginComponent} from './view/login/login.component';
import {LoginUsecaseServices} from './domain/usecase/seguridad/loginUsecase-services';
import {LoginGatewayAbstract} from './domain/model/seguridad/gateway/login-gateway.abstract';
import {LoginServices} from './infraestructure/seguridad/login-services';
import {BandejaDinamicaModule} from './view/bandejaDinamica/bandeja-dinamica.module';
import {CapturarErrores} from './shared/services/capturar-errores';
import {InformesModule} from './view/informes/informes.module';
import {MaestrosModule} from './view/maestros/maestros.module';


@NgModule({
  declarations: [
    AppComponent,
    CargandoComponent,
    LoginComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    routing,
    NbThemeModule.forRoot({name: 'default'}),
    SharedModule,
    RemisionModule,
    NovedadModule,
    ToasterModule.forRoot(),
    MatProgressBarModule,
    LocalStorageModule,
    LineaUnicaModule,
    EquipoBiomedicoModule,
    AmbulatorioModule,
    BandejaDinamicaModule,
    InformesModule,
    MaestrosModule,
    HttpClientJsonpModule
  ],
  exports: [
    CargandoComponent
  ],
  providers: [
    ToasterService,
    NbMenuService,
    LoginUsecaseServices,
    {
      provide: LoginGatewayAbstract,
      useClass: LoginServices
    },
    {provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true},
    CargandoService,
    CapturarErrores
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
