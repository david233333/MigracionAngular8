import {EstadosRemisionEnum} from '../../../../shared/utils/enums/estados-remision.enum';

export interface Estado {

  tipoEstado(): EstadosRemisionEnum;

}
