import { MatDialogRef } from '@angular/material';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sura-modal-edicion-novedades',
  templateUrl: './modal-edicion-novedades.component.html',
  styleUrls: ['./modal-edicion-novedades.component.scss']
})
export class ModalEdicionNovedadesComponent implements OnInit {

  constructor( private dialogRef: MatDialogRef<ModalEdicionNovedadesComponent>) { }

  ngOnInit() {
  }

  dismiss(){
    this.dialogRef.close('closed')
  }

  save(){
    this.dialogRef.close('saved')
  }

  
  
}
