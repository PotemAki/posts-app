import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Subject, map } from "rxjs";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";


const BACKEDN_URL = environment.apiUrl + '/posts/'

@Injectable({ providedIn: 'root' })
export class PostsService { 
  private posts: Post[] = [];
  public postsUpdated = new BehaviorSubject<Post[]>([]);
  public groupActive = new BehaviorSubject<string>('main');
  public darkMode = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient, private router: Router) {}

  autoDarkMode() {
    const autoDarkMode = localStorage.getItem('darkMode')
    if (!autoDarkMode) {
      return
    }
    if (autoDarkMode === 'true') {
      this.darkMode.next(true)
    } else {
      this.darkMode.next(false)
    }
    
  }

  getPosts() {
    this.http.get<{message: string, posts: any}>(BACKEDN_URL)
      .pipe(map((postData) => {
        return postData.posts.map(post =>{
          const likesArray: {
            userId: string
          } = JSON.parse(post.likesArray)
          return {
            creatorName: post.creatorName,
            content: post.content,
            id: post._id,
            postDate: post.postDate,
            editDate: post.editDate,
            imagePath: post.imagePath,
            likes: post.likes,
            creator: post.creator,
            likesArray: likesArray,
            creatorImage: post.creatorImage,
            group: post.group
          }
        })
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts
        this.posts.reverse()
        this.postsUpdated.next([...this.posts]);
      })
  }
  
  getPost(postId: string) {
    return this.http.get<{
      id: string;
      creatorName: string;
      content: string;
      postDate: string;
      editDate: string;
      imagePath?: string;
      likes: string;
      likesArray: string;
      group: string;
    }>(BACKEDN_URL + postId);
  }

  addPost(creatorName: string, content: string, image: File, creatorImage: string, group: string) {
    const nowDate = new Date()
    const stringDate = nowDate.toString()
    const likes = '0';
    const likesArray = []
    const postData = new FormData();
    postData.append('creatorName', creatorName);
    postData.append('content', content);
    postData.append('postDate', stringDate);
    postData.append('likes', likes);
    postData.append('likesArray', JSON.stringify(likesArray));
    postData.append('creatorImage', creatorImage);
    postData.append('group', group)
    if (image) {
      postData.append('image', image, creatorName);
    }
    
    this.http.post<{ message: string, post: Post }>(BACKEDN_URL, postData)
      .subscribe(
        (responseData) => {
          this.getPosts()
      },
      )
  } 

  updatePost(id: string, content: string, creatorName: string, postDate: string, editDate: string, image: File | string, likes: string, likeUpdate: boolean, likesArray: string) {
    let postData: Post | FormData;
    if (typeof image === 'object' && image) {
      postData = new FormData();
      postData.append('id', id);
      postData.append('creatorName', creatorName);
      postData.append('content', content);
      postData.append('postDate', postDate);
      postData.append('editDate', editDate);
      postData.append('image', image, creatorName);
      postData.append('likes', likes);
      postData.append('likesArray', likesArray)
    } else {
      postData = {
        id: id,
        content: content,
        creatorName: creatorName,
        postDate: postDate,
        editDate: editDate,
        imagePath: image as string,
        likes: likes,
        likeUpdate: likeUpdate,
        likesArray: likesArray
      }
    }
    this.http.put(BACKEDN_URL + id, postData)
      .subscribe(response => { 
        this.getPosts()
        this.router.navigate([''])
      })
  }
  

  deletePost(postId: string) {
    this.http.delete(BACKEDN_URL +  postId)
      .subscribe(()=>{
        this.getPosts()
      })
  }
}