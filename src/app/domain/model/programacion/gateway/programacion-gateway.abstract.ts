import { Observable } from 'rxjs/Observable';
import { Cita } from '../entity/cita.model';


export abstract class ProgramacionGatewayAbstract {

    abstract getProgramacion(idRemision: string): Observable<Cita>;

    abstract getProgramacionEspecialidad(idRemision: string, especialidad: string): Observable<Cita>;

    abstract getProgramacionCuidador(idRemision: string): Observable<any>
    
    abstract guardarRemision(data: any): Observable<string>;;

}