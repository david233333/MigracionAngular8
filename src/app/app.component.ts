import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/delay';

import * as moment from 'moment';

moment.locale('es');
import {ToasterConfig} from 'angular2-toaster';
import {
  NbMediaBreakpoint,
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService
} from '@nebular/theme';

import {MensajesService} from './shared/services/mensajes.service';
import {LoginUsecaseServices} from './domain/usecase/seguridad/loginUsecase-services';
import {UsuarioService} from './shared/services/usuario.service';
import {ConfiguracionService} from '../app/shared/services/configuracion.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
  protected sidebarState: Subscription;
  protected menuClick: Subscription;
  public nombreUsuario = '';
  public urlSeusCerrarSesion = '';
  private seusBaseUrl: string;
  public configuracionToaster: ToasterConfig = this.mensajesService
    .configuracion;


  constructor(
    protected menuService: NbMenuService,
    protected themeService: NbThemeService,
    protected bpService: NbMediaBreakpointsService,
    protected sidebarService: NbSidebarService,
    private mensajesService: MensajesService,
    private seguridadService: LoginUsecaseServices,
    private usuarioService: UsuarioService,
  ) {
    this.seusBaseUrl = ConfiguracionService.config.seusBaseUrl;
    const esBp = this.bpService.getByName('is');

    this.menuClick = this.menuService
      .onItemSelect()
      .withLatestFrom(this.themeService.onMediaQueryChange())
      .delay(20)
      .subscribe(
        ([item, [bpFrom, bpTo]]: [
          any,
          [NbMediaBreakpoint, NbMediaBreakpoint]
          ]) => {
          if (bpTo.width <= esBp.width) {
            this.sidebarService.collapse('menu-sidebar');
          }
        }
      );
  }

  ngOnDestroy() {

  }

  ngOnInit(): void {
    this.cargarLogin();
    this.cargarUrlLogout();
    this.datosUsuario();
    const VALORINTERVALO = 3600000;
    setInterval(() => {
      this.cargarLogin();
    }, VALORINTERVALO);
  }

  private cargarLogin() {
    this.seguridadService.checkLogin().subscribe(
      value => {
        console.log('sistema de logue', value);
        if (value) {
        } else {
          const url = {
            url: this.seusBaseUrl
          };
          this.seguridadService.login(url);
        }
      },
      error1 => {
        console.log(error1);
      }
    );
  }

  private cargarUrlLogout() {
    this.seguridadService.cerrarSesion().subscribe(
      value => {
        this.urlSeusCerrarSesion = value;
      },
      errorUrlLogout => {
        console.log(errorUrlLogout);
      }
    );
  }

  private datosUsuario() {
    this.seguridadService.datosUsuarioLogueado().subscribe(
      usuario => {
        this.usuarioService.InfoUsuario = usuario;
        this.nombreUsuario = usuario.fullName;
        localStorage.setItem('nombreUsuario', usuario.username);
      },
      error1 => {
      },
      () => {
      }
    );
  }
}
