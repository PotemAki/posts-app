import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommentModel } from './comment.model';
import { CommentsService } from './comments.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/login-page/auth.service';
import { PostsService } from '../../posts.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, OnDestroy {
  @Input() postId: string;
  comments: CommentModel[] = [];
  private commentId: string;
  currentEdit: CommentModel
  editCommentForm: FormGroup
  allUsers: any;
  user: any;
  private userSub: Subscription;
  private authSub: Subscription;
  private commentsSub: Subscription;
  darkMode = false
  private isDarkModeSub: Subscription


  constructor(public commentService: CommentsService, private router: Router, private route: ActivatedRoute, public authService: AuthService, public postsService: PostsService) { }
  
  ngOnInit() {
    this.editCommentForm = new FormGroup({
      content: new FormControl(null)
    });
    this.commentService.getComments()
    this.commentsSub = this.commentService.commentsUpdated
      .subscribe((comments: CommentModel[]) => {
        this.comments = comments;
      })
    this.authSub = this.authService.user.subscribe(
      isAuth => {
        this.user = isAuth
      }
    )
    this.userSub = this.authService.allUsers.subscribe((users) => {
      this.allUsers = users
    })
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('commentId')) {
        this.commentId = paramMap.get('commentId')
        this.commentService.getComment(this.commentId).subscribe(commentData => {
          this.currentEdit = {
            id: commentData.id,
            postId: commentData.postId,
            commentCreatorName: commentData.commentCreatorName,
            commentContent: commentData.commentContent,
            commentDate: commentData.commentDate,
          };
          this.editCommentForm.setValue({
            content: this.currentEdit.commentContent
          })
        })
      }
    })
    this.isDarkModeSub = this.postsService.darkMode.subscribe((res) =>{
      this.darkMode = res
    })
    }

  isPostId(id:string) {
    if (this.commentId === id ) {
      return true
    } else {
      return false
    }
  }
  resizeTextarea() {
    const textarea = document.querySelector('.textarea') as HTMLTextAreaElement;
    textarea.style.height = '20px';
    textarea.style.height = `${textarea.scrollHeight}px`; 
  }

  onEdit(id: string) {
    this.router.navigate(['/comment', id], {relativeTo: this.route})
  }
  onSavePost() {
    if (!this.editCommentForm.value.content || ((this.editCommentForm.value.content === this.currentEdit.commentContent))) {
      console.log(this.editCommentForm)
      this.router.navigate([''])
      return;
    }
    this.commentService.updateComment(
      this.commentId,
      this.currentEdit.postId,
      this.editCommentForm.value.content, 
      this.currentEdit.commentCreatorName,
      this.currentEdit.commentDate,
      );
  }
  onDelete(id: string) {
    this.commentService.deleteComment(id)
  }
  onCancel() {
    this.router.navigate([''])
  }

  getCreatorName(creator: string) {
    if (!this.allUsers) {
      return 'Guest'
    }
    let users = this.allUsers
    for (const user of users) {
      if (user._id === creator) {
        return user.displayName
      }
    }
  } 

  getCreatorPhoto(creator: string) {
    if (!this.allUsers) {
      return
    }
    let users = this.allUsers

    for (const user of users) {
      if (user._id === creator) {
        if (!user.imagePath) {
          return 'assets/pfp.png'
        }
        return user.imagePath
      }
    }
  } 

  isAuthShowButton(creator: string) {
    if (!this.user) {
      return false
    }
    if (creator === this.user.userId) {
      return true
    }
  }
  toUser(userId: string) {
    if (!this.allUsers || !userId) {
      return 
    }
    let users = this.allUsers
    for (const user of users) {
      if (user._id === userId) {
        this.router.navigate(['/checkUser', userId], {relativeTo: this.route})
      }
    }
  }
  custom() {
    if (!this.darkMode) {
      return 'custom2'
    }
    if (this.darkMode) {
      return 'custom1'
    }
  }

  ngOnDestroy() {
    this.commentsSub.unsubscribe()
    this.userSub.unsubscribe()
    this.authSub.unsubscribe()
    this.isDarkModeSub.unsubscribe()
  }
}
