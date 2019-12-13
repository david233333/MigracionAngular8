import {ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';


@Component({
  selector: 'sura-pac-modal',
  templateUrl: './pac-modal.component.html',
  styleUrls: ['./pac-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PacModalComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<PacModalComponent>,
              @Inject(MAT_DIALOG_DATA) public pacDatos: any) { }

  ngOnInit() {
  }

  /**
   * Cierra el modal
   */
  cerrar() {
    const hide = true
    this.dialogRef.close(hide);
  }

}
