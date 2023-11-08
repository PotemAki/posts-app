import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy{
  darkMode = true
  private isDarkModeSub: Subscription
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DetailsComponent>,
    public postsService: PostsService
  ) {}
  ngOnInit() {
    this.isDarkModeSub = this.postsService.darkMode.subscribe((res) =>{
      this.darkMode = res
    })
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  ngOnDestroy() {
    this.isDarkModeSub.unsubscribe()
  }
}
