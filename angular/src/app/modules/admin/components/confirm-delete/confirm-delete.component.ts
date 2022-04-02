import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss']
})
export class ConfirmDeleteComponent implements OnInit {

  @Output() onDelete = new EventEmitter<any>();

  constructor(private dialogRef: MatDialogRef<ConfirmDeleteComponent>) { }

  ngOnInit(): void {
  }

  delete(){
    this.onDelete.emit()
    this.dialogRef.close();
  }
  cancel(){
    this.dialogRef.close();
  }

}
