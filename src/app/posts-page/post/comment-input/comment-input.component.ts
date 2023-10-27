import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CommentsService } from '../comments/comments.service';
import { AuthService } from 'src/app/login-page/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comment-input',
  templateUrl: './comment-input.component.html',
  styleUrls: ['./comment-input.component.css']
})
export class CommentInputComponent implements OnInit, OnDestroy{

  @Input() postId: string;
  commentForm: FormGroup
  user: any;
  private authSub: Subscription;

  constructor (public commentService: CommentsService, public authService: AuthService) { }

  ngOnInit() {
    this.commentForm = new FormGroup({
      content: new FormControl(null)
    });
    this.authSub = this.authService.user.subscribe(
      isAuth => {
        this.user = isAuth
        if (!this.user) {
          this.commentForm.disable()
        } else {
          this.commentForm.enable()
        }
      }
    )
  }

  resizeTextarea() {
    const textarea = document.querySelector('.textarea') as HTMLTextAreaElement;
    textarea.style.height = '20px';
    textarea.style.height = `${textarea.scrollHeight}px`; 
  }
  
  onSaveComment() {
    if (!this.commentForm.value.content) {
      return
    }
    this.commentService.addComment(this.postId, this.user.userId, this.commentForm.value.content)
    this.commentForm.reset()
  }

  getCreatorPhoto() {
    if (!this.user.imagePath) {
      return 'assets/pfp.png'
    }
    return this.user.imagePath
  } 

  ngOnDestroy(): void {
    this.authSub.unsubscribe()
  }
}
