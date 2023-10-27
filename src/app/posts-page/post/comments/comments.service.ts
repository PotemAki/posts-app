import { Injectable } from "@angular/core";
import { CommentModel } from "./comment.model";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { PostsService } from "../../posts.service";
import { BehaviorSubject, map } from "rxjs";

const BACKEDN_URL = environment.apiUrl + '/comments/'

@Injectable({ providedIn: 'root' })
export class CommentsService { 
  private comments: CommentModel[] = [];
  public commentsUpdated = new BehaviorSubject<CommentModel[]>([]);;

  constructor(private http: HttpClient, private router: Router, private postService: PostsService) {}

  getComments() {
    this.http.get<{message: string, comments: any}>(BACKEDN_URL)
      .pipe(map((commentData) => {
        return commentData.comments.map(comment =>{
          return {
            id: comment._id,
            commentCreatorName: comment.commentCreatorName,
            commentContent: comment.commentContent,
            postId: comment.postId,
            commentDate: comment.commentDate,
            commentEditDate: comment.commentEditDate
          }
        })
      }))
      .subscribe((transformedComments) => {
        this.comments = transformedComments
        this.commentsUpdated.next([...this.comments]);
      })
  }
  getComment(commentId: string) {
    return this.http.get<{
      id: string;
      postId: string
      commentCreatorName: string;
      commentContent: string;
      commentDate: string;
      commentEditDate: string;
    }>(BACKEDN_URL + commentId);
  }

  addComment(postId: string, commentCreatorName: string, commentContent: string) { 
    const nowDate = new Date()
    const stringDate = nowDate.toString()
    let comment: CommentModel
    comment = {
      postId: postId,
      commentCreatorName: commentCreatorName,
      commentContent: commentContent,
      commentDate: stringDate,
    }
    this.http.post<{ message: string, comments: CommentModel }>(BACKEDN_URL, comment)
      .subscribe((response) => {
        this.getComments()
      })
    
  }

  updateComment(id: string, postId: string, content: string, creatorName: string, commentDate: string) {
    const nowDate = new Date()
    const stringDate = nowDate.toString()
    let commentData: CommentModel;
    commentData = {
        id: id,
        postId: postId,
        commentContent: content,
        commentCreatorName: creatorName,
        commentDate: commentDate,
        commentEditDate: stringDate,
      }
    this.http.put(BACKEDN_URL + id, commentData)
      .subscribe(response => { 
        this.router.navigate([''])
      })
  }
  deleteComment(id: string) {
    this.http.delete(BACKEDN_URL + id)
      .subscribe((res)=>{
        this.getComments()
      })
  }
}


  
  