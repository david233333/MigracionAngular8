import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModalConfirmacionViewModel } from './modal-confirmacion.view-model';
import { ModalConfirmacion } from '../../models/modal-confirmacion.model';


@Component({
    selector: 'sura-modal-confirmacion',
    templateUrl: './modal-confirmacion.component.html',
    styleUrls: ['./modal-confirmacion.component.scss']
})
export class ModalConfirmacionComponent implements OnInit {

    public modalconfirmacionViewModel: ModalConfirmacionViewModel = this.iniciarViewModel();
    public tituloVentana: string;
    public contenidoVentana: string;

    constructor(private dialogRef: MatDialogRef<ModalConfirmacionComponent>,
        @Inject(MAT_DIALOG_DATA) private data: ModalConfirmacion) {
        this.tituloVentana = data.tituloVentana;
        this.contenidoVentana = data.contenidoVentana;
    }

    ngOnInit() {
    }

    /**
     * Inicializa variables del view entity
     */
    private iniciarViewModel(): ModalConfirmacionViewModel {
    return new ModalConfirmacionViewModel(
            null,
        );
    }

    /**
     * Cancela y cierra el modal
     */
    public cancelar(): void {
        this.dialogRef.close(false);
    }

    /**
     * Acepta y cierra el modal
     */
    public aceptar(): void {
        this.dialogRef.close(true);
    }
}
