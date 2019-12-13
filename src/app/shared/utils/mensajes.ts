/**
 * Retorna variable por modulo
 */
export const mensajes = {
  header: {
    titulo: 'Salud en Casa'
  },

  inicio: {
    err: {
      fueraDeServicio:
        'En este momento el sistema no se encuentra disponible por favor intente mas tarde',
      guardarRemision:
        'Ocurrio un error gaurdando la remisión vuelve a intentar de nuevo'
    },
    success: {
      guardarRemision: 'Se ha guardado la remisión correctamente',
      enviarRemision: 'La Remisión fue enviada a Admisiones exitosamente',
      admitirRemision: 'Se admitio la remisón correctamente',
      cancelarRemision: 'Se cancelo la remisión',
      noAdmitirRemision: 'No se admitio la remisión'
    }
  },

  menu: {
    inicio: 'Inicio',
    remision: 'Remisión',
    crear: 'Crear',
    listarRemision: 'Listar Remisiones',
    novedad: 'Novedad',
    lineaUnica: 'Linea Unica',
    gestionarNovedades: 'Gestionar Novedades',
    gestionarPacientes: 'Gestionar Pacientes',
    historialPlanManejo: 'Plan de manejo',
    listaLineaUnica: 'Lista',
    equiposBiomedicos: 'Equipos Biomédicos',
    historialGestionEquiposBiomedicos: 'Historial y Gestión',
    ambulatorio: 'Ambulatorio',
    bebecanguro: 'Remisiones Bebé Canguro',
    aplicacionMedicamentos: 'Remisiones de Medicamentos',
    transporte: 'Transporte',
    informeVehicular: 'Informe Vehicular',
    informeRemisiones: 'Informe Remisiones',
    bandejaDinamica: 'Bandeja Dinámica',
    historialGestionBandejaDinamica: 'Historial y Gestión',
    seguridad: 'Seguridad',
    oncor: 'Información Seguridad',
    informes: {
      title: 'Informes',
      consultaMedicamentos: 'Consulta de Medicamentos',
      estadosLogistico: 'Estados Logisticos',
      curaciones: 'Curaciones',
      egresos: 'Egresos',
      aplicacionMedicamentos: 'Apicación Medicamentos por Cuidador',
      accesosCentrales: 'Accesos Centrales',
      logisticoGestor: 'Logístico del Gestor',
    },
    maestros: 'Control Maestros'
  },

  gestionMaestros: {
    title: 'Gestión de Maestros',
    maestro: 'Maestro',
    tablaMaestros: {
      listaMaestros: {

        //Falta Implementar entity y visual

        sedesSaludEnCasa: 'SedesSaludEnCasa',
        novedadesPorTipoAdmision: 'NovedadesPorTipoAdmision',
        permisosTerceros: 'PermisosTerceros',

        //////Faltan en el back
        centroEstadiaTemporal: 'CentroEstadiaTemporal',
        motivoEgreso: 'MotivoEgreso',
        profesional: 'Profesional',
        tipoSondajeNovedades: 'TipoSondajeNovedades',
        validacionOPC: 'ValidacionOPC',
        tiposPlanParticular: 'TiposPlanParticular',
        ////////////////////

        causasLlamadaNoContestada: 'CausasLlamadaNoContestada',
        ciudad: 'Ciudad',
        diagnostico: 'Diagnostico',
        tipoSondajeIngreso: 'TipoSondajeIngreso',
        dosis: 'Dosis',
        estadoPaciente: 'EstadoPaciente',
        motivoAplicacionCuidador: 'MotivoAplicacionCuidador',
        motivoFijarCita: 'MotivoFijarCita',
        proveedor: 'Proveedor',
        tipoCuracion: 'TipoCuracion',
        tipoEquipoBiomedico: 'TipoEquipoBiomedico',
        tipoMuestra: 'TipoMuestra',
        tipoTerapia: 'TipoTerapia',
        frecuencia: 'Frecuencia',
        institucion: 'Institucion',
        medicamento: 'Medicamento',
        motivoCancelacion: 'MotivoCancelacion',
        municipio: 'Municipio',
        piso: 'Piso',
        planSalud: 'PlanSalud',
        tipoNutricion: ' TipoNutricion',
        tiposIdentificacion: 'TiposIdentificacion',
        tipoSoporteNutricional: 'TipoSoporteNutricional',
        viaAdministracion: 'ViaAdministracion',
        programa: 'Programa',
        valoraciones: 'Valoraciones'
      },
      title: 'Maestro ',
      agregar: 'Agregar ',
      accion: 'Acciones',
      totalRegistros: 'Total Registros',
      acciones: {
        editar: 'Editar',
        eliminar: 'Eliminar'
      }
    },
    lista: {
      causasLlamadaNoContestada: 'Causas de Llamada No Contestada',
      ciudad: 'Ciudad',
      diagnostico: 'Diagnóstico',
      tipoSondajeIngreso: 'Tipo de Sondaje Ingreso',
      dosis: 'Dosis',
      estadoPaciente: 'Estado del Paciente',
      motivoAplicacionCuidador: 'Motivo de Aplicacion Cuidador',
      motivoFijarCita: 'Motivo Fijar Cita',
      novedadesPorTipoAdmision: 'Novedades Por Tipo Admision',
      permisosTerceros: 'Permisos de Terceros',
      proveedor: 'Proveedor',
      tipoCuracion: 'Tipo Curacion',
      tipoEquipoBiomedico: 'Tipo EquipoBiomedico',
      tipoMuestra: 'Tipo Muestra',
      tipoTerapia: 'Tipo Terapia',
      frecuencia: 'Frecuencia',
      institucion: 'Institucion',
      medicamento: 'Medicamento',
      motivoCancelacion: 'Motivo Cancelacion',
      municipio: 'Municipio',
      piso: 'Piso',
      planSalud: 'Plan de Salud',
      tipoNutricion: ' Tipo de Nutricion',
      tiposIdentificacion: 'Tipos de Identificacion',
      tipoSoporteNutricional: 'Tipo de Soporte Nutricional',
      viaAdministracion: 'Via de Administracion',
      tiposPlanParticular: 'Tipos Plan Particular',
      programa: 'Programa',
      valoraciones: 'Valoraciones',
      centroEstadiaTemporal: 'Centro de Estadia Temporal',
      motivoEgreso: 'Motivo Egreso',
      profesional: 'Profesional',
      sedesSaludEnCasa: 'Sedes Salud En Casa',
      tipoSondajeNovedades: 'Tipo Sondaje Novedades',
      validacionOPC: 'Validacion OPC'
    },
    modal: {
      editar: 'Editar ',
      crear: 'Crear ',
      errores: {
        requerido: 'Este campo es requerido'
      },
      botones: {
        guardar: 'Guardar',
        cancelar: 'Cancelar'
      }
    }
  },

  resultadoBusqueda: {
    numeroRegistros: 'Número de registros: ',
    buscar: 'Buscar'
  },

  modalConfirmacion: {
    botones: {
      aceptar: 'Aceptar',
      cancelar: 'Cancelar'
    }
  },

  remisionContenedor: {
    pasos: {
      datosPaciente: 'Datos de paciente',
      datosAtencion: 'Datos de atención',
      diagnostico: 'Diagnóstico',
      datosRemision: 'Datos de remisión',
      planManejo: 'Plan de manejo',
      admision: 'Admisión'
    }
  },

  acciones: {
    numeroRemision: 'Número remisión:',
    estadoRemision: 'Estado remisión:',
    nombre: 'Nombre: ',
    tipoAsegurador: 'Tipo Asegurador',
    tipoAfiliacion: 'Tipo Afiliación',
    edad: 'Edad',
    sexo: 'Sexo',
    guardar: 'Guardar',
    enviar: 'Enviar',
    cancelar: 'Cancelar remisión',
    crearPaciente: 'Crear paciente',
    cargarAnexos: 'Cargar anexos',
    consultarAnexos: 'Consultar anexos',
    consentimiento: 'Consentimiento',
    imprimir: 'Imprimir',
    nombreArchivoConsentimiento: 'Consentimiento.pdf',
    errorConsentimiento: 'Ha ocurrido un error',
    errorConsentimientoFaltanDatos: 'Faltan datos por ingresar',
    errorRemisionReport: 'El numero de la remision no existe',
    nombreArchivoRemision: 'Remision.pdf',
    mensajeErrorCargarUsuario:
      'Ha ocurrido un error al guardar, favor contactar a soporte'
  },

  comunes: {
    diasSemana: {
      idLunes: '2',
      lunes: 'Lunes',
      idMartes: '3',
      martes: 'Martes',
      idMiercoles: '4',
      miercoles: 'Miercoles',
      idJueves: '5',
      jueves: 'Jueves',
      idViernes: '6',
      viernes: 'Viernes',
      idSabado: '7',
      sabado: 'Sábado',
      idDomingo: '1',
      domingo: 'Domingo'
    }
  },

  datosPaciente: {
    campos: {
      identificacion: 'Identificación',
      tipo: 'Tipo identificación',
      numero: 'Número identificación',
      edad: 'Edad',
      ocupacion: 'Ocupacion',
      email: 'Email',
      planSalud: 'Plan de salud',
      codigoAutorizacion: 'Código de autorización',
      seleccionar: 'Seleccionar',
      tipoPlanSalud: 'Tipo plan de salud',
      idTipoPlanSaludArl: '7',
      idTipoPlanSaludParticular: '3',
      si: 'Sí',
      primerNombre: 'Nombres',
      primerApellido: 'Apellidos',
      fechaNacimiento: 'Fecha Nacimiento',
      genero: 'Genero',
      no: 'No',
      segundoApellido: 'Segundo Apellido',
      formularioPaciente: 'FORMULARIO PARA LA CREACIÓN DE PARTICULARES'
    },
    botones: {
      buscar: 'Buscar',
      crear: 'Crear'
    },
    errores: {
      peso: 'Elige la medida del peso',
      numeroRequerido: 'Ingresa el número',
      tipoRequerido: 'Elige el tipo',
      planSaludRequerido: 'Elige el plan',
      numeroMaximaLongitud: 'Máximo 15 dígitos',
      numeroFormatoInvalido: 'Número inválido',
      codigoInvalido: 'Código inválido',
      codigoMaximaLongitud: 'Máximo 15 dígitos',
      tipoPlanSaludRequerido: 'Elige el tipo de plan',
      pesoRequerido: 'Ingresa el peso',
      pesoFormatoInvalido: 'Peso inválido',
      pesoMaximaLongitud: 'Máximo 7 dígitos',
      emailERrror: 'Email invalido'
    },
    informacionPaciente: {
      titulo: 'Información paciente',
      nombre: 'Nombres y apellidos',
      fechaNacimiento: 'Fecha de nacimiento',
      edad: 'Edad',
      sexo: 'Sexo',
      estadoCivil: 'Estado civil',
      ocupacion: 'Ocupación',
      email: 'Email',
      tipoAsegurador: 'Tipo de asegurador',
      estadoSuspension: 'Estado de suspensión',
      coberturaDomiciliaria: '¿Cobertura hospitalización domiciliaria?',
      fechaLimiteCobertura: 'Fecha límite de cobertura',
      tipoAfiliacion: 'Tipo de afiliación',
      nivelIngreso: 'Nivel de ingreso',
      ipsBasicaAsignada: 'IPS básica asignada',
      lugarAtencion: 'Lugar de atención',
      codigoARL: 'Código de Autorización',
    },
    bebeCanguro: {
      campos: {
        fechaNacimiento: 'Fecha de nacimiento',
        pesoNacimiento: 'Peso de nacimiento',
        edadGestacional: 'Edad gestacional al nacimiento *',
        pesoAlta: 'Peso al alta',
        semanas: 'Semanas',
        dias: 'Días',
        cantidad: 'Cantidad',
        gramos: 'gr'
      },
      errores: {
        fechaNacimientoRequerido: 'Ingresa la fecha',
        pesoNacimientoRequerido: 'Ingrese peso de nacimiento',
        pesoNacimientoInvalido: 'Peso de nacimiento inválido',
        pesoNacimientoMinimoValor: 'Peso mínimo de 800 gramos',
        edadGestacionalSemanasRequerido: 'Ingrese las semanas',
        edadGestacionalSemanasInvalido: 'Cantidad inválida',
        edadGestacionalSemanasMinimoValor: 'Mínimo 28 semanas',
        edadGestacionalSemanasMaximoValor: 'Máximo 41 semanas',
        edadGestacionalDiasRequerido: 'Ingrese los días',
        edadGestacionalDiasInvalido: 'Cantidad inválida',
        edadGestacionalDiasMinimoValor: 'Mínimo 0 días',
        edadGestacionalDiasMaximoValor: 'Máximo 6 días',
        pesoAltaRequerido: 'Ingrese el peso al alta',
        pesoAltaInvalido: 'Peso al alta inválido',
        pesoAltaMinimoValor: 'Peso mínimo de 1000 gramos'
      },
      tabla: {
        fechaNacimientoCampo: 'fechaNacimiento',
        fechaNacimiento: 'Fecha nacimiento',
        pesoNacimientoCampo: 'pesoNacimiento',
        pesoNacimiento: 'Peso nacimiento',
        edadGestacionalSemanasCampo: 'edadGestacionalSemanas',
        edadGestacionalSemanas: 'Semanas de gestación',
        edadGestacionalDiasCampo: 'edadGestacionalDias',
        edadGestacionalDias: 'Días de gestación',
        pesoAltaCampo: 'pesoAlta',
        pesoAlta: 'Peso al alta',
        accion: 'Acción',
        editar: 'Editar',
        eliminar: 'Eliminar',
        noBebeCanguro: 'No se han agregado valoraciones de bebé canguro'
      },
      opcionesMenu: {
        bebeCanguro: 'Bebé canguro'
      },
      titulos: {
        agregarEditarBebeCanguro: 'Agregar / Editar Bebé canguro',
        tituloEliminarBebeCanguro: 'Eliminar bebé canguro',
        contenidoEliminarBebeCanguro:
          '¿Está seguro de eliminar el bebé canguro?'
      },
      botones: {
        cancelar: 'Cancelar',
        guardar: 'Guardar',
        bebeCanguro: 'Bebé canguro'
      }
    }
  },

  datosAtencion: {
    campos: {
      seleccionar: 'Seleccionar',
      condicionesIngreso: 'Condiciones de ingreso',
      condicionPacienteAcepta:
        '¿El paciente acepta voluntariamente la atención por Salud en Casa? *',
      condicionServicios:
        '¿Cuenta con agua potable, luz eléctrica, nevera y baño? *',
      servicioOxigenoAmbulatorio: 'Remisión Ambulatoria de Oxígeno',
      si: 'Sí',
      no: 'No',
      ciudadPrincipal: 'Ciudad principal',
      municipio: 'Municipio',
      barrio: 'Barrio',
      direccion: 'Dirección atención',
      nombreCuidador: 'Nombre cuidador',
      nombreResponsable: 'Nombre responsable',
      telefonoPaciente: 'Teléfono paciente',
      telefonoPacienteRequerido: 'Teléfono paciente *',
      celularPaciente: 'Celular 1',
      celularPaciente2: 'Celular 2',
      celularPacienteRequerido: 'Celular paciente *',
      agregarDireccion: 'Agregar dirección'
    },
    errores: {
      condicionPacienteAceptaRequerida: 'Seleccione una opción',
      condicionServicioRequerida: 'Seleccione una opción',
      ciudadPrincipalRequerida: 'Elige la ciudad',
      barrioRequerido: 'Elige el barrio',
      direccionRequerida: 'Ingresa la dirección',
      direccionMaxLength: 'La dirección superó el número máximo de caracteres',
      nombreCuidadorRequerido: 'Ingresa el cuidador',
      nombreCuidadorMaximaLongitud: 'Máximo 50 caracteres',
      nombreResponsableRequerido: 'Ingresa el responsable',
      nombreResponsableMaximaLongitud: 'Máximo 50 caracteres',
      telefonoRequerido: 'Ingresa el teléfono',
      telefonoMaximaLongitud: 'Máximo 7 dígitos',
      telefonoInvalido: 'Teléfono inválido',
      celularRequerido: 'Ingresa el celular',
      celularMaximaLongitud: 'Máximo 10 dígitos',
      celularMinimaLongitud: 'Deben ser 10 dígitos',
      celularInvalido: 'Celular inválido'
    },
    modalPacienteAcepta: {
      campos: {
        titulo: 'Paciente no acepta atención',
        contenido:
          'El paciente no puede ser atendido por Salud en Casa. ¿Desea continuar y cerrar la remisión?'
      },
      botones: {
        continuar: 'Continuar',
        cancelar: 'Cancelar'
      }
    },
    modalDireccion: {
      campos: {
        ingresarDireccion: 'Ingresar dirección',
        direccion: 'Dirección',
        nombreLugar: 'Nombre de la ubicación',
        tipoDeVia: 'Tipo de via',
        informacion: 'Información complementaria',
        descripcion: 'Ej:urbanización, apartamento',
        seleccionar: 'Seleccionar',
        municipio: 'Municipio'
      },
      errores: {
        via: 'Seleccione una vía',
        numerovia: 'Ingresa un numero de calle',
        municipioRequerido: 'Elige el municipio'
      }
    }
  },

  diagnosticos: {
    campos: {
      diagnostico: 'Diagnóstico por el que se remite',
      buscar: 'Buscar por código o nombre',
      eliminar: 'Eliminar'
    },
    errores: {},
    tabla: {
      codigoCampo: 'codigo',
      codigo: 'Código',
      nombreCampo: 'nombre',
      nombre: 'Nombre',
      accion: 'Acción',
      eliminar: 'Eliminar',
      noDiagnosticos: 'No se han agregado diagnósticos',
      totalRegistros: 'Total registros: '
    }
  },

  datosRemision: {
    campos: {
      institucion: 'Institución que remite',
      telefono: 'Teléfono de contacto',
      identificacionMedico: 'Identificación médico *',
      tipoDocumentoMedico: 'Tipo',
      numeroDocumentoMedico: 'Número',
      nombreMedico: 'Nombre médico',
      especialidadMedico: 'Especialidad médico',
      emailContacto: 'Email de contacto',
      resumenHistoriaClinica: 'Resumen historia clínica',
      observaciones: 'Observaciones',
      seleccionar: 'Seleccionar',
      buscarProfesional: 'Buscar profesional',
      peso: 'Peso',
      medidaDePeso: 'Medidas'
    },
    errores: {
      institucionRequerida: 'Seleccione la institución',
      historiaClinica: 'Historia clinica requerida',
      telefonoRequerido: 'Ingresa el teléfono',
      telefonoMaximaLongitud: 'Máxima longitud 10 dígitos',
      telefonoInvalido: 'Teléfono inválido',
      tipoDocumentoMedicoRequerido: 'Seleccione el tipo',
      numeroDocumentoMedicoRequerido: 'Ingresa el número',
      numeroDocumentoMedicoMaximaLongitud: 'Máxima longitud 20 dígitos',
      numeroDocumentoMedicoInvalido: 'Número inválido',
      nombreMedicoRequerido: 'Ingresa el nombre',
      nombreMedicoMaximaLongitud: 'Máximo 50 caracteres',
      especialidadMedicoMaximaLongitud: 'Máximo 50 caracteres',
      emailContactoRequerido: 'Ingresa el email',
      emailContactoMaximaLongitud: 'Máxima longitud 50 caracteres',
      emailContactoInvalido: 'Email inválido',

      pesoRequerido: 'Ingresa el peso',
      pesoFormatoInvalido: 'Peso inválido',
      medidaPesoRequerido: 'selecciona la medida'
    },
    modalRemisionCancela: {
      campos: {
        titulo: 'Cancelar remisión',
        contenido: '¿Desea continuar y cancelar la remisión?',
        motivoCancelacion: 'Motivo de cancelación',
        observaciones: 'Observaciones'
      },
      botones: {
        continuar: 'Continuar',
        cancelar: 'Cancelar'
      },
      errores: {
        motivoCancelacionRequerido: 'Elige el motivo',
        numeroMaximaLongitud: 'Máximo 4000 dígitos',
        mensajeErrorCargarUsuario:
          'Ha ocurrido un error al cancelar, favor contactar a soporte'
      }
    }
  },
  admisiones: {
    campos: {
      fechaAdmision: 'Fecha de admisión',
      usuarioResponsable: 'Usuario responsable:',
      empalme: 'Empalme',
      fechaEmpalme: 'Fecha de empalme:',
      tipoAtencion: 'Tipo de atención: *',
      tipoAtencionAmbulatoria: 'Ambulatorio',
      tipoAtencionDomiciliario: 'Domiciliario',
      entregadoA: 'Entregado a: *',
      seleccionar: 'Seleccionar',
      piso: 'Piso: *',
      sede: 'Sede: *',
      programa: 'Programa: *',
      gestionAdmision: 'Gestión de la admisión:',
      estadiaTemporal:
        'El paciente requiere y acepta ser atendido en el Centro de Estadia Temporal (CET)',
      idSedeClinicaHeridas: '18'
    },
    botones: {
      admitir: 'Admitir',
      empalme: 'Empalme'
    },
    errores: {
      fechaEmpalme: 'Seleccione una fecha para el Empalme',
      tipoAtencion: 'Seleccione un tipo de atención',
      pisoAmbulatorio: 'Seleccione un piso',
      sede: 'Seleccione una sede',
      pisoDomiciliario: 'Seleccione un piso',
      programa: 'Seleccione un programa',
      mensajeErrorCargarUsuario:
        'Ha ocurrido un error al admitir, favor contactar a soporte'
    },
    modalCentroEstadia: {
      campos: {
        titulo: 'Centro de estadia temporal',
        contenido:
          'Si selecciona un centro de estadia personal cambiaran los datos de atención del paciente',
        seleccione: 'SELECCIONAR'
      },
      botones: {
        continuar: 'Continuar',
        cancelar: 'Cancelar'
      },
      error: {
        errorAceptar: 'Debes seleccionar un centro de estadia temporal'
      }
    }
  },

  listaRemision: {
    campos: {
      tipoDocumento: 'Tipo documento',
      identificacion: 'Identificación',
      remision: 'Remisión',
      institucionRemitente: 'Institución remitente',
      planSalud: 'Plan de salud',
      estado: 'Estado',
      ciudadPrincipal: 'Ciudad principal',
      tipoAtencion: 'Tipo atención'
    },
    errores: {
      tipoDocumentoRequerido: 'Elige el documento',
      numeroMaximaLongitud: 'Máximo 15 dígitos',
      numeroFormatoInvalido: 'Número inválido'
    },
    botones: {
      buscar: 'Buscar',
      limpiar: 'Limpiar'
    },
    tabla: {
      idRemision: 'idRemision',
      numeroRemisionCampo: 'idRemision',
      numeroRemision: 'Numero remisión',
      fechaRemisionCampo: 'fechaRemision',
      fechaRemision: 'Fecha remisión',
      nombrePacienteCampo: 'nombrePaciente',
      nombrePaciente: 'Paciente',
      planSaludCampo: 'planSalud',
      planSalud: 'Plan',
      estadoRemisionCampo: 'estadoRemision',
      estadoRemision: 'Estado',
      usuarioModificaCampo: 'usuario',
      usuarioModifica: 'Usuario',
      accion: 'Acción',
      eliminar: 'Eliminar',
      editar: 'Editar',
      noRemisiones: 'No se han agregado remisiones',
      totalRegistros: 'Total registros: '
    }
  },

  planManejo: {
    campos: {
      tratamientos: 'Tratamientos',
      procedimientos: 'Procedimientos',
      valoraciones: 'Valoraciones',
      valoracionBebeCanguro: 'Bebé canguro',
      pacientePICC: 'Paciente con PICC CVC',
      curaciones: 'Curaciones',
      sondajes: 'Sondajes',
      fototerapias: 'Fototerapias',
      tomaMuestras: 'Toma de muestras',
      secreciones: 'Secreciones',
      soporteNutricional: 'Soporte nutricional'
    },
    botones: {
      agregarValoraciones: 'Agregar valoraciones'
    },
    tabla: {
      id: 'id',
      medicamentoCampo: 'medicamentoDescripcion',
      medicamento: 'Medicamento',
      dosisCampo: 'cantidadDosis',
      dosis: 'Cantidad',
      viaAdministracionCampo: 'viaAdministracion',
      viaAdministracion: 'Via administración',
      tipoNutricionCampo: 'tipoNutricionDescripcion',
      tipoNutricion: 'Tipo nutrición',
      nutricionCampo: 'nutricionDescripcion',
      nutricion: 'Nutrición',
      frecuenciaCampo: 'frecuenciaDescripcion',
      frecuencia: 'Frecuencia',
      duracionCampo: 'duracion',
      duracion: 'Duración',
      ultimaAplicacionCampo: 'ultimaAplicacion',
      ultimaAplicacion: 'Última aplicacion',
      noPBSCampo: 'noPBS',
      noPBS: 'No PBS',
      esUltimaAplicacionCampo: 'esUltimaAplicacion',
      esUltimaAplicacion: '¿Última Aplicacion?',
      dosisFaltantesCampo: 'dosisFaltantes',
      dosisFaltantes: 'Dosis faltantes',
      accion: 'Acciones',
      eliminar: 'Eliminar',
      editar: 'Editar',
      noTratamientos: 'El paciente no tiene tratamientos',
      noProfesional: 'El profesionales Asiganados',
      noCuraciones: 'El paciente no tiene curaciones',
      noSondajes: 'El paciente no tiene sondajes',
      noFototerapias: 'El paciente no tiene fototerapias',
      tituloEliminarTratamiento: 'Eliminar tratamiento',
      contenidoEliminarTratamiento: '¿Está seguro de eliminar el tratamiento?',
      tituloEliminarProcedimiento: 'Eliminar procedimiento',
      contenidoEliminarProcedimiento:
        '¿Está seguro de eliminar el procedimiento?',
      totalRegistros: 'Total registros: '
    },
    mensajesValidacion: {
      agregarValoraciones:
        'Se han agregado las valoraciones correctamente, recuerde guardar los cambios en el FUR'
    },

    tratamientos: {
      campos: {
        medicamento: 'Medicamento',
        medicamentoCodigo: 'Código',
        medicamentoNombre: 'Nombre',
        medicamentoBuscar: 'Buscar por código o nombre',
        dosis: 'Cantidad',
        dosisUnidades: 'Unidades',
        viaAdministracion: 'Via administración',
        viaAdministracionSeleccionar: 'Seleccionar',
        frecuencia: 'Frecuencia',
        frecuenciaSeleccionar: 'Seleccionar',
        duracion: 'Duración',
        duracionCantidad: 'Cantidad',
        duracionDosis: 'Dosis',
        duracionDosisOxigeno: 'Días',
        tieneUltimaAplicacion: '¿Tiene última aplicación?',
        ultimaAplicacion: 'Última aplicación',
        noPBS: 'No PBS',
        diluyente: 'Diluyente',
        diluyenteTitulo: 'Diluyente *:',
        diluyenteSolucionSalina: 'Solución salina 0.9%',
        diluyenteOtro: 'Otro',
        diluyenteCantidad: 'Cantidad',
        ml: 'm.l',
        requiereEquipo: '¿Requiere equipo?',
        fechaFinTratamiento: 'Fecha fin tratamiento: ',
        tipoNutricion: 'Tipo de nutrición'
      },
      errores: {
        codigoMedicamentoMaximaLongitud: 'Máxima longitud 10 dígitos',
        codigoMedicamentoInvalido: 'Código inválido',
        medicamentoMaximaLongitud: 'Máxima longitud 10 dígitos',
        medicamentoInvalido: 'Medicamento inválido',
        medicamentoRequerido: 'Ingresa el código o nombre del medicamento',
        dosisCantidadRequerido: 'Ingresa la cantidad',
        dosisCantidadMaximaLongitud: 'Cantidad inválida',
        dosisCantidadInvalido: 'Cantidad inválida',
        dosisUnidadesRequerido: 'Seleccione unidad de dosis',
        viaAdministracionRequerido: 'Seleccione vía administración',
        frecuenciaRequerido: 'Seleccione frecuencia',
        duracionRequerido: 'Ingresa la duración',
        duracionInvalido: 'Duración inválida',
        duracionMin: 'Duración minima de 1 dosis',
        duracionMax: 'Duración máxima de 999 dosis',
        diluyenteRequerido: 'Ingrese diluyente',
        diluyenteOpcionRequerido: 'Seleccione una opción',
        diluyenteCantidadRequerido: 'Ingresa la cantidad',
        diluyenteCantidadMaximaLongitud: 'Cantidad inválida',
        diluyenteCantidadInvalido: 'Cantidad inválida',
        codigoOxigenoMaximaLongitud: 'Máxima longitud 10 dígitos',
        codigoOxigenoInvalido: 'Código inválido',
        oxigenoMaximaLongitud: 'Máxima longitud 10 dígitos',
        oxigenoInvalido: 'Oxigeno inválido',
        oxigenoRequerido: 'Ingresa el código o nombre del medicamento',
        fechaUltimaAplicacionRequerido: 'Ingrese fecha de última aplicación',
        tipoNutricionRequerido: 'Seleccione tipo nutrición',
        nutricionOpcionRequerido: 'Seleccione una opción'
      },
      opcionesMenu: {
        medicamentos: 'Medicamentos',
        nebulizaciones: 'Nebulizaciones',
        oxigenoterapia: 'Oxigenoterapia',
        soporteNutricional: 'Soporte nutricional'
      },
      tituloVentana: {
        agregarEditarMedicamentos: 'Agregar / Editar Medicamentos',
        agregarEditarNebulizaciones: 'Agregar / Editar Nebulizaciones',
        agregarEditarOxigeno: 'Agregar / Editar Oxigeno',
        agregarEditarSoporteNutricional: 'Agregar / Editar Soporte Nutricional'
      },
      botones: {
        cancelar: 'Cancelar',
        guardar: 'Guardar',
        agregar: 'Agregar',
        editar: 'Editar'
      },
      urls: {
        urlNoPBS:
          'https://tablas.sispro.gov.co/MIPRESNOPBS/Login.aspx?ReturnUrl=%2fMIPRESNOPBS%2f'
      }
    },

    procedimientos: {
      curaciones: {
        campos: {
          descripcion: 'Descripción',
          ultimaCuracion: 'Última curación'
        },
        errores: {
          descripcionRequerido: 'Ingresa la descripcion',
          descripcionMaximaLongitud: 'Cantidad inválida',
          ultimaCuracionRequerido: 'Ingrese la fecha'
        },
        tabla: {
          tipoCuracionCampo: 'Herida mayor',
          tipoCuracion: 'Tipo de curación',
          descripcionCampo: 'descripcion',
          descripcion: 'Descripción',
          ultimaCuracionCampo: 'ultimaCuracion',
          ultimaCuracion: 'Última curación',
          accion: 'Acción',
          editar: 'Editar',
          eliminar: 'Eliminar',
          noCuraciones: 'No se han agregado curaciones',
          totalRegistros: 'Total registros: '
        }
      },
      sondajes: {
        campos: {
          tipoSondajeIngreso: 'Tipo de sondaje',
          tipoSondajeNovedades: 'Tipo de sondaje',
          tipoDeSondaje: 'Tipo de sondaje',
          tomaMuestra: 'Toma de muestra',
          alimentacion: 'Alimentación',
          evacuacion: 'Evacuación',
          drenaje: 'Drenaje',
          requiereAyuno: 'Requiere ayuno'
        },
        errores: {
          sondajeRequerido: 'Seleccione sondaje',
          sondajesRequeridos: 'Seleccione al menos un sondaje',
          sondajeInvalido: 'El sondaje seleccionado ya se encuentra listado',
          drenajeRequerido: 'Seleccione drenaje'
        },
        tabla: {
          tipoSondajeCampo: 'sondaje',
          tipoSondajeIngreso: 'Tipo sondaje',
          tipoSondajeNovedades: 'Tipo sondaje',
          categoriaSondajeCampo: 'idTipoSondaje',
          categoriaSondaje: 'Categoría',
          accion: 'Acción',
          editar: 'Editar',
          eliminar: 'Eliminar',
          noSondajes: 'No se han agregado sondajes',
          totalRegistros: 'Total registros: '
        },
        tipos: {
          drenaje: 'DRENAJE',
          alimentacion: 'ALIMENTACION',
          tomaMuestra: 'TOMAMUESTRA',
          evacuacion: 'EVACUACION'
        }
      },

      fototerapias: {
        campos: {
          diasTratamiento: 'Días de tratamiento',
          bilirrubinaTotal: 'Bilirrubina total',
          ultimaTomaMuestra: 'Última toma de muestra',
          tipoFrecuencia: 'Tipos frecuencia'
        },
        errores: {
          diasTratamientoRequerido: 'Ingrese días de tratamiento',
          diasTratamientoMinimoValor: 'Minimo 1 día de tratamiento',
          diasTratamientoMaximoValor: 'Máximo 7 días de tratamiento',
          diasTratamientoInvalido: 'Días de tratamiento inválido',
          bilirrubinaTotalRequerido: 'Ingrese bilirrubina total',
          bilirrubinaTotalMinimoValor: 'Minimo 0.00 de bilirrubina total',
          bilirrubinaTotalMaximoValor: 'Máximo 20.99 de bilirrubina total',
          bilirrubinaTotalInvalido: 'Bilirrubina total inválido',
          ultimaTomaMuestraRequerido: 'Ingrese la fecha',
          tipoFrecuenciaRequerido: 'Seleccione el tipo de frecuencia'
        },
        tabla: {
          diasTratamientoCampo: 'diasTratamiento',
          diasTratamiento: 'Días de tratamiento',
          bilirrubinaTotalCampo: 'bilirrubinaTotal',
          bilirrubinaTotal: 'Bilirrubina total',
          ultimaTomaMuestraCampo: 'ultimaTomaMuestra',
          ultimaTomaMuestra: 'Última toma de muestra',
          tipoFrecuenciaCampo: 'tipoFrecuencia',
          tipoFrecuencia: 'Tipo frecuencia',
          accion: 'Acción',
          editar: 'Editar',
          eliminar: 'Eliminar',
          noFototerapias: 'No se han agregado fototerapias',
          totalRegistros: 'Total registros: '
        },
        textoFototerapia: 'FOTOTERAPIA'
      },

      secreciones: {
        campos: {
          diasTratamiento: 'Días de tratamiento',
          envioAspirador: 'Envío de aspirador',
          visitaEnfermeria: 'Visita de enfermería',
          tipoSonda: '¿Tipo de sonda? *',
          pediatrica: 'Pediatrica',
          adulto: 'Adulto',
          via: 'Via',
          nasal: 'Nasal',
          traqueostomia: 'Traqueostomía'
        },
        errores: {
          diasTratamientoRequerido: 'Ingrese días de tratamiento',
          diasTratamientoMinimoValor: 'Minimo 1 día de tratamiento',
          diasTratamientoMaximoValor: 'Máximo 30 días de tratamiento',
          diasTratamientoInvalido: 'Días de tratamiento inválido',
          tipoSondaRequerido: 'Seleccione el tipo de sonda'
        },
        tabla: {
          diasTratamientoCampo: 'diasTratamiento',
          diasTratamiento: 'Días de tratamiento',
          envioAspiradorCampo: 'envioAspirador',
          envioAspirador: 'Envío de aspirador',
          visitaEnfermeriaCampo: 'visitaEnfermeria',
          visitaEnfermeria: 'Visita de enfermería',
          tipoSondaCampo: 'tipoSonda',
          tipoSonda: 'Tipo de sonda',
          nasalCampo: 'nasal',
          nasal: 'Nasal',
          traqueostomiaCampo: 'traqueostomia',
          traqueostomia: 'Traqueostomía',
          accion: 'Acción',
          editar: 'Editar',
          eliminar: 'Eliminar',
          noSecreciones: 'No se han agregado aspiraciones de secreciones',
          totalRegistros: 'Total registros: '
        }
      },

      soporteNutricional: {
        campos: {
          medicamento: 'Medicamento',
          medicamentoCodigo: 'Código',
          medicamentoNombre: 'Nombre',
          medicamentoBuscar: 'Buscar por código o nombre',
          dosis: 'Cantidad',
          dosisUnidades: 'Unidades',
          tipoNutricion: 'Tipo nutrición',
          nutricion: 'Nutrición',
          frecuencia: 'Frecuencia',
          frecuenciaSeleccionar: 'Seleccionar',
          duracion: 'Tiempo infusión',
          duracionCantidad: 'Cantidad',
          duracionDosis: 'Dosis',
          noPBS: 'No PBS',
          diasTratamiento: 'Días tratamiento',
          volumen: 'Volumen (gr)',
          diasEvento: 'Dias',
          horaEvento: 'Hora'
        },
        errores: {
          codigoMedicamentoMaximaLongitud: 'Máxima longitud 10 dígitos',
          codigoMedicamentoInvalido: 'Código inválido',
          medicamentoMaximaLongitud: 'Máxima longitud 10 dígitos',
          medicamentoInvalido: 'Medicamento inválido',
          medicamentoRequerido: 'Ingresa el código o nombre del medicamento',
          dosisCantidadRequerido: 'Ingresa la cantidad',
          dosisCantidadMaximaLongitud: 'Cantidad inválida',
          dosisCantidadInvalido: 'Cantidad inválida',
          dosisUnidadesRequerido: 'Seleccione unidades',
          viaAdministracionRequerido: 'Seleccione vía administración',
          frecuenciaRequerido: 'Seleccione frecuencia',
          duracionRequerido: 'Ingrese el tiempo',
          duracionInvalido: 'Tiempo inválido',
          duracionMin: 'Tiempo minimo de 1',
          duracionMax: 'Tiempo máximo de 999',
          diasTratamientoRequerido: 'Ingresa la cantidad',
          diasTratamientoInvalido: 'Cantidad inválida',
          diasTratamientoMin: 'Minimo 1 día',
          diasTratamientoMax: 'Máximo 99 días',
          volumenRequerido: 'Ingresa la cantidad',
          volumenInvalido: 'Volumen inválido',
          volumenMin: 'Minimo 1 gr',
          volumenMax: 'Máximo 9000 gr',
          diluyenteRequerido: 'Ingrese diluyente',
          diluyenteOpcionRequerido: 'Seleccione una opción',
          diluyenteCantidadRequerido: 'Ingresa la cantidad',
          diluyenteCantidadMaximaLongitud: 'Cantidad inválida',
          diluyenteCantidadInvalido: 'Cantidad inválida',
          codigoOxigenoMaximaLongitud: 'Máxima longitud 10 dígitos',
          codigoOxigenoInvalido: 'Código inválido',
          oxigenoMaximaLongitud: 'Máxima longitud 10 dígitos',
          oxigenoInvalido: 'Oxigeno inválido',
          oxigenoRequerido: 'Ingresa el código o nombre del medicamento',
          fechaUltimaAplicacionRequerido: 'Ingrese fecha de última aplicación',
          tipoNutricionRequerido: 'Seleccione tipo nutrición',
          nutricionRequerido: 'Seleccione nutrición',
          diasEventoRequerido: 'Seleccione el día',
          horaEventoRequerido: 'Seleccione la hora',
          tipoEventoRequerido: 'Seleccione el tipo',
          eventoRequerido: 'Agrega al menos un evento'
        },
        tabla: {
          id: 'id',
          medicamentoCampo: 'medicamentoDescripcion',
          medicamento: 'Medicamento',
          dosisCampo: 'cantidadDosis',
          dosis: 'Cantidad',
          tipoNutricionCampo: 'tipoNutricionDescripcion',
          tipoNutricion: 'Tipo nutrición',
          nutricionCampo: 'nutricionDescripcion',
          nutricion: 'Nutrición',
          frecuenciaCampo: 'frecuenciaDescripcion',
          frecuencia: 'Frecuencia',
          duracionCampo: 'duracion',
          duracion: 'Duración',
          noPBSCampo: 'noPBS',
          noPBS: 'No PBS',
          diasCampo: 'diasEvento',
          dias: 'Días',
          horaCampo: 'frecuenciaDescripcion',
          hora: 'Hora',
          eventoCampo: 'eventoDescripcion',
          evento: 'Evento',
          diasTratamientoCampo: 'diasTratamiento',
          diasTratamiento: 'Días tratamiento',
          accion: 'Acciones',
          eliminar: 'Eliminar',
          editar: 'Editar',
          noSoporteNutricional: 'El paciente no tiene soporte nutricional',
          noEventos: 'No se han agregado eventos',
          totalRegistros: 'Total registros: '
        },
        tiposNutricion: {
          enteral: 'Enteral',
          parenteral: 'Parenteral'
        }
      },

      opcionesMenu: {
        curaciones: 'Curaciones',
        sondajes: 'Sondajes',
        fototerapias: 'Fototerapias',
        secreciones: 'Secreciones',
        soporteNutricional: 'Soporte nutricional'
      },
      tituloVentana: {
        agregarEditarCuraciones: 'Agregar / Editar Curaciones',
        agregarEditarSondajes: 'Agregar / Editar Sondajes',
        agregarEditarFototerapias: 'Agregar / Editar Fototerapias',
        agregarEditarAspiracionSecreciones:
          'Agregar / Editar Aspiración de secreciones',
        agregarEditarSoporteNutricional: 'Agregar / Editar Soporte nutricional'
      },
      botones: {
        cancelar: 'Cancelar',
        guardar: 'Guardar',
        agregar: 'Agregar',
        editar: 'Editar'
      },
      urls: {
        urlNoPBS:
          'https://tablas.sispro.gov.co/MIPRESNOPBS/Login.aspx?ReturnUrl=%2fMIPRESNOPBS%2f'
      }
    },

    valoraciones: {
      tipos: {
        poliza: 'poliza',
        ingresoPolizaVida: 'Ingreso Póliza de Vida'
      },
      identificadores: {
        ingresoPolizaVida: '4',
        fonoaudiologiaCanguro: '24',
        enfermeriaCanguro: '9',
        examenMedico: '11'
      },
      campos: {
        fechaExamenMedico: 'Fecha examen'
      },
      validaciones: {
        valoracionesTipoPoliza:
          'Seleccione al menos una valoración del tipo Ingreso póliza de vida',
        fechaExamenMedicoRequerido: 'Seleccione fecha'
      },
      botones: {
        cancelar: 'Cancelar',
        guardar: 'Guardar'
      }
    }
  },

  valoracionesPlanManejo: {
    tipos: {
      poliza: 'poliza',
      ingresoPolizaVida: 'Ingreso Póliza de Vida'
    },
    botones: {
      agregarValoraciones: 'Agregar valoraciones'
    }
  },

  novedades: {
    inicioNovedad: {
      campos: {
        tipoDocumentoPaciente: 'Tipo identificación',
        numeroDocumentoPaciente: 'Número identificación',
        remisionPaciente: 'Remisión',
        textoRemision: 'Remisión: ',
        textoPaciente: 'Paciente: '
      },
      errores: {
        tipoDocumentoPacienteRequerido: 'Seleccione el tipo',
        numeroDocumentoPacienteRequerido: 'Ingresa el número',
        numeroDocumentoPacienteMaximaLongitud: 'Máxima longitud 20 dígitos',
        numeroDocumentoPacienteInvalido: 'Número inválido',
        remisionPacienteRequerido: 'Ingresa el número de remisón',
        remisionPacienteMaximaLongitud: 'Máxima longitud 15 dígitos',
        remisionPacienteInvalido: 'Número inválido'
      },
      botones: {
        buscarPaciente: 'Buscar paciente',
        volverAtras: 'Volver atrás'
      },
      opcionesMenu: {
        principal: 'Principal',
        cancelaVisita: 'Cancela Visita',
        egreso: 'Egreso',
        infoPaciente: 'Info. Paciente',
        tratamientoProcedimiento: 'Tratamientos y procedimientos',
        cita: 'Citas',
        aplicacionesCuidador: 'Aplicaciones por cuidador',
        alertasVisitas: 'Alertas en visita',
        equiposBiomedicos: 'Equipos Biomédicos',
        modificarVisitas: 'Modificar visitas'
      },
      titulos: {
        paciente: 'Paciente: ',
        cancelaVisita: 'Cancela Visita',
        egreso: 'Novedad Egreso',
        infoPaciente: 'Información Paciente',
        tratamientoProcedimiento: 'Tratamientos y procedimientos',
        cita: 'Citas',
        aplicacionesCuidador: 'Aplicaciones por cuidador',
        alertasVisitas: 'Alertas en visita',
        equiposBiomedicos: 'Equipos Biomédicos',
        nombre: 'Nombre ',
        tipoAfiliacion: 'Afiliación ',
        edad: 'Edad ',
        sexo: 'Sexo ',
        piso: 'Piso',
        tipoAdmision: 'Tipo admisión',
        modificarVisitas: 'Modificar visitas'
      },
      validaciones: {
        noRemisionActiva:
          'No existe una remisión activa para la información ingresada'
      }
    },

    cancelarCita: {
      campos: {
        motivoCancelaCita: 'Motivo de cancelación',
        observacion: 'Observación'
      },
      errores: {
        motivoCancelaCitaRequerido: 'Seleccione el motivo',
        seleccionCitaRequerido: 'Seleccione al menos una cita a cancelar'
      },
      botones: {
        cancelarCitas: 'Cancelar citas'
      },
      tabla: {
        fechaVisitaCampo: 'fechaInicioCita',
        fechaVisita: 'Fecha visita',
        tipoCitaCampo: 'tipoCita',
        tipoCita: 'Tipo',
        especialidadCampo: 'especialidad',
        especialidad: 'Especialidad',
        visualizar: 'Visualizar',
        noCitas: 'El paciente no tiene visitas programadas',
        totalRegistros: 'Total registros: '
      },
      mensajesAlerta: {
        exitoCancelarCita: 'Se ha cancelado la visita exitosamente',
        errorCancelarCita: 'Ha ocurrido un error, favor intente más tarde'
      }
    },

    aplicacionCuidador: {
      campos: {
        motivoNovedad: 'Motivo novedad'
      },
      errores: {
        motivoNovedadRequerido: 'Seleccione el motivo',
        seleccionCitaRequerido: 'Seleccione al menos una cita'
      },
      botones: {
        aplicar: 'Aplicar'
      },
      tabla: {
        fechaVisitaCampo: 'fechaInicioCita',
        fechaVisita: 'Fecha visita',
        horaVisitaCampo: 'horaInicioCita',
        horaVisita: 'Filtrar horas visita',
        horaVisitaTabla: 'Hora visita',
        especialidadCampo: 'especialidad',
        especialidad: 'Especialidad',
        motivoCampo: 'motivoCuidador',
        motivo: 'Motivo novedad',
        visualizar: 'Visualizar',
        noCitas: 'El paciente no tiene visitas programadas',
        totalRegistros: 'Total registros: '
      },
      mensajesAlerta: {
        exitoAplicarAplicacion: 'Se han aplicado las visitas exitosamente',
        errorAplicarAplicacion: 'Ha ocurrido un error, favor intente más tarde'
      }
    },

    egreso: {
      campos: {
        motivoEgreso: 'Motivo egreso',
        fechaAlta: 'Fecha alta *',
        fechaAltaDetalle: 'Fecha alta ',
        fechaEgreso: 'Fecha egreso',
        observacion: 'Observación'
      },
      errores: {
        motivoEgresoRequerido: 'Seleccione el motivo',
        fechaAltaRequerido: 'Ingresa la fecha',
        observacionRequerido: 'Ingresa la observación'
      },
      botones: {
        egresar: 'Egresar'
      },
      mensajesAlerta: {
        exitoEgreso: 'Novedad enviada a gestión exitosamente',
        errorEgreso: 'Ha ocurrido un error, favor intente más tarde'
      },
      titulos: {
        egreso: 'Egreso'
      }
    },

    informacionPaciente: {
      opcionesMenu: {
        principal: 'Principal',
        datosPaciente: 'Datos del Paciente',
        direccion: 'Dirección',
        glucomer: 'Glucomer',
        diagnostico: 'Diagnóstico',
        estadoClinico: 'Estado Clinico',
        cambioPiso: 'Cambio Piso',
        asignarProfesional: 'Asignar Profesional'
      },
      datosPaciente: {
        campos: {
          ciudadPrincipal: 'Ciudad principal',
          municipio: 'Municipio',
          barrio: 'Barrio',
          direccion: 'Dirección atención',
          nombreCuidador: 'Nombre cuidador',
          nombreResponsable: 'Nombre responsable',
          telefonoPaciente: 'Teléfono paciente',
          telefonoPacienteRequerido: 'Teléfono paciente *',
          celularPaciente: 'Celular 1 paciente',
          celularPaciente2: 'Celular 2 paciente',
          celularPacienteRequerido: 'Celular paciente *'
        },
        errores: {
          ciudadPrincipalRequerida: 'Elige la ciudad',
          municipioRequerido: 'Elige el municipio',
          barrioRequerido: 'Elige el barrio',
          direccionRequerida: 'Ingresa la dirección',
          nombreCuidadorRequerido: 'Ingresa el cuidador',
          nombreCuidadorMaximaLongitud: 'Máximo 50 caracteres',
          nombreResponsableRequerido: 'Ingresa el responsable',
          nombreResponsableMaximaLongitud: 'Máximo 50 caracteres',
          telefonoRequerido: 'Ingresa el teléfono',
          telefonoMaximaLongitud: 'Máximo 7 dígitos',
          telefonoInvalido: 'Teléfono inválido',
          celularRequerido: 'Ingresa el celular',
          celularMaximaLongitud: 'Máximo 10 dígitos',
          celularInvalido: 'Celular inválido'
        },
        botones: {
          guardar: 'Guardar'
        },
        titulos: {
          datosPaciente: 'Datos Paciente'
        },
        mensajesAlerta: {
          exitoCambioDatosPaciente: 'Novedad enviada a gestión exitosamente',
          errorCambioDatosPaciente:
            'Ha ocurrido un error, favor intente más tarde',
          errorCargarDatosPaciente:
            'Ha ocurrido un error al cargar los datos del paciente, favor intente más tarde'
        }
      },

      diagnosticos: {
        campos: {
          diagnostico: 'Diagnóstico por el que se remite',
          buscar: 'Buscar por código o nombre',
          eliminar: 'Eliminar'
        },
        errores: {},
        tabla: {
          codigoCampo: 'codigo',
          codigo: 'Código',
          nombreCampo: 'nombre',
          nombre: 'Nombre',
          accion: 'Acción',
          eliminar: 'Eliminar',
          noDiagnosticos: 'No se han agregado diagnósticos',
          totalRegistros: 'Total registros: '
        },
        botones: {
          guardar: 'Guardar'
        },
        titulos: {
          diagnosticos: 'Diagnosticos'
        },
        mensajesAlerta: {
          exitoCambioDiagnostico: 'Se ha cambiado el diagnóstico exitosamente',
          errorCambioDiagnostico:
            'Ha ocurrido un error, favor intente más tarde',
          errorCargarDiagnostico:
            'Ha ocurrido un error al cargar los diagnósticos, favor intente más tarde',
          noCambioDiagnostico: 'No se ha presentado modificación de diagnóstico'
        }
      },

      cambioPiso: {
        campos: {
          piso: 'Piso',
          observacion: 'Observación *'
        },
        errores: {
          pisoRequerido: 'Seleccione el piso',
          observacionRequerido: 'Ingresa la observación',
          observacionMaximaLongitud: 'Máxima longitud 4000 dígitos'
        },
        botones: {
          asignarPiso: 'Asignar Piso'
        },
        titulos: {
          cambioPiso: 'Cambio de piso'
        },
        mensajesAlerta: {
          exitoCambioPiso: 'Novedad enviada a gestión exitosamente',
          errorCambioPiso: 'Ha ocurrido un error, favor intente más tarde',
          noCambioPiso: 'No se ha presentado modificación de piso',
          errorCargarInfoPiso:
            'Ha ocurrido un error al cargar la información actual del piso y/o el egreso, favor intente más tarde'
        }
      },
      asignarProfesional: {
        campos: {
          profesional: 'Profesionales',
        },
        errores: {
          pisoRequerido: 'Seleccione el piso',
          observacionRequerido: 'Ingresa la observación',
          observacionMaximaLongitud: 'Máxima longitud 4000 dígitos'
        },
        botones: {
          asignarProfesional: 'Asignar Profesional',
          anularAsignacion: 'Anular Asignación'
        },
        titulos: {
          asignarProfesional: 'Asignar Profesional'
        },
        mensajesAlerta: {
          exitoCambioPiso: 'Novedad enviada a gestión exitosamente',
          errorCambioPiso: 'Ha ocurrido un error, favor intente más tarde',
          noCambioPiso: 'No se ha presentado modificación de piso',
          errorCargarInfoPiso:
            'Ha ocurrido un error al cargar la información actual del piso y/o el egreso, favor intente más tarde'
        }
      }
    },

    planManejoNovedades: {

      tablaProfesionales: {
        nombreCampo: 'Nombre',
        nombre: 'Nombre',
        especialidadCampo: 'Especialidad',
        especialidad: 'Especialidad',
        regionCampo: 'Region',
        region: 'Region',
        
      },
      campos: {
        tratamientos: 'Tratamientos',
        profesional: 'Profesionales',
        procedimientos: 'Procedimientos',
        valoraciones: 'Valoraciones',
        pacientePICC: 'Paciente con PICC CVC',
        curaciones: 'Curaciones',
        terapias: 'Terapias',
        fototerapias: 'Fototerapias',
        tomaMuestras: 'Toma de muestras',
        secreciones: 'Secreciones',
        canalizaciones: 'Canalizaciones',
        soporteNutricional: 'Soporte nutricional'
      },
      botones: {
        agregarValoraciones: 'Agregar valoraciones',
        guardarPlanManejo: 'Guardar'
      },
      tabla: {
        id: 'id',
        medicamentoCampo: 'medicamentoDescripcion',
        medicamento: 'Medicamento',
        dosisCampo: 'cantidadDosis',
        dosis: 'Cantidad',
        viaAdministracionCampo: 'viaAdministracion',
        viaAdministracion: 'Via administración',
        tipoNutricionCampo: 'tipoNutricionDescripcion',
        tipoNutricion: 'Tipo nutrición',
        nutricionCampo: 'nutricionDescripcion',
        nutricion: 'Nutrición',
        frecuenciaCampo: 'frecuenciaDescripcion',
        frecuencia: 'Frecuencia',
        duracionCampo: 'duracion',
        duracion: 'Duración',
        ultimaAplicacionCampo: 'ultimaAplicacion',
        ultimaAplicacion: 'Última aplicacion',
        noPBSCampo: 'noPBS',
        noPBS: 'No PBS',
        esUltimaAplicacionCampo: 'esUltimaAplicacion',
        esUltimaAplicacion: '¿Última Aplicacion?',
        dosisFaltantesCampo: 'dosisFaltantes',
        dosisFaltantes: 'Dosis faltantes',
        accion: 'Acciones',
        eliminar: 'Eliminar',
        editar: 'Editar',
        noTratamientos: 'El paciente no tiene tratamientos',
        noProfesional: 'El paciente no tiene profesionales Asignados',
        noCuraciones: 'El paciente no tiene curaciones',
        noSondajes: 'El paciente no tiene sondajes',
        tituloEliminarTratamiento: 'Eliminar tratamiento',
        contenidoEliminarTratamiento:
          '¿Está seguro de eliminar el tratamiento?',
        tituloEliminarProcedimiento: 'Eliminar procedimiento',
        contenidoEliminarProcedimiento:
          '¿Está seguro de eliminar el procedimiento?',
        tituloEliminarValoracion: 'Eliminar valoración',
        contenidoEliminarValoracion: '¿Está seguro de eliminar la valoración?',
        totalRegistros: 'Total registros: '
      },
      mensajesValidacion: {
        agregarValoraciones:
          'Se han agregado las valoraciones correctamente, recuerde guardar los cambios en el FUR'
      },
      mensajesAlerta: {
        exitoCambioPlan: 'Novedad enviada a gestión exitosamente',
        errorCambioPlan: 'Ha ocurrido un error, favor intente más tarde',
        errorCargarPlan:
          'Ha ocurrido un error al cargar el plan de manejo, favor intente más tarde',
        noCambioPlan:
          'No se han presentado cambios en tratamientos y/o procedimientos'
      },

      tratamientos: {
        campos: {
          medicamento: 'Medicamento',
          medicamentoCodigo: 'Código',
          medicamentoNombre: 'Nombre',
          medicamentoBuscar: 'Buscar por código o nombre',
          dosis: 'Cantidad',
          dosisUnidades: 'Unidades',
          viaAdministracion: 'Via administración',
          viaAdministracionSeleccionar: 'Seleccionar',
          tipoNutricion: 'Tipo de nutrición',
          frecuencia: 'Frecuencia',
          frecuenciaSeleccionar: 'Seleccionar',
          duracion: 'Duración',
          duracionCantidad: 'Cantidad',
          duracionDosis: 'Dosis',
          duracionDosisOxigeno: 'Días',
          tieneUltimaAplicacion: '¿Tiene última aplicación?',
          ultimaAplicacion: 'Última aplicación',
          noPBS: 'No PBS',
          diluyente: 'Diluyente',
          diluyenteTitulo: 'Diluyente *:',
          diluyenteSolucionSalina: 'Solución salina 0.9%',
          diluyenteOtro: 'Otro',
          diluyenteCantidad: 'Cantidad',
          ml: 'm.l',
          requiereEquipo: '¿Requiere equipo?',
          fechaFinTratamiento: 'Fecha fin tratamiento: '
        },
        errores: {
          codigoMedicamentoMaximaLongitud: 'Máxima longitud 10 dígitos',
          codigoMedicamentoInvalido: 'Código inválido',
          medicamentoMaximaLongitud: 'Máxima longitud 10 dígitos',
          medicamentoInvalido: 'Medicamento inválido',
          medicamentoRequerido: 'Ingresa el código o nombre del medicamento',
          dosisCantidadRequerido: 'Ingresa la cantidad',
          dosisCantidadMaximaLongitud: 'Cantidad inválida',
          dosisCantidadInvalido: 'Cantidad inválida',
          dosisUnidadesRequerido: 'Seleccione unidad de dosis',
          viaAdministracionRequerido: 'Seleccione vía administración',
          frecuenciaRequerido: 'Seleccione frecuencia',
          duracionRequerido: 'Ingresa la duración',
          duracionInvalido: 'Duración inválida',
          duracionMin: 'Duración minima de 1 dosis',
          duracionMax: 'Duración máxima de 999 dosis',
          diluyenteRequerido: 'Ingrese diluyente',
          diluyenteOpcionRequerido: 'Seleccione una opción',
          diluyenteCantidadRequerido: 'Ingresa la cantidad',
          diluyenteCantidadMaximaLongitud: 'Cantidad inválida',
          diluyenteCantidadInvalido: 'Cantidad inválida',
          codigoOxigenoMaximaLongitud: 'Máxima longitud 10 dígitos',
          codigoOxigenoInvalido: 'Código inválido',
          oxigenoMaximaLongitud: 'Máxima longitud 10 dígitos',
          oxigenoInvalido: 'Oxigeno inválido',
          oxigenoRequerido: 'Ingresa el código o nombre del medicamento',
          fechaUltimaAplicacionRequerido: 'Ingrese fecha de última aplicación',
          tipoNutricionRequerido: 'Seleccione tipo nutrición',
          nutricionOpcionRequerido: 'Seleccione una opción'
        },
        opcionesMenu: {
          medicamentos: 'Medicamentos',
          nebulizaciones: 'Nebulizaciones',
          oxigenoterapia: 'Oxigenoterapia',
          soporteNutricional: 'Soporte nutricional'
        },
        tituloVentana: {
          agregarEditarMedicamentos: 'Agregar / Editar Medicamentos',
          agregarEditarNebulizaciones: 'Agregar / Editar Nebulizaciones',
          agregarEditarOxigeno: 'Agregar / Editar Oxigeno',
          agregarEditarSoporteNutricional:
            'Agregar / Editar Soporte Nutricional'
        },
        botones: {
          cancelar: 'Cancelar',
          guardar: 'Guardar',
          agregar: 'Agregar',
          editar: 'Editar'
        },
        urls: {
          urlNoPBS:
            'https://tablas.sispro.gov.co/MIPRESNOPBS/Login.aspx?ReturnUrl=%2fMIPRESNOPBS%2f'
        },
        mensajesAlerta: {
          // tslint:disable-next-line:max-line-length
          noDosisFaltantesMedicamentos:
            'Ha ocurrido un error al calcular las dosis faltantes en algunos medicamentos, por favor ingrese las dosis manualmente'
        }
      },

      valoraciones: {
        tipos: {
          poliza: 'poliza',
          ingresoPolizaVida: 'Ingreso Póliza de Vida'
        },
        identificadores: {
          ingresoPolizaVida: '4',
          fonoaudiologiaCanguro: '24',
          enfermeriaCanguro: '9'
        }
      },

      procedimientos: {
        curaciones: {
          campos: {
            tipoCuracion: 'Tipo curación',
            diasSemana: 'Días de la semana',
            sesiones: 'Sesiones',
            descripcion: 'Descripción'
          },
          errores: {
            tipoCuracionRequerido: 'Seleccione el tipo de curación',
            seleccionDiasRequerido: 'Seleccione al menos un día de la semana',
            sesionesCantidadRequerido: 'Ingresa la cantidad',
            sesionesCantidadInvalido: 'Cantidad inválida',
            sesionesCantidadMinima: 'Mínimo 1 sesión',
            sesionesCantidadMaxima: 'Máximo 99 sesiones',
            descripcionRequerido: 'Ingresa la descripción',
            descripcionMaximaLongitud: 'Cantidad inválida'
          },
          tabla: {
            tipoCuracionCampo: 'tipoCuracionDescripcion',
            tipoCuracion: 'Tipo curación',
            diasSemanaCampo: 'dias',
            diasSemana: 'Días de la semana',
            sesionesCampo: 'sesiones',
            sesiones: 'Sesiones',
            accion: 'Acción',
            editar: 'Editar',
            eliminar: 'Eliminar',
            noDias: 'No han cargado los días de curaciones',
            noCuraciones: 'No se han agregado curaciones',
            totalRegistros: 'Total registros: '
          },
          mensajesAlerta: {
            noDiasCuraciones:
              'Favor verifique la selección de días en cada una de las curaciones'
          }
        },

        sondajes: {
          campos: {
            tipoSondajeNovedades: 'Tipo de sondaje',
            sondaje: 'Sondaje',
            fechaSondaje: 'Fecha',
            sesionesSondaje: 'Sesiones'
          },
          errores: {
            tipoSondajeRequerido: 'Seleccione tipo sondaje',
            sondajeRequerido: 'Seleccione sondaje',
            fechaRequerido: 'Ingrese fecha',
            sesionesRequerido: 'Ingrese sesiones',
            sesionesInvalido: 'Cantidad inválida'
          },
          tabla: {
            tipoSondajeCampo: 'idTipoSondaje',
            tipoSondajeNovedades: 'Tipo sondaje',
            sondajeCampo: 'sondaje',
            sondaje: 'Sondaje',
            fechaSondajeCampo: 'fechaSondaje',
            fechaSondaje: 'Fecha sondaje',
            totalSesionesCampo: 'totalSesiones',
            totalSesiones: 'Sesiones',
            accion: 'Acción',
            editar: 'Editar',
            eliminar: 'Eliminar',
            noSondajes: 'No se han agregado sondajes',
            totalRegistros: 'Total registros: '
          },
          tipos: {
            drenaje: 'DRENAJE',
            alimentacion: 'ALIMENTACION',
            tomaMuestra: 'TOMAMUESTRA',
            evacuacion: 'EVACUACION'
          }
        },

        fototerapias: {
          campos: {
            diasTratamiento: 'Días de tratamiento',
            bilirrubinaTotal: 'Bilirrubina total',
            ultimaTomaMuestra: 'Última toma de muestra',
            tipoFrecuencia: 'Tipos frecuencia'
          },
          errores: {
            diasTratamientoRequerido: 'Ingrese días de tratamiento',
            diasTratamientoMinimoValor: 'Minimo 1 día de tratamiento',
            diasTratamientoMaximoValor: 'Máximo 2 días de tratamiento',
            diasTratamientoInvalido: 'Días de tratamiento inválido',
            tipoFrecuenciaRequerido: 'Seleccione el tipo de frecuencia'
          },
          tabla: {
            diasTratamientoCampo: 'diasTratamiento',
            diasTratamiento: 'Días de tratamiento',
            tipoFrecuenciaCampo: 'tipoFrecuencia',
            tipoFrecuencia: 'Tipo frecuencia',
            accion: 'Acción',
            editar: 'Editar',
            eliminar: 'Eliminar',
            noFototerapias: 'No se han agregado fototerapias',
            totalRegistros: 'Total registros: '
          }
        },

        tomaMuestra: {
          campos: {
            tipoMuestra: 'Tipo toma de muestra',
            fechaMuestra: 'Toma de muestra',
            requiereAyuno: 'Requiere ayuno'
          },
          errores: {
            tipoMuestraRequerido: 'Seleccione el tipo de muestra',
            fechaMuestraRequerido: 'Ingrese la fecha'
          },
          tabla: {
            tipoMuestraCampo: 'tipoMuestraDescripcion',
            tipoMuestra: 'Tipo toma de muestra',
            fechaMuestraCampo: 'fechaMuestra',
            fechaMuestra: 'Fecha de toma de muestra',
            requiereAyunoCampo: 'requiereAyuno',
            requiereAyuno: 'Requiere ayuno',
            accion: 'Acción',
            editar: 'Editar',
            eliminar: 'Eliminar',
            noTomaMuestras: 'No se han agregado toma de muestras',
            totalRegistros: 'Total registros: '
          }
        },

        secreciones: {
          campos: {
            diasTratamiento: 'Días de tratamiento',
            envioAspirador: 'Envío de aspirador',
            visitaEnfermeria: 'Visita de enfermería',
            tipoSonda: '¿Tipo de sonda? *',
            pediatrica: 'Pediatrica',
            adulto: 'Adulto',
            via: 'Via',
            nasal: 'Nasal',
            traqueostomia: 'Traqueostomía'
          },
          errores: {
            diasTratamientoRequerido: 'Ingrese días de tratamiento',
            diasTratamientoMinimoValor: 'Minimo 1 día de tratamiento',
            diasTratamientoMaximoValor: 'Máximo 30 días de tratamiento',
            diasTratamientoInvalido: 'Días de tratamiento inválido',
            tipoSondaRequerido: 'Seleccione el tipo de sonda'
          },
          tabla: {
            diasTratamientoCampo: 'diasTratamiento',
            diasTratamiento: 'Días de tratamiento',
            envioAspiradorCampo: 'envioAspirador',
            envioAspirador: 'Envío de aspirador',
            visitaEnfermeriaCampo: 'visitaEnfermeria',
            visitaEnfermeria: 'Visita de enfermería',
            tipoSondaCampo: 'tipoSonda',
            tipoSonda: 'Tipo de sonda',
            nasalCampo: 'nasal',
            nasal: 'Nasal',
            traqueostomiaCampo: 'traqueostomia',
            traqueostomia: 'Traqueostomía',
            accion: 'Acción',
            editar: 'Editar',
            eliminar: 'Eliminar',
            noSecreciones: 'No se han agregado aspiraciones de secreciones',
            totalRegistros: 'Total registros: '
          }
        },

        canalizaciones: {
          campos: {
            intravenosa: 'Intravenosa',
            subcutanea: 'Subcutánea',
            tipoCanalizacion: 'Tipo de canalización'
          },
          errores: {
            tipoCanalizacionRequerido: 'Seleccione el tipo de canalización'
          },
          tabla: {
            tipoCanalizacionCampo: 'tipoCanalizacion',
            tipoCanalizacion: 'Tipo de canalización',
            accion: 'Acción',
            editar: 'Editar',
            eliminar: 'Eliminar',
            noCanalizaciones: 'No se han agregado canalizaciones',
            totalRegistros: 'Total registros: '
          }
        },

        soporteNutricional: {
          campos: {
            medicamento: 'Medicamento',
            medicamentoCodigo: 'Código',
            medicamentoNombre: 'Nombre',
            medicamentoBuscar: 'Buscar por código o nombre',
            dosis: 'Cantidad',
            dosisUnidades: 'Unidades',
            tipoNutricion: 'Tipo nutrición',
            nutricion: 'Nutrición',
            frecuencia: 'Frecuencia',
            frecuenciaSeleccionar: 'Seleccionar',
            duracion: 'Tiempo infusión',
            duracionCantidad: 'Cantidad',
            duracionDosis: 'Dosis',
            noPBS: 'No PBS',
            diasTratamiento: 'Días tratamiento',
            volumen: 'Volumen (gr)',
            diasEvento: 'Dias',
            horaEvento: 'Hora'
          },
          errores: {
            codigoMedicamentoMaximaLongitud: 'Máxima longitud 10 dígitos',
            codigoMedicamentoInvalido: 'Código inválido',
            medicamentoMaximaLongitud: 'Máxima longitud 10 dígitos',
            medicamentoInvalido: 'Medicamento inválido',
            medicamentoRequerido: 'Ingresa el código o nombre del medicamento',
            dosisCantidadRequerido: 'Ingresa la cantidad',
            dosisCantidadMaximaLongitud: 'Cantidad inválida',
            dosisCantidadInvalido: 'Cantidad inválida',
            dosisUnidadesRequerido: 'Seleccione unidad de dosis',
            viaAdministracionRequerido: 'Seleccione vía administración',
            frecuenciaRequerido: 'Seleccione frecuencia',
            duracionRequerido: 'Ingrese el tiempo',
            duracionInvalido: 'Tiempo inválido',
            duracionMin: 'Tiempo minimo de 1',
            duracionMax: 'Tiempo máximo de 999',
            diasTratamientoRequerido: 'Ingresa la cantidad',
            diasTratamientoInvalido: 'Cantidad inválida',
            diasTratamientoMin: 'Minimo 1 día',
            diasTratamientoMax: 'Máximo 99 días',
            volumenRequerido: 'Ingresa la cantidad',
            volumenInvalido: 'Volumen inválido',
            volumenMin: 'Minimo 1 gr',
            volumenMax: 'Máximo 9000 gr',
            diluyenteRequerido: 'Ingrese diluyente',
            diluyenteOpcionRequerido: 'Seleccione una opción',
            diluyenteCantidadRequerido: 'Ingresa la cantidad',
            diluyenteCantidadMaximaLongitud: 'Cantidad inválida',
            diluyenteCantidadInvalido: 'Cantidad inválida',
            codigoOxigenoMaximaLongitud: 'Máxima longitud 10 dígitos',
            codigoOxigenoInvalido: 'Código inválido',
            oxigenoMaximaLongitud: 'Máxima longitud 10 dígitos',
            oxigenoInvalido: 'Oxigeno inválido',
            oxigenoRequerido: 'Ingresa el código o nombre del medicamento',
            fechaUltimaAplicacionRequerido:
              'Ingrese fecha de última aplicación',
            tipoNutricionRequerido: 'Seleccione tipo nutrición',
            nutricionRequerido: 'Seleccione nutricion',
            diasEventoRequerido: 'Seleccione el día',
            horaEventoRequerido: 'Seleccione la hora',
            tipoEventoRequerido: 'Seleccione el tipo',
            eventoRequerido: 'Agrega al menos un evento'
          },
          tabla: {
            id: 'id',
            medicamentoCampo: 'medicamentoDescripcion',
            medicamento: 'Medicamento',
            dosisCampo: 'cantidadDosis',
            dosis: 'Dosis',
            tipoNutricionCampo: 'tipoNutricionDescripcion',
            tipoNutricion: 'Tipo nutrición',
            nutricionCampo: 'nutricionDescripcion',
            nutricion: 'Nutrición',
            frecuenciaCampo: 'frecuenciaDescripcion',
            frecuencia: 'Frecuencia',
            duracionCampo: 'duracion',
            duracion: 'Duración',
            noPBSCampo: 'noPBS',
            noPBS: 'No PBS',
            diasCampo: 'diasEvento',
            dias: 'Días',
            horaCampo: 'frecuenciaDescripcion',
            hora: 'Hora',
            eventoCampo: 'eventoDescripcion',
            evento: 'Evento',
            diasTratamientoCampo: 'diasTratamiento',
            diasTratamiento: 'Días tratamiento',
            accion: 'Acciones',
            eliminar: 'Eliminar',
            editar: 'Editar',
            noSoporteNutricional: 'El paciente no tiene soporte nutricional',
            noEventos: 'No se han agregado eventos',
            totalRegistros: 'Total registros: '
          },
          tiposNutricion: {
            enteral: 'Enteral',
            parenteral: 'Parenteral'
          }
        },

        opcionesMenu: {
          curaciones: 'Curaciones',
          sondajes: 'Sondajes',
          terapias: 'Terapias',
          fototerapias: 'Fototerapias',
          tomaMuestras: 'Toma de muestras',
          secreciones: 'Secreciones',
          canalizaciones: 'Canalizaciones',
          soporteNutricional: 'Soporte nutricional'
        },
        tituloVentana: {
          agregarEditarCuraciones: 'Agregar / Editar Curaciones',
          agregarEditarSondajes: 'Agregar / Editar Sondajes',
          agregarEditarTerapias: 'Agregar / Editar Terapias',
          agregarEditarFototerapias: 'Agregar / Editar Fototerapias',
          agregarEditarTomaMuestras: 'Agregar / Editar Toma de muestras',
          agregarEditarAspiracionSecreciones:
            'Agregar / Editar Aspiración de secreciones',
          agregarEditarCanalizaciones: 'Agregar / Editar Canalizaciones',
          agregarEditarSoporteNutricional:
            'Agregar / Editar Soporte nutricional'
        },
        botones: {
          cancelar: 'Cancelar',
          guardar: 'Guardar',
          agregar: 'Agregar',
          editar: 'Editar'
        },
        urls: {
          urlNoPBS:
            'https://tablas.sispro.gov.co/MIPRESNOPBS/Login.aspx?ReturnUrl=%2fMIPRESNOPBS%2f'
        }
      }
    },

    citas: {
      campos: {
        profesional: 'Profesional',
        tipo: 'Tipo',
        tipoAtencion: {
          valoracion: 'Valoración',
          codigoValoracion: '1',
          manejo: 'Manejo',
          codigoManejo: '2'
        },
        recursoPreferido: 'Profesional preferido',
        tipoCita: 'Tipo cita',
        tipoFechaCita: {
          citaExistente: 'Cita Existente',
          codigoCitaExistente: '1',
          fija: 'Fija',
          codigoFija: '2',
          periodica: 'Periodica',
          codigoPeriodica: '3'
        },
        fecha: 'Fecha',
        fechaFija: 'Fecha fija',
        fechaPeriodica: 'Fecha periódica',
        semanas: 'Semanas',
        totalVisitas: 'Total visitas',
        minimoTotalVisitas: 1,
        maximoTotalVisitas: 30,
        tipoCambioCita: 'Acción',
        fechaCita: 'Fecha cita',
        especialidad: 'Especialidad'
      },
      errores: {
        profesionalRequerido: 'Seleccione profesional',
        tipoRequerido: 'Seleccione tipo',
        tipoCitaRequerido: 'Seleccione tipo cita',
        citaExistenteRequerido: 'Seleccione cita existente',
        fechaFijaRequerido: 'Ingresa fecha fija',
        fechaPeriodicaRequerido: 'Ingresa fecha periódica',
        diasFechaPeriodicaRequerido: 'Ingrese días',
        diasFechaPeriodicaMinimoValor: 'Minimo 1 día',
        diasFechaPeriodicaMaximoValor: 'Máximo 7 días',
        diasFechaPeriodicaInvalido: 'Día inválido',
        totalSesionesRequerido: 'Ingrese total de visitas',
        totalSesionesMinimoValor: 'Minimo 1 total de visitas',
        totalSesionesMaximoValor: 'Máximo 30 total de visitas',
        totalSesionesInvalido: 'Total visitas inválido',
        semanasRequerido: 'Ingrese semanas',
        semanasMinimoValor: 'Minimo 1 semana',
        semanasMaximoValor: 'Máximo 52 semanas',
        semanasInvalido: 'Semanas inválida',
        tipoCambioCitaRequerido: 'Seleccione tipo de cambio',
        fechaCitaRequerido: 'Ingresa fecha cita',
        recursoPreferido: 'Debe elegir un recurso preferido'
      },
      tabla: {
        especialidadCampo: 'profesional',
        especialidad: 'Especialidad',
        estadoCampo: 'estado',
        estado: 'Estado',
        tipoCitaCampo: 'tipoCita',
        tipoCita: 'Tipo de cita',
        profesionalCampo: 'profesional',
        profesional: 'Profesional',
        fechaCampo: 'fecha',
        fecha: 'Fecha',
        totalSesionesCampo: 'totalSesiones',
        totalSesiones: 'Total sesiones',
        sesionesFaltantesCampo: 'sesionesFaltantes',
        sesionesFaltantes: 'Sesiones faltantes',
        accion: 'Acción',
        editar: 'Editar',
        eliminar: 'Eliminar',
        noCitas: 'No se presentan citas registradas',
        tituloEliminarCita: 'Eliminar cita',
        contenidoEliminarCita: '¿Está seguro de eliminar la cita?',
        validaciones: {
          cantidadSesiones: 'Mínimo 1 sesión y máximo 2 sesiones por día',
          seleccionDias: 'Seleccione al menos un dia',
          valorInvalido: 'Inválido'
        },
        sesiones: 'Sesiones',
        noDias: 'No se presentan días para la programación',
        totalRegistros: 'Total registros: '
      },
      titulos: {
        citas: 'Citas',
        agregarCita: 'Agregar cita',
        reprogramarCita: 'Reprogramar cita'
      },
      opcionesMenu: {
        citas: 'Citas',
        agregarReprogramar: 'Agregar/Reprogramar cita'
      },
      profesiones: {
        enfermeria: {
          id: '4',
          nombre: 'Enfermeria',
          tiposCita: {
            idHeridaMayor: '7',
            idHeridaMenor: '11',
            heridaMayor: 'Herida mayor',
            heridaMenor: 'Herida menor'
          }
        },
        auxiliarEnfermeria: {
          id: '19'
        },
        jefeEnfermeria: {
          id: '20'
        }
      },
      tituloVentana: {
        agregarEditarCitas: 'Agregar / Editar Citas',
        agregarReprogramarCita: 'Adicionar / Reprogramar cita',
        contenidoAgregarReprogramarCita:
          'El plan de manejo ha sido modificado, si hace clic en Aceptar se perderán los cambios'
      },
      botones: {
        editar: 'Editar',
        eliminar: 'Eliminar',
        cancelar: 'Cancelar',
        guardar: 'Guardar',
        agregarCita: 'Agregar cita',
        guardarCitas: 'Guardar citas',
        agregar: 'Agregar',
        adicionarReprogramar: 'Adicionar o Reprogramar',
        reprogramar: 'Reprogramar',
        restaurar: 'Restaurar'
      },
      mensajesAlerta: {
        exitoCambioCita: 'Novedad enviada a gestión exitosamente',
        errorCambioCita: 'Ha ocurrido un error, favor intente más tarde',
        errorCargarCita:
          'Ha ocurrido un error al cargar las citas, favor intente más tarde',
        noCambioCita: 'No se ha presentado modificación de citas',
        citaProfesionalDuplicado:
          'Ya existe una cita para el tipo de profesional'
      },
      accionesAgregarReprogramar: {
        agregarCita: 'Agregar cita',
        reprogramarCita: 'Reprogramar cita'
      }
    },

    alertasVisitas: {
      campos: {
        tituloAlertaCita: 'Citas paciente',
        minutoCita: 'Minutos',
        minutosTexto: 'Tiempo Visita'
      },
      tabla: {
        especialista: 'Especialista',
        especialistaCampo: 'especialidad',
        fechaVisita: 'Fecha visita',
        fechaVisitaCampo: 'fechaInicioCita',
        visualizar: 'Visualizar',
        noHaycitas: 'No hay visitas disponibles',
        totalRegistros: 'Total registros: '
      },
      botones: {
        guardar: 'Aplicar'
      },
      errores: {
        campoRequerido: 'Debes ingresar el tiempo de la cita',
        miximoCita: 'Tiempo maximo debe ser de una hora (3600) segundos',
        patterCita: 'Solo debes ingresar numeros'
      }
    },
    modalAlertas: {
      campos: {
        subtittle: '¿ Deseas guardar los cambios realizados ?',
        titulo: 'Debes guardar primero o se perdera la información'
      },
      botones: {
        cerrar: 'NO',
        guardar: 'SI'
      }
    },

    equipoBiomedico: {
      campos: {
        tipoEquipoBiomedico: 'Equipo biomédico',
        fechaInicio: 'Fecha inicio',
        fechaFin: 'Fecha fin',
        notaEliminar: 'Nota',
        tituloModalEliminar: 'Eliminar equipo biomédico'
      },
      errores: {
        equipoBiomedicoRequerido: 'Seleccione el equipo biomédico',
        fechaInicioRequerido: 'Ingrese fecha inicio',
        fechaFinRequerido: 'Ingrese fecha fin'
      },
      botones: {
        solicitar: 'Solicitar',
        botonesGuardarEliminar: 'Guardar',
        botonesCancelarEliminar: 'Cancelar'
      },
      tabla: {
        equipoBiomedicoCampo: 'equipoBiomedicoDescripcion',
        equipoBiomedico: 'Equipo biomédico',
        fechaInicioCampo: 'fechaInicio',
        fechaInicio: 'Fecha inicio',
        fechaFinCampo: 'fechaFin',
        fechaFin: 'Fecha fin',
        estadoCampo: 'estado',
        estado: 'Estado',
        estadoProveedorCampo: 'estadoProveedor',
        estadoProveedor: 'Estado proveedor',
        accion: 'Acción',
        editar: 'Editar',
        eliminar: 'Eliminar',
        guardar: 'Guardar',
        noEquiposBiomedicos: 'El paciente no tiene equipos biomédicos',
        totalRegistros: 'Total registros: '
      },
      mensajesAlerta: {
        exitoSolicitarEquipo:
          'Se ha solicitado equipos biomédicos exitosamente',
        errorSolicitarEquipo: 'Ha ocurrido un error, favor intente más tarde',
        equipoExistente: 'Ya se ha agregado este equipo biomédico'
      },
      equipos: {
        idEquipoCilindroPortatil: '8'
      },
      estados: {
        solicitado: '1',
        asignado: '2',
        entregado: '3',
        terminado: '4',
        cancelado: '5'
      }
    },

    gestionNovedad: {
      campos: {
        tipoDocumento: 'Tipo documento',
        numeroDocumento: 'Número documento',
        ciudad: 'Ciudad',
        piso: 'Piso',
        estado: 'Estado',
        planesGestionados: 'Mostrar planes de manejo gestionados',
        remision: 'Remision'
      },
      errores: {
        ciudadRequerido: 'Seleccione la ciudad',
        numeroDocumentoMaximaLongitud: 'Máximo 20 caracteres',
        numeroDocumentoInvalido: 'Número de documento inválido'
      },
      tabla: {
        fechaGestionCampo: 'fechaGestionSolicitud',
        fechaGestion: 'Fecha gestión',
        usuarioGestionCampo: 'usuarioGestion',
        usuarioGestion: 'Usuario gestiona',
        tipoNovedadCampo: 'tipoNovedad',
        tipoNovedad: 'Tipo novedad',
        nombrePacienteCampo: 'nombrePaciente',
        nombrePaciente: 'Paciente',
        numeroIdentificacionCampo: 'numeroIdentificacion',
        numeroIdentificacion: 'Identificación',
        pisoCampo: 'piso',
        piso: 'Piso',
        usuarioReportaCampo: 'usuarioSolicita',
        usuarioReporta: 'Usuario reporta',
        fechaSolicitudCampo: 'fechaSolicitud',
        fechaSolicitud: 'Fecha novedad',
        estadoSolicitudNovedadCampo: 'estadoSolicitudNovedad',
        estadoSolicitudNovedad: 'Estado',
        accion: 'Acción',
        gestionar: 'Gestionar',
        noNovedades:
          'No se presentan novedades relacionadas a los criterios de búsqueda',
        totalRegistros: 'Total registros: ',
        tituloGestionarNovedadActivacion: 'Gestionar solicitud',
        contenidoGestionarNovedadActivacion:
          '¿Está seguro de gestionar esta solicitud de novedad tipo Activación?'
      },
      titulos: {
        gestionarNovedades: 'Gestionar novedades'
      },
      botones: {
        limpiar: 'Limpiar',
        buscar: 'Buscar',
        guardarFiltros: 'Guardar filtros'
      },
      mensajesAlerta: {
        errorGestionNovedades:
          'No hay novedades relacionados a los criterios de búsqueda',
        exitoGestionarSolicitud:
          'Se ha gestionado la solicitud de novedad exitosamente',
        errorGestionarSolicitud: 'Ha ocurrido un error, favor intente más tarde'
      }
    },

    detalleGestionNovedad: {
      campos: {
        seleccionListaCita:
          'Seleccione la visita para aplicar el nuevo plan de manejo',
        seleccionFechaCita: 'Ingrese una fecha y hora para aplicar la novedad',
        listaCita: 'listaCita',
        fechaCita: 'fechaCita',
        volverAtras: 'Volver atrás',
        verPlanesManejo: 'Ver planes de manejo'
      },
      opciones: {
        volverAtras: 'Volver atrás',
        verPlanesManejo: 'Ver planes de manejo'
      },
      titulos: {
        gestionarNovedades: 'Gestionar novedades',
        usuarioRegistra: 'Usuario registra',
        usuarioGestiona: 'Usuario gestiona'
      },
      tabla: {
        idNovedadCampo: 'id',
        idNovedad: 'Id',
        estadoCampo: 'estado',
        estado: 'Estado',
        novedadCampo: 'novedad',
        novedad: 'Novedad',
        visitaCampo: 'especialidad',
        visita: 'Visita',
        fechaCampo: 'fechaInicioCita',
        fecha: 'Fecha',
        noNovedades: 'No se presentan novedades',
        noCitas: 'No se presentan citas',
        detalle: 'Detalle',
        visualizar: 'Visualizar',
        totalRegistros: 'Total registros: '
      },
      validaciones: {
        fechaRequerido: 'Ingrese fecha'
      },
      botones: {
        gestionar: 'Gestionar',
        escalar: 'Escalar',
        cancelar: 'Cancelar',
        aplicar: 'Aplicar'
      },
      mensajesAlerta: {
        exitoEscalarSolicitud:
          'Se ha escalado la solicitud de novedad exitosamente',
        errorEscalarSolicitud: 'Ha ocurrido un error, favor intente más tarde',
        exitoGestionarSolicitud:
          'Se ha gestionado la solicitud de novedad exitosamente',
        errorGestionarSolicitud: 'Ha ocurrido un error, favor intente más tarde'
      }
    },

    detallesGestionNovedadesCampos:{
     
      diagnosticos:{
        codigo: 'Codigo',
        nombre: 'Nombre diagnostico'
      },

      AlertaCita:{
        textoAlerta: 'Nombre alerta',
        duracion: 'Duracion',
      },

      equipoBiomedico : {
        tipoEquipo: 'Tipo de equipo',
        estado: 'Estado',
        proveedor: 'Proveedor'  
      },

      cancelarCita : {
        especialidad: 'Especialidad',
        motivo: 'Motivo de cancelacion',
        observacion: 'Observacion'
      },
      
      aplicacionCuidador : {
        especialidad : 'Especialidad',
        motivo : 'Motivo',
        fechaInicioCita : 'Fecha de inicio cita',
        horaInicioCita : 'Hora de inicio'
      },

      fijarCita : {
        especialidad : 'Especialidad',
        fechaInicioCita: 'Fecha de inicio cita',
        horaFijadaInicio: 'Inicio de hora fijada',
        horaFijadaFin: 'Fin de hora fijada'
      },

      desfijarCita : {
        especialidad : 'Especialidad',
        fechaInicioCita: 'Fecha Inicio cita'
      },

      profesionalAsignado : {
        especialidad : 'Especialidad',
        nombreCompleto : 'Nombre completo',
        region : 'Region',
        distrito : 'Distrito',
        direccion : 'Direccion'
      }  
    },

    gestionPaciente: {
      campos: {
        tipoDocumento: 'Tipo documento',
        numeroDocumento: 'Número documento',
        ciudad: 'Ciudad',
        piso: 'Piso',
        estado: 'Estado',
        planesGestionados: 'Mostrar planes de manejo gestionados',
        consultaPacientes: 'Consultar pacientes en: ',
        activos: 'Activos: ',
        nuevo: 'Nuevo: ',
        preAlta: 'Pre-alta: ',
        alta: 'Alta: '
      },
      errores: {
        ciudadRequerido: 'Seleccione la ciudad',
        numeroDocumentoMaximaLongitud: 'Máximo 20 caracteres',
        numeroDocumentoInvalido: 'Número de documento inválido'
      },
      tabla: {
        remisionCampo: 'idRemision',
        remision: 'Remisión',
        identificacionCampo: 'identificacion',
        identificacion: 'Identificación',
        pacienteCampo: 'nombre',
        paciente: 'Paciente',
        resumenRemisionCampo: 'resumenRemision',
        resumenRemision: 'Resumen remisión',
        novedadCampo: 'novedad',
        novedad: 'Novedad',
        equipoBiomedicoCampo: 'equipoBiomedico',
        equipoBiomedico: 'Equipo biomédico',
        estadoCampo: 'estadoPaciente',
        estado: 'Estado',
        accion: 'Acción',
        gestionar: 'Gestionar',
        noPacientes:
          'No se presentan pacientes relacionados a los criterios de búsqueda',
        totalRegistros: 'Total registros: ',
        linkHistorial: 'Historial',
        linkGestionar: 'Gestionar',
        linkCrearNovedad: 'Crear',
        linkEquipoBiomedico: 'Ir',
        fechaAdmisionCampo: 'fechaAdmision',
        fechaAdmision: 'Fecha de Admisión',
        fechaPosibleAltaCampo: 'fechaPosibleAlta',
        fechaPosibleAlta: 'Fecha de Posible Alta'
      },
      titulos: {
        gestionarPacientes: 'Gestionar pacientes'
      },
      botones: {
        limpiar: 'Limpiar',
        buscar: 'Buscar',
        guardarFiltros: 'Guardar filtros'
      },
      mensajesAlerta: {
        errorCargarGestionPacientes:
          'No hay pacientes relacionados a los criterios de búsqueda'
      }
    },

    historialPlanManejo: {

      
      campos: {
        tipoDocumentoPaciente: 'Tipo identificación',
        numeroDocumentoPaciente: 'Número identificación',
        remisionPaciente: 'Remisión',
        textoRemision: 'Remisión: ',
        textoPaciente: 'Paciente: '
      },
      errores: {
        tipoDocumentoPacienteRequerido: 'Seleccione el tipo',
        numeroDocumentoPacienteRequerido: 'Ingresa el número',
        numeroDocumentoPacienteMaximaLongitud: 'Máxima longitud 20 dígitos',
        numeroDocumentoPacienteInvalido: 'Número inválido',
        remisionPacienteRequerido: 'Ingresa el número de remisón',
        remisionPacienteMaximaLongitud: 'Máxima longitud 15 dígitos',
        remisionPacienteInvalido: 'Número inválido'
      },
      botones: {
        buscarPaciente: 'Buscar paciente',
        volverAtras: 'Volver atrás'
      },
      titulos: {
        historialPlanManejo: 'Historial Planes de Manejo',
        remisiones: 'Remisiones',
        planesManejo: 'Planes de manejo',
        egreso: 'Novedad Egreso',
        infoPaciente: 'Información Paciente',
        tratamientoProcedimiento: 'Tratamientos y procedimientos',
        cita: 'Citas',
        diagnosticos: 'Diagnósticos',
        nombre: 'Nombre ',
        tipoAfiliacion: 'Afiliación ',
        edad: 'Edad ',
        sexo: 'Sexo '
      },
      tablaRemision: {
        remisionCampo: 'idRemision',
        remision: 'Remision',
        fechaCreacionCampo: 'fechaCreacion',
        fechaCreacion: 'Fecha creación',
        noRemisiones: 'No se presentan remisiones'
      },
      tablaNovedad: {
        tipoNovedadCampo: 'tipoNovedad',
        tipoNovedad: 'Novedad',
        fechaCreacionNovedadCampo: 'fechaCreacionNovedad',
        fechaCreacionNovedad: 'Fecha creación',
        noNovedades: 'No se presentan novedades'
      },
     
      validaciones: {
        noRemisionActiva:
          'No existe una remisión activa para la información ingresada'
      },
      mensajesAlerta: {
        errorHistorial: 'Ha ocurrido un error, favor intente más tarde',
        noRemisiones: 'El paciente no tiene remisiones en Salud en casa'
      }
    },

    modificacionVisitas: {
      campos: {
        formulario: 'Seleccione formulario'
      },
      botones: {},
      formularios: {
        alertasVisitas: 'Alertas en visita',
        aplicacionesCuidador: 'Aplicaciones cuidador',
        cancelarVisitas: 'Cancelar visitas',
        fijarVisitas: 'Fijar visitas'
      }
    },

    fijacionVisitas: {
      campos: {
        mensajeHoras: 'Ingrese el rango de horas en que se realizara la visita',
        motivoFijacion: 'Motivo fijación',
        especialidad: 'Especialidad',
        horaFijada: 'Hora fijada',
        horaInicial: 'Hora inicial',
        horaFinal: 'Hora final'
      },
      errores: {
        horaFijacionRequerido: 'Seleccione hora',
        rangoHorasError: 'El rango de horas es invalido',
        unaHora: 'Debe haber una diferencia minima de una hora',
        motivoFijacionRequerido: 'Seleccione el motivo',
      },
      botones: {
        fijar: 'Fijar',
        desfijar: 'Desfijar'
      },
      tabla: {
        fechaVisitaCampo: 'fechaInicioCita',
        fechaVisita: 'Fecha visita',
        motivoCampo: 'motivoFijacion',
        motivo: 'Motivo fijación',
        horaFijadoCampo: 'horaFijado',
        horaFijado: 'Rango de horas fijadas',
        especialidadCampo: 'especialidad',
        especialidad: 'Especialidad',
        visualizar: 'Visualizar',
        noVisitas: 'No se presentan visitas para los filtros seleccionados',
        totalRegistros: 'Total registros: '
      },
      mensajesAlerta: {
        exitoFijarVisita: 'Se han fijado las visitas exitosamente',
        exitoDesFijarVisita: 'Se han desfijado las visitas exitosamente',
        errorFijarDesfijarVisita: 'Ha ocurrido un error, favor intente más tarde',
      }
    },
  },

  lineaUnica: {
    campos: {
      ciudad: 'Ciudad'
    },
    tabla: {
      tipoDocumento: 'tipoDocumento',
      tipoDocumentoCampo: 'Tipo documento',
      numeroRemision: 'Remisión',
      fechaAdmisionCampo: 'fechaRemision',
      fechaAdmision: 'Fecha Admisión',
      usuarioCampo: 'usuario',
      usuario: 'Usuario',
      nombrePacienteCampo: 'nombrePaciente',
      nombrePaciente: 'Paciente',
      planSaludCampo: 'planSalud',
      planSalud: 'Plan afiliación',
      contactoCampo: 'contacto',
      contacto: 'Contactos',
      estadoRemisionCampo: 'estadoRemision',
      estadoRemision: 'Estado',
      identificacion: 'Identificación',
      identificacionCampo: 'identificacionCampo',
      usuarioModifica: 'Usuario',
      accion: 'Acción',
      eliminar: 'Eliminar',
      editar: 'Editar',
      noRemisiones: 'No hay remisiones disponibles',
      totalRegistros: 'Total registros: '
    }
  },
  lineaUnicaModal: {
    mensajesAlerta: {
      exitoCambioDatosPaciente: 'Novedad enviada a gestión exitosamente',
      errorCambioDatosPaciente: 'Ha ocurrido un error, favor intente más tarde',
      errorCargarDatosPaciente:
        'Ha ocurrido un error al cargar los datos del paciente, favor intente más tarde'
    },
    campos: {
      identificacion: 'Identificacón',
      novedad: 'Crear novedad cambio de dirección',
      llamdaNocontestada: 'Causas de la llamada',
      motivos: 'Causas'
    },
    botones: {
      cancelar: 'Cancelar',
      guardar: 'Guardar'
    },
    tabla: {
      idProfesional: 'Profesional',
      profesionalCampo: 'idProfesional',
      fechaPrimerCitaCampo: 'fechaPrimercita',
      fechaPrimercita: 'Fecha inicio cita',
      fechaFinCitaCampo: 'Fecha fin cita',
      fechaFinCita: 'fechaFinCita',
      noCitas: 'El paciente no tiene citas',
      visualizar: 'Visualizar',
      especialista: 'Especialista',
      especialistaCampo: 'especialidad',
      totalRegistros: 'Total registros: '
    },
    errores: {
      noExitosa: 'Debes seleccionar una causa'
    }
  },
  detalleVisita: {
    campos: {
      titulo: 'Detalle visitas',
      procedimientos: 'Procedimientos',
      tratamientos: 'Tratamientos',
      curaciones: 'Curaciones',
      sondaje: 'Sondajes',
      tomaDeMuestra: 'Toma de muestra',
      secreciones: 'Secreciones',
      fotoTerapia: 'Fototerapias',
      noHayDatos: 'No hay visitas',
      soporteNutricional: 'Soporte nutricional',
      canalizaciones: 'Canalizaciones'
    },
    tabla: {
      procedimientos: {
        curaciones: {
          ubicacionHeridaCampo: 'Ubicación herida',
          ubicacionHerida: 'ubicacionHerida',
          tipoCuracion: 'Tipo Curación',
          tipoCuracionCampo: 'tipoCuracionDescripcion'
        },
        tomaDeMuestra: {
          tipoPrestacionCampo: 'Toma de muestra',
          tipoPrestacion: 'tipoPrestacion',
          fechaMuestraCampo: 'Fecha muestra',
          fechaMuestra: 'fechaMuestra',
          tipoMuestraCampo: 'tipoMuestraDescripcion',
          tipoMuestra: 'Tipo de muestra',
          requiereAyunoCampo: 'Requiere ayuno',
          requiereAyuno: 'requiereAyuno'
        },
        secreciones: {
          tipoPrestacion: 'Tipo presentación',
          tipoPrestacionCampo: 'tipoPrestacion',
          diasTratamientoCampo: 'Dias tratamiento',
          diasTratamiento: 'diasTratamiento',
          envioAspiradorCampo: 'Envio aspirador',
          envioAspirador: 'envioAspirador',
          visitaEnfermeriaCampo: 'Visita enfermeria',
          visitaEnfermeria: 'visitaEnfermeria',
          tipoSonda: 'Tipo sonda',
          tipoSondaCampo: 'tipoSonda',
          nasalCampo: 'Nasal',
          nasal: 'nasal',
          traqueostomiaCampo: 'Traqueostomia'
        },
        canalizaciones: {
          tipoCanalziacion: 'Tipo de canalización',
          tipoDeCanalizacionCampo: 'canalizacion'
        },
        fototerapias: {
          tipoPrestacion: 'Tipo Presentación',
          tipoPrestacionCampo: 'tipoPrestacion',
          bilirrubinaTotal: 'Bilirrubina total',
          bilirrubinaTotalCampo: 'bilirrubinaTotal'
        },
        sondaje: {
          sondaje: 'Sondaje',
          sondajeCampo: 'sondaje',
          tipoPresentacion: 'Tipo presentación',
          tipoPresentacionCampo: 'tipoPresentacion',
          totalSesiones: 'Total sesiones',
          totalSesionesCampo: 'totalSesiones',
          fechaSondaje: 'Fecha sondaje',
          fechaSondajeCampo: 'fechaSondaje'
        },
        soporteNutricional: {
          nombreMedicamento: 'Medicamento',
          nombreMedicamentoCampo: 'medicamento',
          duracion: 'Duración',
          duracionCampo: 'duracion',
          tipoNutricion: 'Tipo nutrición',
          tipoNutricionCampo: 'tipoNutricion',
          nutricion: 'Nutrición',
          nutricionCampo: 'nutricion',
          dosis: 'Dosis',
          dosisCampo: 'dosis'
        }
      },

      tratamientos: {
        id: 'id',
        medicamentoCampo: 'medicamentoDescripcion',
        medicamento: 'Medicamento',
        dosisCampo: 'cantidadDosis',
        dosis: 'Dosis',
        viaAdministracionCampo: 'viaAdministracion',
        viaAdministracion: 'Via administración',
        frecuenciaCampo: 'frecuenciaDescripcion',
        frecuencia: 'Frecuencia'
      },
      datosAtencion: {
        idProfesional: 'Profesional',
        profesionalCampo: 'idProfesional',
        nombreProfesional: 'Nombre profesional',
        nombreProfesionalCampo: 'nombreProfesional',
        piso: 'Piso',
        pisoCampo: 'piso',
        fechaInicioCita: 'Hora inicio cita',
        horaInicioCampo: 'fechaInicioCita',
        fechaFinCita: 'Hora fin visita',
        horaFincampo: 'fechaFinCita',
        noHayDatos: 'No hay datos'
      }
    }
  },

  equiposBiomedicos: {
    gestionEquipos: {
      campos: {
        tipoDocumento: 'Tipo documento',
        numeroDocumento: 'Número documento',
        ciudad: 'Ciudad',
        remision: 'Remisión',
        estado: 'Estado',
        usuario: 'Usuario',
        fechaInicio: 'Fecha inicio',
        fechaFin: 'Fecha fin',
        planesGestionados: 'Mostrar planes de manejo gestionados'
      },
      errores: {
        ciudadRequerido: 'Seleccione la ciudad',
        numeroDocumentoMaximaLongitud: 'Máximo 20 caracteres',
        numeroDocumentoInvalido: 'Número de documento inválido',
        remisionMaximaLongitud: 'Máximo 15 caracteres',
        remisionInvalido: 'Número de documento inválido',
        usuarioMaximaLongitud: 'Máximo 15 caracteres',
        usuarioInvalido: 'Número de documento inválido',
        fechaFinRequerido: 'Ingresa la fecha'
      },
      tabla: {
        remisionCampo: 'remision',
        remision: 'Remision',
        equipoBiomedicoCampo: 'equipoBiomedico',
        equipoBiomedico: 'Equipo',
        fechaInicioCampo: 'fechaInicio',
        fechaInicio: 'Fecha inicio',
        fechaFinCampo: 'fechaFin',
        fechaFin: 'Fecha fin',
        estadoCampo: 'estado',
        estado: 'Estado',
        usuarioCampo: 'usuario',
        usuario: 'Usuario',
        fechaRegistroCampo: 'fechaRegistro',
        fechaRegistro: 'Fecha registro',
        accion: 'Acción',
        gestionar: 'Gestionar',
        visualizar: 'Visualizar',
        noEquiposBiomedicos:
          'No se presentan equipos biomédicos relacionados a los criterios de búsqueda',
        totalRegistros: 'Total registros: '
      },
      titulos: {
        gestionarEquipos: 'Gestionar equipos biomédicos'
      },
      botones: {
        limpiar: 'Limpiar',
        buscar: 'Buscar',
        guardarFiltros: 'Guardar filtros'
      },
      mensajesAlerta: {
        errorEquiposBiomedicos: 'Ha ocurrido un error, favor intente más tarde'
      },
      estados: {
        solicitado: '1',
        asignado: '2',
        entregado: '3',
        terminado: '4',
        cancelado: '5'
      }
    },

    detalleGestionEquipos: {
      campos: {
        remision: 'Remisión',
        tipoDocumento: 'Tipo documento',
        numeroDocumento: 'Número documento',
        equipoBiomedico: 'Equipo biomédico',
        fechaRegistro: 'Fecha registro',
        nivelIngreso: 'Nivel de ingreso',
        direccion: 'Dirección',
        telefono: 'Teléfono',
        fechaInicio: 'Fecha inicio',
        fechaFin: 'Fecha fin',
        usuario: 'Usuario',
        nota: 'Nota',
        estado: 'Estado',
        proveedor: 'Proveedor'
      },
      titulos: {
        gestionEquipo: 'Gestión equipo biomédico'
      },
      errores: {
        fechaInicioRequerido: 'Ingrese fecha',
        fechaFinRequerido: 'Ingrese fecha',
        estadoRequerido: 'Seleccione el estado',
        proveedorRequerido: 'Seleccione el proveedor',
        notaRequerido: 'Ingrese nota',
        equipoRequerido: 'Seleccione un equipo',
      },
      botones: {
        asignar: 'Asignar',
        cancelar: 'Cancelar',
        guardar: 'Guardar'
      },
      mensajesAlerta: {
        tituloConfirmarCambioEstado: 'Cambio de estado',
        contenidoConfirmarCambioEstado:
          '¿Está seguro de cambiar el estado del equipo biomédico?',
        exitoGestionarEquipo:
          'Se ha gestionado el equipo biomédico exitosamente',
        errorGestionarEquipo: 'Ha ocurrido un error, favor intente más tarde'
      }
    }
  },

  bebeCanguroAmbulatorio: {
    titulos: {
      subtitle: 'Bebé canguro'
    },
    campos: {
      tipoDocumento: 'Tipo documento',
      identificacion: 'Identificación',
      remision: 'Remisión',
      institucionRemitente: 'Institución remitente',
      planSalud: 'Plan de salud',
      estado: 'Estado',
      ciudadPrincipal: 'Ciudad principal',
      fechaInicio: 'Fecha inicio'
    },
    errores: {
      tipoDocumentoRequerido: 'Elige el documento',
      numeroMaximaLongitud: 'Máximo 15 dígitos',
      numeroFormatoInvalido: 'Número inválido'
    },
    botones: {
      buscar: 'Buscar',
      limpiar: 'Limpiar'
    },
    tabla: {
      idRemision: 'idRemision',
      numeroRemisionCampo: 'numeroRemision',
      numeroRemision: 'Numero remisión',
      fechaRemisionCampo: 'fechaRemision',
      fechaRemision: 'Fecha remisión',
      nombrePacienteCampo: 'nombrePaciente',
      nombrePaciente: 'Paciente',
      planSaludCampo: 'planSalud',
      planSalud: 'Plan',
      estadoRemisionCampo: 'estadoRemision',
      estadoRemision: 'Estado',
      usuarioModificaCampo: 'usuarioModifica',
      usuarioModifica: 'Usuario',
      accion: 'Acción',
      eliminar: 'Eliminar',
      editar: 'Editar',
      noRemisiones: 'No se han agregado remisiones'
    }
  },
  remsionesMedicamentos: {
    titulos: {
      subtitle: 'Aplicación de medicamentos'
    },
    campos: {
      tipoDocumento: 'Tipo documento',
      identificacion: 'Identificación',
      remision: 'Remisión',
      institucionRemitente: 'Institución remitente',
      planSalud: 'Plan de salud',
      estado: 'Estado',
      ciudadPrincipal: 'Ciudad principal',
      fechaInicio: 'Fecha inicio'
    },
    errores: {
      tipoDocumentoRequerido: 'Elige el documento',
      numeroMaximaLongitud: 'Máximo 15 dígitos',
      numeroFormatoInvalido: 'Número inválido'
    },
    botones: {
      buscar: 'Buscar',
      limpiar: 'Limpiar'
    },
    tabla: {
      idRemision: 'idRemision',
      numeroRemisionCampo: 'numeroRemision',
      numeroRemision: 'Numero remisión',
      fechaRemisionCampo: 'fechaRemision',
      fechaRemision: 'Fecha remisión',
      nombrePacienteCampo: 'nombrePaciente',
      nombrePaciente: 'Paciente',
      planSaludCampo: 'planSalud',
      planSalud: 'Plan',
      estadoRemisionCampo: 'estadoRemision',
      estadoRemision: 'Estado',
      usuarioModificaCampo: 'usuarioModifica',
      usuarioModifica: 'Usuario',
      accion: 'Acción',
      eliminar: 'Eliminar',
      editar: 'Editar',
      noRemisiones: 'No se han agregado remisiones'
    }
  },
  detalleRemisionMedicamentos: {
    campos: {
      tratamientos: 'Medicamentos'
    },
    tabla: {
      id: 'id',
      medicamentoCampo: 'medicamentoDescripcion',
      medicamento: 'Medicamento',
      dosisCampo: 'cantidadDosis',
      dosis: 'Dosis',
      viaAdministracionCampo: 'viaAdministracion',
      viaAdministracion: 'Via administración',
      frecuenciaCampo: 'frecuenciaDescripcion',
      frecuencia: 'Frecuencia'
    }
  },

  transporte: {
    informeVehicular: {
      campos: {
        especialidad: 'Especialidad',
        fechaInicio: 'Fecha inicio',
        fechaFin: 'Fecha fin'
      },
      errores: {
        especialidadRequerido: 'Selecciona especialidad'
      },
      botones: {
        descargarInforme: 'Descargar'
      },
      archivo: {
        nombre: 'InformeVehicular'
      }
    }
  },
  informesList: {
    campos: {
      especialidad: 'Informe',
      fechaInicio: 'Fecha inicio',
      fechaFin: 'Fecha fin'
    },
    errores: {
      especialidadRequerido: 'Selecciona un maestro'
    },
    botones: {
      descargarInforme: 'Descargar'
    },
    archivo: {
      nombre: 'Informe'
    },
    paliativos: {
      campos: {
        especialidad: 'Especialidad',
        fechaInicio: 'Fecha inicio',
        fechaFin: 'Fecha fin'
      },
      errores: {
        fechaFinRequerido: 'Fecha fin es requerido'
      },
    }
  },
  errores: {
    cuatro01: 'No estas autorizado para realizar esta operación',
    cuatro03: 'No tienes permisos para acceder',
    cuatro04: 'Ha ocurrido un error, favor intente más tarde',
    cinco00: 'Ha ocurrido un error, favor intente más tarde'
  },

  informes: {
    informeRemisiones: {
      campos: {
        fechaInicio: 'Fecha inicio'
      },
      tabla: {
        noEstados: 'No se presentan estados disponibles',
        totalRegistros: 'Total registros: ',
        estadoCampo: 'estado',
        estado: 'Estado'
      },
      errores: {
        fechaInicioRequerido: 'Ingrese fecha',
        seleccionEstadoRequerido: 'Seleccione al menos un estado a filtrar'
      },
      botones: {
        descargarInforme: 'Descargar'
      },
      archivo: {
        nombre: 'InformeRemisiones'
      },
      titulo: {
        tituloPantalla: 'Informe remisiones'
      }
    },
    informeSeguridad: {
      boton: 'Subir Archivo'
    },

    informeEgreso: {
      todosProgramas: 'Todos',
      ciudad: 'Ciudad',
      programa: 'Programa',
      piso: 'Piso',
      fechaInicio: 'Fecha Inicial',
      fechaFin: 'Fecha Final',
      botones: {
        descargarInforme: 'Descargar Informe',
      },
      tipoAtencion: {
        domiciliario: 'Domiciliario',
        ambulatorio: 'Ambulatorio'
      },
      errores: {
        ciudadRequerida: 'Debve seleccionar una ciudad'
      }
    },
    informeEquiposBiomedicos: {
      todosProgramas: 'Todos',
      estado: 'Estado',
      fechaInicio: 'Fecha Inicial',
      fechaFin: 'Fecha Final',
      botones: {
        descargarInforme: 'Descargar Informe',
      },
      tipoAtencion: {
        domiciliario: 'Domiciliario',
        ambulatorio: 'Ambulatorio'
      },
      errores: {
        ciudadRequerida: 'Debve seleccionar una ciudad'
      }
    },
    informeCuraciones: {
      todosProgramas: 'Todos',
      ciudad: 'Ciudad',
      programa: 'Programa',
      piso: 'Piso',
      fechaInicio: 'Fecha Inicial',
      fechaFin: 'Fecha Final',
      botones: {
        descargarInforme: 'Descargar Informe',
      },
      tipoAtencion: {
        domiciliario: 'Domiciliario',
        ambulatorio: 'Ambulatorio'
      },
      errores: {
        ciudadRequerida: 'Debve seleccionar una ciudad'
      }
    },
  },

  bandejaDinamica: {
    gestionBandejaDinamica: {
      campos: {
        tipoDocumento: 'Tipo documento',
        numeroDocumento: 'Número documento',
        ciudad: 'Ciudad',
        remision: 'Remisión',
        estado: 'Estado',
        usuario: 'Usuario',
        fechaInicio: 'Fecha inicio',
        fechaFin: 'Fecha fin',
      },
      errores: {
        ciudadRequerido: 'Seleccione la ciudad',
        numeroDocumentoMaximaLongitud: 'Máximo 20 caracteres',
        numeroDocumentoInvalido: 'Número de documento inválido',
        remisionMaximaLongitud: 'Máximo 15 caracteres',
        remisionInvalido: 'Número de documento inválido',
        usuarioMaximaLongitud: 'Máximo 15 caracteres',
        usuarioInvalido: 'Número de documento inválido',
        fechaInicioRequerido: 'Ingrese fecha inicio',
        fechaFinRequerido: 'Ingrese fecha fin'
      },
      tabla: {
        nombrePacienteCampo: 'nombrePaciente',
        nombrePaciente: 'Nombre paciente',
        identificacionCampo: 'numeroIdentificacion',
        identificacion: 'Identificación',
        laboratorioCampo: 'laboratorio',
        laboratorio: 'Laboratorio',
        fechaSolicitudCampo: 'fechaSolicitud',
        fechaSolicitud: 'Fecha solicitud',
        fechaTomaMuestraCampo: 'fechaTomaMuestra',
        fechaTomaMuestra: 'Fecha toma muestra',
        usuarioSolicitudCampo: 'usuarioSolicita',
        usuarioSolicitud: 'Usuario solicitud',
        estadoSolicitudCampo: 'estadoSolicitud',
        estadoSolicitud: 'Estado solicitud',
        accion: 'Acción',
        detalle: 'Ver Detalle',
        noAyudasDiagnosticas:
          'No se presentan ayudas diagnósticas relacionadas a los criterios de búsqueda',
        totalRegistros: 'Total registros: '
      },
      titulos: {
        gestionarBandejaDinamica: 'Historial y Gestión'
      },
      botones: {
        limpiar: 'Limpiar',
        buscar: 'Buscar',
        guardarFiltros: 'Guardar filtros',
        gestionar: 'Gestionar',
      },
      mensajesAlerta: {
        errorBandejaDinamica: 'Ha ocurrido un error, favor intente más tarde',
        tituloGestionarBandejaDinamica: 'Gestión de ayudas diagnósticas',
        contenidoGestionarBandejaDinamica:
          '¿Se gestionarán los registros seleccionados y se generará un maestro con el detalle de las ayudas diagnósticas a procesar?',
        exitoGestionBandejaDinamica: 'Se han gestionado los registros exitósamente',
      }
    },

    detalleGestionBandejaDinamica: {
      campos: {
        nombreCompleto: 'Nombre completo',
        tipoDocumento: 'Tipo documento',
        numeroDocumento: 'Número documento',
        equipoBiomedico: 'Equipo biomédico',
        genero: 'Genero',
        direccion: 'Dirección',
        barrio: 'Barrio',
        telefonoContacto: 'Teléfono contácto',
        laboratorio: 'Laboratorio',
        medicoSolicita: 'Médico solicita',
        fechaSolicitud: 'Fecha solicitud',
        fechaProgramacion: 'Fecha programación',
        usuarioSolicita: 'Usuario solicita'
      },
      titulos: {
        detalleAyudaDiagnostica: 'Detalle ayuda diagnóstica'
      },
      errores: {
        fechaInicioRequerido: 'Ingrese fecha',
        fechaFinRequerido: 'Ingrese fecha',
        estadoRequerido: 'Seleccione el estado',
        proveedorRequerido: 'Seleccione el proveedor',
        notaRequerido: 'Ingrese nota'
      },
      botones: {
        cerrar: 'Cerrar'
      }
    }
  },

};
