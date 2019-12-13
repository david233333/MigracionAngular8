import {Component, OnInit, Inject, Input, OnDestroy} from '@angular/core';
import {NbMenuService, NB_WINDOW, NbSidebarService} from '@nebular/theme';
import {mensajes} from '../../utils/mensajes';
import {Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'sura-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() nombreUsuario: string;
  @Input() urlSeusCerrarSesion: string;
  public mensajes = mensajes;
  private cerrarSesionSubscripcion = new Subscription();
  items = [{title: 'Profile'}, {title: 'Logout'}];

  constructor(
    private router: Router,
    private nbMenuService: NbMenuService,
    @Inject(NB_WINDOW) private window,
    private sidebarService: NbSidebarService,
  ) {
  }

  ngOnInit() {

    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({tag}) => tag === 'my-context-menu'),
        map(({item: {title}}) => title)
      )
      .subscribe(title => this.window.alert(`${title} was clicked!`));
  }

  ngOnDestroy() {
    this.cerrarSesionSubscripcion.unsubscribe();
  }

  /**
   * Muestra y oculta la barra del menu
   */
  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  public menuPrincipal() {
    this.router.navigate(['/']);
  }

  public cerrarSesion() {
    if (this.urlSeusCerrarSesion !== '') {
      localStorage.removeItem('nombreUsuario');
      window.location.href = this.urlSeusCerrarSesion;
    }
  }
}
