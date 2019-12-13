import {NbMenuItem} from '@nebular/theme';

import {mensajes} from '../../utils/mensajes';

/**
 * Define el menu, su jerarquia, y la ruta a direccionar
 */
export const menuItems: NbMenuItem[] = [
  {
    title: mensajes.menu.inicio,
    icon: 'nb-home',
    link: '/',
    home: true
  },
  {
    title: mensajes.menu.remision,
    icon: 'nb-keypad',
    link: '/',
    children: [
      {
        title: mensajes.menu.crear,
        link: '/remision/nueva'
      },
      {
        title: mensajes.menu.listarRemision,
        link: '/remision/listar-remisiones'
      }
    ]
  },
  {
    title: mensajes.menu.novedad,
    icon: 'nb-keypad',
    link: '/',
    children: [
      {
        title: mensajes.menu.crear,
        link: '/novedad/nueva'
      },
      {
        title: mensajes.menu.gestionarNovedades,
        link: '/novedad/gestionar-novedades'
      },
      {
        title: mensajes.menu.gestionarPacientes,
        link: '/novedad/gestionar-pacientes'
      },
      {
        title: mensajes.menu.historialPlanManejo,
        link: '/novedad/historial-plan-manejo'
      }
    ]
  },
  {
    title: mensajes.menu.lineaUnica,
    icon: 'nb-keypad',
    link: '/',
    hidden: false,
    children: [
      {
        title: mensajes.menu.listaLineaUnica,
        link: '/lineaunica/lista-linea-unica'
      }
    ]
  },
  {
    title: mensajes.menu.equiposBiomedicos,
    icon: 'nb-keypad',
    link: '/',
    children: [
      {
        title: mensajes.menu.historialGestionEquiposBiomedicos,
        link: '/equiposbiomedicos/historial-gestion'
      }
    ]
  },
  {
    title: mensajes.menu.ambulatorio,
    icon: 'nb-keypad',
    link: '/',
    children: [
      {
        title: mensajes.menu.bebecanguro,
        link: '/ambulatorio/bebe-Canguro'
      },
      {
        title: mensajes.menu.aplicacionMedicamentos,
        link: '/ambulatorio/aplicacion-medicamentos'
      }
    ]
  },
  {
    title: mensajes.menu.bandejaDinamica,
    icon: 'nb-keypad',
    link: '/',
    hidden: false,
    children: [
      {
        title: mensajes.menu.historialGestionBandejaDinamica,
        link: '/bandejadinamica/historial-gestion'
      }
    ]
  },
  {
    title: mensajes.menu.informes.title,
    icon: 'nb-keypad',
    link: '/informes/crear-informes'
  },
  {
    title: mensajes.menu.maestros,
    icon: 'nb-keypad',
    link: '/maestros/gestionar-maestros'
  }
];
