import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject, NgZone,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Subscription} from 'rxjs/Subscription';
import {DatosAtencionService} from '../../../../domain/usecase/remision/datos-atencion.service';
import {ModalDireccionComponents} from './modal-direccion.view.model';
import {MensajesService} from '../../../../shared/services/mensajes.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RemisionServices} from '../../../../domain/usecase/remision/remision.service';
import {Router} from '@angular/router';
import {CapturarErrores} from '../../../../shared/services/capturar-errores';
import {InformesUsecase} from '../../../../domain/usecase/informes/informes-usecase';
import {ToasterConfig, ToasterService} from 'angular2-toaster';
import {ModalConfirmacionComponent} from '../../../../shared/components/modal-confirmacion/modal-confirmacion.component';
import {ModalConfirmacion} from '../../../../shared/models/modal-confirmacion.model';
import {MapsAPILoader} from '@agm/core';

@Component({
  selector: 'sura-modal-direccion',
  templateUrl: './modal-direccion.component.html',
  styleUrls: ['./modal-direccion.component.scss']
})
export class ModalDireccionComponent implements OnInit, OnChanges {
  @ViewChild('labelDireccion', { static: false }) labelDireccion: any;

  public sinNomenclatura = false;

  @ViewChild('mapaView', { static: false }) mapaView: ElementRef;

  @ViewChild('matDialog', { static: true }) matDialog: ElementRef;

  @Output()
  public cargando: EventEmitter<boolean> = new EventEmitter<boolean>();

  public tiposDeviasSuscripcion: Subscription = new Subscription();

  public direccionModalMensaje: ModalDireccionComponents = this.iniciarViewModel();

  public letraDeCruce: Subscription = new Subscription();

  public puntosCardinalesSubscription: Subscription = new Subscription();
  public respuestXY: any;
  public formulario: FormGroup;
  lat = 6.2287505;
  activarEnviar = true;
  lng = -75.5743508;
  dragLat: number;
  dragLog: number;
  barrio = 'NO DISPONIBLE';
  direccion = 'SIN NOMENCLATURA';
  zoom = 17;
  ciudad: any;
  public guardarInformacion = true;
  public esDetalle = false;
  public valor: ModalDireccionComponents;
  public config: ToasterConfig =
    new ToasterConfig({
      showCloseButton: true,
      tapToDismiss: true,
      preventDuplicates: true,
      mouseoverTimerStop: true,
      timeout: 0
    });
  private municipiosSubscripcion: Subscription = new Subscription();


  constructor(
    @Inject(MAT_DIALOG_DATA) public datos: any,
    public dialogRef: MatDialogRef<any>,
    private datosDeatencionServices: DatosAtencionService,
    private mensajeServices: MensajesService,
    private remisionServices: RemisionServices,
    private fb: FormBuilder,
    private router: Router,
    private capturaDeErroresService: CapturarErrores,
    private informeUseCase: InformesUsecase,
    private toastrService: ToasterService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {
  }

  markerDragEnd($event: any) {
    this.dragLat = $event.coords.lat;
    this.dragLog = $event.coords.lng;
    if (this.sinNomenclatura && !this.datos.esDetalle) {
      this.activarEnviar = false;
    }
  }

  ngOnInit() {
    this.inicializarFormulario();
    this.getDatas();
    this.validacionesFormulario();
    // this.sinNomenclatura = false;
    console.log('this.datos ', this.datos);
  }

  public getDatas() {
    this.getPuntosCardinales(this.datos.esNovedad);

    console.log('this.datos ', this.datos);
    this.getMunicipios(this.datos.ciudad.idCiudad, this.datos.esNovedad);
    if (this.router.url === '/remision/nueva') {
      this.recuperarUbicacion();
    } else if (this.router.url === '/remision/editar') {
      console.log(this.datos);
      if (this.datos.ubicacion !== null) {
        console.log('this.datos Gestion novedad', this.datos);
        this.lat = this.datos.ubicacion.latitud;
        this.lng = this.datos.ubicacion.longitud;
        this.activarEnviar = true;
        this.formulario.get('numero1').setValue(this.datos.ubicacion.numero1);
        this.formulario.get('tipoVia').setValue(this.datos.ubicacion.tipoVia);
        this.formulario
          .get('letraCruce1')
          .setValue(this.datos.ubicacion.letraCruce1);
        this.formulario
          .get('puntoCardinal1')
          .setValue(this.datos.ubicacion.puntoCardinal1);
        this.formulario
          .get('nroInterseccion')
          .setValue(this.datos.ubicacion.nroInterseccion);
        this.formulario
          .get('letraCruce2')
          .setValue(this.datos.ubicacion.letraCruce2);
        this.formulario
          .get('puntoCardinal2')
          .setValue(this.datos.ubicacion.puntoCardinal2);
        this.formulario.get('numero2').setValue(this.datos.ubicacion.numero2);
        this.formulario
          .get('informacionComplementaria')
          .setValue(this.datos.ubicacion.informacionComplementaria);
        this.formulario
          .get('cambioDireccion')
          .setValue(this.datos.ubicacion.sinNomenclatura);
        console.log('cambios', this.datos.ubicacion.sinNomenclatura);
        this.sinNomenclatura = this.datos.ubicacion.sinNomenclatura;
        this.formulario
          .get('direccionComplementaria')
          .setValue(this.datos.ubicacion.direccion);
      }
    } else if (
      this.datos.esNovedad !== undefined &&
      this.datos.esNovedad === true &&
      this.datos.ubicacion !== null
    ) {
      this.lat = this.datos.ubicacion.latitud;
      this.lng = this.datos.ubicacion.longitud;
      this.activarEnviar = true;
      this.formulario.get('numero1').setValue(this.datos.ubicacion.numero1);
      this.formulario.get('tipoVia').setValue(this.datos.ubicacion.tipoVia);
      this.formulario
        .get('letraCruce1')
        .setValue(this.datos.ubicacion.letraCruce1);
      this.formulario
        .get('puntoCardinal1')
        .setValue(this.datos.ubicacion.puntoCardinal1);
      this.formulario
        .get('nroInterseccion')
        .setValue(this.datos.ubicacion.nroInterseccion);
      this.formulario
        .get('letraCruce2')
        .setValue(this.datos.ubicacion.letraCruce2);
      this.formulario
        .get('puntoCardinal2')
        .setValue(this.datos.ubicacion.puntoCardinal2);
      this.formulario.get('numero2').setValue(this.datos.ubicacion.numero2);
      this.formulario
        .get('informacionComplementaria')
        .setValue(this.datos.ubicacion.informacionComplementaria);
      this.formulario
        .get('cambioDireccion')
        .setValue(this.datos.ubicacion.sinNomenclatura);
      this.sinNomenclatura = this.datos.ubicacion.sinNomenclatura;
      this.formulario
        .get('direccionComplementaria')
        .setValue(this.datos.ubicacion.direccionComplementaria);
      this.formulario
        .get('direccionComplementaria')
        .setValue(this.datos.ubicacion.direccion);
    }
  }

  public cerrarModal() {
    this.dialogRef.close();
  }

  public onDrag(event: any) {
  }

  public buscarPorNombreLugar() {

    const nombreMunicipio = this.formulario.get('municipio').value.nombre;
    const nombreLugar = this.formulario.get('direccionComplementaria').value;

    this.datosDeatencionServices.getDetallesDeLugares(nombreLugar, nombreMunicipio)
      .subscribe(res => {

        if (res.status === 'OK') {
          const resultados = res.results[0];

          const direccionYNombreDelLugar = resultados.formatted_address.split(',');

          const direccionLugar = direccionYNombreDelLugar[0];

          const localizacion = resultados.geometry.location;
          this.activarEnviar = false;
          this.lat = +localizacion.lat;
          this.lng = +localizacion.lng;
        } else {
          this.capturaDeErroresService.mapearErrores(500, 'No se encontró el lugar');
        }
      }, error => this.capturaDeErroresService.mapearErrores(error.status, error.error));

  }

  public buscarDireccion() {

    const ciudad = this.direccionModalMensaje.respuestaMunicipios.find(
      id =>
        id.idMunicipio === this.formulario.get('municipio').value.idMunicipio
    );
    this.ciudad = ciudad.nombre;

    let datos = {};
    if (!this.sinNomenclatura) {
      const direccionCompleta = this.labelDireccion.nativeElement.innerHTML;
      const nuevaCadena = direccionCompleta.split('\n').join('');
      console.log(nuevaCadena);

      datos = {
        address: nuevaCadena,
        city: ciudad.nombre
      };
    } else {
      datos = {
        address: this.formulario.get('direccionComplementaria').value,
        city: ciudad.nombre
      };
    }


    this.respuestXY = this.datosDeatencionServices
      .getXYY(datos)
      .subscribe(response => {
        if (+response.data.latitude === 0 || +response.data.longitude === 0) {
          this.activarEnviar = true;
          this.mensajeServices.mostrarMensajeError(
            'No se pudo encontrar la ubicación'
          );
        } else {
          this.activarEnviar = false;
          this.lat = +response.data.latitude;
          this.lng = +response.data.longitude;
          this.informeUseCase.consultarCoberturaRiesgo(response.data.codbar, this.ciudad).subscribe(
            resp => {
              console.log(resp);
              const dialogRefConfirmacion = this.dialog.open(
                ModalConfirmacionComponent,
                {
                  width: '30%',
                  disableClose: false,
                  data: new ModalConfirmacion(
                    'AVISO SEGURIDAD',
                    resp.mensaje
                  )
                }
              );

              dialogRefConfirmacion.afterClosed().subscribe(data => {
                console.log(data);
              });
            },
            error => {
              const dialogRefConfirmacion = this.dialog.open(
                ModalConfirmacionComponent,
                {
                  width: '30%',
                  disableClose: false,
                  data: new ModalConfirmacion(
                    'AVISO SEGURIDAD',
                    error.error
                  )
                }
              );

              dialogRefConfirmacion.afterClosed().subscribe(data => {
                console.log(data);
              });
            }
          );

          if (response.data.barrio !== '') {
            this.barrio = response.data.barrio;
            if (this.datos.ubicacion !== null) {
              this.datos.ubicacion.barrio = response.data.barrio;
              this.datos.ubicacion.direccion = response.data.dirtrad;
            }
          } else {
            if (this.datos.ubicacion !== null) {
              this.datos.ubicacion.barrio = 'NO DISPONIBLE';
            }
            this.barrio = 'NO DISPONIBLE';
          }
          this.direccion = response.data.dirtrad;
          this.matDialog.nativeElement.scrollTop = this.matDialog.nativeElement.scrollHeight;

        }
      }, error => this.capturaDeErroresService.mapearErrores(error.status, error.error));
  }


  public guardarDireccion() {
    if (this.formulario.valid) {
      if (
        this.sinNomenclatura &&
        this.dragLog === undefined &&
        this.dragLat === undefined
      ) {
        const ciudad = this.direccionModalMensaje.respuestaMunicipios.find(
          id =>
            id.idMunicipio === this.formulario.get('municipio').value.idMunicipio
        );
        this.ciudad = ciudad;
        const direccion = this.formulario.value;
        direccion.longitud = this.lng;
        direccion.ciudadPrincipal = this.datos.ciudad;
        direccion.latitud = this.lat;
        direccion.sinNomenclatura = this.sinNomenclatura;
        direccion.cambioDireccion = this.sinNomenclatura;
        (direccion.direccion =
          this.direccion || this.formulario.get('direccionComplementaria').value),
          (direccion.tipoVia = null);
        direccion.numero1 = null;
        direccion.letraCruce1 = null;
        direccion.puntoCardinal1 = null;
        direccion.nroInterseccion = null;
        direccion.letraCruce2 = null;
        direccion.puntoCardinal2 = null;
        direccion.numero2 = null;
        direccion.barrio = this.barrio;
        console.log('direccion ', direccion);
        this.dialogRef.close(direccion);
      } else if (
        this.sinNomenclatura &&
        this.dragLog !== undefined &&
        this.dragLat !== undefined
      ) {
        const ciudad = this.direccionModalMensaje.respuestaMunicipios.find(
          id =>
            id.idMunicipio === this.formulario.get('municipio').value.idMunicipio
        );
        this.ciudad = ciudad;
        const direccion = this.formulario.value;
        direccion.ciudadPrincipal = this.datos.ciudad;
        direccion.longitud = this.dragLog;
        direccion.latitud = this.dragLat;
        direccion.sinNomenclatura = this.sinNomenclatura;
        direccion.tipoVia = null;
        direccion.numero1 = null;
        direccion.letraCruce1 = null;
        direccion.puntoCardinal1 = null;
        direccion.nroInterseccion = null;
        direccion.letraCruce2 = null;
        direccion.puntoCardinal2 = null;
        direccion.numero2 = null;
        direccion.barrio = null;
        direccion.sinNomenclatura = this.sinNomenclatura;
        direccion.cambioDireccion = this.sinNomenclatura;
        (direccion.direccion =
          this.direccion || this.formulario.get('direccionComplementaria').value);
        console.log('direccion ', direccion);
        this.dialogRef.close(direccion);
      } else if (this.dragLog !== undefined && this.dragLat !== undefined) {
        const ciudad = this.direccionModalMensaje.respuestaMunicipios.find(
          id =>
            id.idMunicipio === this.formulario.get('municipio').value.idMunicipio
        );
        this.ciudad = ciudad;
        const direccion = this.formulario.value;
        direccion.ciudadPrincipal = this.datos.ciudad;
        direccion.municipio = this.ciudad || this.datos.ubicacion.municipio;
        direccion.direccion = this.direccion || this.datos.ubicacion.direccion;
        direccion.longitud = this.dragLog;
        direccion.latitud = this.dragLat;
        direccion.barrio = this.datos.ubicacion
          ? this.datos.ubicacion.barrio
          : this.barrio;
        direccion.sinNomenclatura = this.sinNomenclatura;
        console.log('direccion ', direccion);
        this.dialogRef.close(direccion);
      } else {
        const ciudad = this.direccionModalMensaje.respuestaMunicipios.find(
          id =>
            id.idMunicipio === this.formulario.get('municipio').value.idMunicipio
        );
        this.ciudad = ciudad;
        const direccion = this.formulario.value;
        direccion.municipio = this.ciudad || this.datos.ubicacion.municipio;
        direccion.direccion =
          this.direccion ||
          (this.datos.ubicacion !== null ? this.datos.ubicacion.direccion : '');
        direccion.longitud = this.lng;
        direccion.ciudadPrincipal = this.datos.ciudad;
        direccion.latitud = this.lat;
        direccion.barrio = this.datos.ubicacion
          ? this.datos.ubicacion.barrio
          : this.barrio;
        direccion.sinNomenclatura = this.sinNomenclatura;
        direccion.cambioDireccion = this.sinNomenclatura;
        console.log('direccion ', direccion);
        this.dialogRef.close(direccion);
      }
    } else {
      this.mensajeServices.mostrarMensajeError('Debes ingresar los campos requeridos');
    }
  }

  public changeDireccion($event) {
    this.sinNomenclatura = $event;

    this.formulario.get('direccionComplementaria').setValue(null);
    if (this.formulario.valid && $event) {
      this.activarEnviar = false;
    } else if (!$event) {
      this.activarEnviar = true;
    }


    this.validacionesFormulario();
  }

  public cambiarMunicipio($event) {
    console.log('cambio de evento',$event);
    if ($event !== undefined) {
      if (this.sinNomenclatura) {
        this.activarEnviar = false;
        this.lat = $event.latitud; // antes $event.value.latitud ahora $event.latitud
        this.lng = $event.longitud; // antes $event.value.longitud ahora $event.longitud
      }
    } else {
      this.activarEnviar = true;
    }
  }

  public cambioDireccion($event) {
    console.log($event);
    if (this.sinNomenclatura && $event.length > 0) {
      this.activarEnviar = false;
    } else {
      this.activarEnviar = true;
    }
  }

  public ubicarVisible(): boolean {
    /*if (!this.sinNomenclatura) {
      return true;
    } else if (
      this.sinNomenclatura &&
      (this.formulario.get('direccionComplementaria').value !== null &&
        this.formulario.get('direccionComplementaria').value !== '')
    ) {
      return true;
    } else {
      return false;
    }*/
    if (this.sinNomenclatura) {
      return false;
    } else {
      return true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes ', changes);
    this.cdRef.detectChanges();
    this.formulario.valueChanges.subscribe(
      formulario => {
        console.log(formulario);
      }
    );
  }

  private getPuntosCardinales(esNovedad: boolean) {
    this.puntosCardinalesSubscription = this.datosDeatencionServices
      .getGeoReferenciacion(esNovedad)
      .subscribe(
        response => {
          this.direccionModalMensaje.respuestaGeoReferenciacion = response;
        },
        error => {
          this.capturaDeErroresService.mapearErrores(error.status, error.error);
        },
        () => {
        }
      );
  }

  private inicializarFormulario() {
    this.formulario = this.fb.group({
      numero1: [
        {value: null, disabled: this.datos.esDetalle},
        Validators.compose([Validators.required])
      ],
      tipoVia: [
        {value: null, disabled: this.datos.esDetalle},
        Validators.compose([Validators.required])
      ],
      letraCruce1: [{value: null, disabled: this.datos.esDetalle}],
      puntoCardinal1: [{value: null, disabled: this.datos.esDetalle}],
      nroInterseccion: [
        {value: null, disabled: this.datos.esDetalle},
        Validators.compose([Validators.required])
      ],
      letraCruce2: [{value: null, disabled: this.datos.esDetalle}],
      puntoCardinal2: [{value: null, disabled: this.datos.esDetalle}],
      numero2: [
        {value: null, disabled: this.datos.esDetalle},
        Validators.compose([Validators.required])
      ],
      informacionComplementaria: [
        {value: null, disabled: this.datos.esDetalle},
        Validators.compose([])
      ],
      municipio: [
        {value: null, disabled: this.datos.esDetalle},
        Validators.compose([Validators.required])
      ],
      direccionComplementaria: [
        {value: null, disabled: this.datos.esDetalle},
        Validators.compose([])
      ],
      cambioDireccion: [
        {value: false, disabled: this.datos.esDetalle},
        Validators.compose([])
      ]
    });
  }

  private iniciarViewModel(): ModalDireccionComponents {
    return new ModalDireccionComponents(null, [], null, [], []);
  }

  /**
   * Obtiene los municipios por ciudad
   * @param {string} idCiudad
   */
  private getMunicipios(nombreCiudad: string, esNovedad: boolean): void {
    if (nombreCiudad) {
      this.municipiosSubscripcion = this.datosDeatencionServices
        .getMunicipios(nombreCiudad, esNovedad)
        .subscribe(
          response => {
            this.direccionModalMensaje.respuestaMunicipios = response;
            if (this.datos.ubicacion !== null) {
              const id = this.direccionModalMensaje.respuestaMunicipios.find(
                municipio =>
                  municipio.idMunicipio ===
                  this.datos.ubicacion.municipio.idMunicipio
              );
              this.formulario.get('municipio').setValue(id);
            }
          },
          error => {
            this.capturaDeErroresService.mapearErrores(error.status, error.error);
          },
          () => {
          }
        );
    }
  }

  private recuperarUbicacion() {
    if (this.datos.ubicacion !== null) {
      this.activarEnviar = true;
      this.formulario.get('numero1').setValue(this.datos.ubicacion.numero1);
      this.formulario.get('tipoVia').setValue(this.datos.ubicacion.tipoVia);
      this.formulario
        .get('letraCruce1')
        .setValue(this.datos.ubicacion.letraCruce1);
      this.formulario
        .get('puntoCardinal1')
        .setValue(this.datos.ubicacion.puntoCardinal1);
      this.formulario
        .get('nroInterseccion')
        .setValue(this.datos.ubicacion.nroInterseccion);
      this.formulario
        .get('letraCruce2')
        .setValue(this.datos.ubicacion.letraCruce2);
      this.formulario
        .get('puntoCardinal2')
        .setValue(this.datos.ubicacion.puntoCardinal2);
      this.formulario.get('numero2').setValue(this.datos.ubicacion.numero2);
      this.formulario
        .get('informacionComplementaria')
        .setValue(this.datos.ubicacion.informacionComplementaria);
      this.formulario
        .get('direccionComplementaria')
        .setValue(this.datos.ubicacion.direccionComplementaria);
      this.formulario
        .get('cambioDireccion')
        .setValue(this.datos.ubicacion.sinNomenclatura);
      this.lat = this.datos.ubicacion.latitud;
      this.lng = this.datos.ubicacion.longitud;
      this.changeDireccion(this.datos.ubicacion.sinNomenclatura);
    }
  }

  private validacionesFormulario() {
    if (this.sinNomenclatura) {
      this.formulario.get('numero1').clearValidators();
      this.formulario.get('numero1').setValidators(Validators.compose([]));
      this.formulario.get('numero1').updateValueAndValidity();

      this.formulario.get('tipoVia').clearValidators();
      this.formulario.get('tipoVia').setValidators(Validators.compose([]));
      this.formulario.get('tipoVia').updateValueAndValidity();

      this.formulario.get('nroInterseccion').clearValidators();
      this.formulario
        .get('nroInterseccion')
        .setValidators(Validators.compose([]));
      this.formulario.get('nroInterseccion').updateValueAndValidity();

      this.formulario.get('letraCruce2').clearValidators();
      this.formulario
        .get('letraCruce2')
        .setValidators(Validators.compose([]));
      this.formulario.get('letraCruce2').updateValueAndValidity();

      this.formulario.get('numero2').clearValidators();
      this.formulario.get('numero2').setValidators(Validators.compose([]));
      this.formulario.get('numero2').updateValueAndValidity();

      this.formulario.get('informacionComplementaria').clearValidators();
      this.formulario
        .get('informacionComplementaria')
        .setValidators(Validators.compose([Validators.required]));
      this.formulario.get('informacionComplementaria').updateValueAndValidity();
    } else if (!this.sinNomenclatura) {
      this.formulario.get('numero1').clearValidators();
      this.formulario
        .get('numero1')
        .setValidators(Validators.compose([Validators.required]));
      this.formulario.get('numero1').updateValueAndValidity();

      this.formulario.get('tipoVia').clearValidators();
      this.formulario
        .get('tipoVia')
        .setValidators(Validators.compose([Validators.required]));
      this.formulario.get('tipoVia').updateValueAndValidity();

      this.formulario.get('nroInterseccion').clearValidators();
      this.formulario
        .get('nroInterseccion')
        .setValidators(Validators.compose([Validators.required]));
      this.formulario.get('nroInterseccion').updateValueAndValidity();

      this.formulario.get('letraCruce2').clearValidators();
      this.formulario
        .get('letraCruce2')
        .setValidators(Validators.compose([]));
      this.formulario.get('letraCruce2').updateValueAndValidity();

      this.formulario.get('numero2').clearValidators();
      this.formulario
        .get('numero2')
        .setValidators(Validators.compose([Validators.required]));
      this.formulario.get('numero2').updateValueAndValidity();

      this.formulario.get('informacionComplementaria').clearValidators();
      this.formulario
        .get('informacionComplementaria')
        .setValidators(Validators.compose([]));
      this.formulario.get('informacionComplementaria').updateValueAndValidity();
    }
  }

}
