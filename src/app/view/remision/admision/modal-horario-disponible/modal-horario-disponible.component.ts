import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { $ } from 'protractor';
import { LocalStorage } from '@ngx-pwa/local-storage';




@Component({
  selector: 'sura-modal-horario-disponible',
  templateUrl: './modal-horario-disponible.component.html',
  styleUrls: ['./modal-horario-disponible.component.scss']
})
export class ModalHorarioDisponibleComponent implements OnInit {

  @Input() public disponibilidad;

  rangos: any[];
  constructor(private dialogRef: MatDialogRef<ModalHorarioDisponibleComponent>) { }
 
  ngOnInit() {
    this.rangos = this.disponibilidad.rangos;
    
  }

 dismiss(){
    this.dialogRef.close(null)
  }

  save(valor:any){
  console.log("Valor recibido ", valor)

  localStorage.setItem("rango" , JSON.stringify(valor));
  localStorage.setItem("ticket" , this.disponibilidad.bookingID);
  this.dialogRef.close(null)
  }

}