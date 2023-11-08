import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DetailsComponent } from './details/details.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(public dialog: MatDialog) {}

  openDialog(data: any): void {
    this.dialog.open(DetailsComponent, {
      width: '80%',
      maxWidth: '800px'
  });
}
}