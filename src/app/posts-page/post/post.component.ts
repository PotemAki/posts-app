import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from '../mime-type.validator';
import { AuthService } from 'src/app/login-page/auth.service';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit, OnDestroy {
  mode = '';
  message = '';
  isTimeOut: any;
  selectedPostId: string;
  currentEdit: Post
  editForm: FormGroup
  imagePreview: string;
  private postId: string;
  posts: Post[] = [];
  filteredPosts: any[];
  private postsSub: Subscription;
  isLiked = false;
  user: any;
  private authSub: Subscription
  allUsers: any;
  private userSub: Subscription;
  isGroup = 'main'
  private isGroupSub: Subscription
  darkMode = false
  private isDarkModeSub: Subscription


  constructor(public postsService: PostsService, private router: Router, private route: ActivatedRoute, public authService: AuthService) { }
 
  ngOnInit() {
    this.authSub = this.authService.user.subscribe(
      isAuth => {
        this.user = isAuth
      }
    )
    this.editForm = new FormGroup({
      content: new FormControl(null),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
    this.postsService.getPosts()
    this.postsSub = this.postsService.postsUpdated
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.filterPostsByGroup()
      })
    
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit'
        this.postId = paramMap.get('postId')
        this.postsService.getPost(this.postId).subscribe(postData => {
          const likesArray: {
            userId: string 
          } = JSON.parse(postData.likesArray)
          this.currentEdit = {
            id: postData.id,
            creatorName: postData.creatorName,
            content: postData.content,
            postDate: postData.postDate,
            imagePath: postData.imagePath,
            likes: postData.likes,
            likesArray: likesArray
          };
          this.editForm.setValue({
            content: this.currentEdit.content,
            image: this.currentEdit.imagePath
          })
          this.imagePreview = this.currentEdit.imagePath
        })
      }
    })
    this.authService.getUsers()
    this.userSub = this.authService.allUsers.subscribe((users) => {
      this.allUsers = users
    }
    )
    this.filterPostsByGroup()
    this.isGroupSub = this.postsService.groupActive.subscribe((res) => {
      this.isGroup = res
      this.filterPostsByGroup()
    })
    this.isDarkModeSub = this.postsService.darkMode.subscribe((res) =>{
      this.darkMode = res
    })
  }
  isPostId(id:string) {
    if (this.postId === id ) {
      return true
    } else {
      return false
    }
  }
  onEdit(postId:string) {
    this.router.navigate(['/edit', postId], {relativeTo: this.route})
  }

  onDelete(postId) {
    this.postsService.deletePost(postId)
  }
  onSavePost() {
    if (!this.editForm.value.content || ((this.editForm.value.content === this.currentEdit.content) && (this.currentEdit.imagePath === this.imagePreview))) {
      console.log(this.editForm)
      this.router.navigate([''])
      return;
    }
    const nowDate = new Date()
    const stringDate = nowDate.toString()
    const likeUpdate = false
    this.postsService.updatePost(
      this.postId, 
      this.editForm.value.content, 
      this.currentEdit.creatorName,
      this.currentEdit.postDate,
      stringDate,
      this.editForm.value.image,
      this.currentEdit.likes,
      likeUpdate,
      JSON.stringify(this.currentEdit.likesArray)
      );
  }
  onCancel() {
    this.imagePreview = '';
    this.router.navigate([''])
  }

  openImagePopup(postId: string) {
    this.selectedPostId = postId;
  }
  getPostImage(postId) {
    if (postId !== null) {
      const selectedPost = this.posts.find(post => post.id === postId);
      return selectedPost ? selectedPost.imagePath : null;
    }
    return null;
  }
  closeImagePopup() {
    this.selectedPostId = null
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.editForm.patchValue({image: file});
    this.editForm.get('image').updateValueAndValidity
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string
    }
    reader.readAsDataURL(file)
  }
  deleteEditedImage() {
    this.imagePreview = '';
    this.editForm.value.image = '';
  }
  likeButton(likes: string, id: string, content: string, creatorName: string, postDate: string, editDate:string , imagePath: string, likesArray: string[]) {

    if (!this.user) {
      this.infoTimeout('Please login to add likes!')
      return
    }
    let newLikes = +likes
    if (this.isUserLiked(likesArray)) {
      newLikes = newLikes - 1
      likesArray = likesArray.filter((name) => name !== this.user.userId)
    } else {
      newLikes = newLikes + 1
      if (!likesArray) {
        likesArray = []
      }
      likesArray.push(this.user.userId)
    }
    const updatedLikes = newLikes.toString()
    const likeUpdate = true
    this.postsService.updatePost(id, content, creatorName, postDate, editDate, imagePath, updatedLikes, likeUpdate, JSON.stringify(likesArray));
  }

  infoTimeout(text: string) {
    this.message = text
    clearTimeout(this.isTimeOut)
    this.isTimeOut = setTimeout(() => {
    this.message = '';
  }, 1000);
  }

  isUserLiked(likesArray: string[]) {
    for (const likes of likesArray) { 
      if (likes === this.user?.userId) {
        return true
      }
    }
  }

  returnLikesList(likesArray: string[]) {
    if (!this.allUsers) {
      return
    }
    let users = this.allUsers
    let list = {}
    for (const user of users) { 
      list[user._id] = user.displayName
    }
    const displayName = likesArray.map((_id) => list[_id])
    return `Liked by: ${displayName.join(', ')}`
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

  filterPostsByGroup(){
    this.filteredPosts = this.posts.filter(post => post.group === this.isGroup);
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
    this.postsSub.unsubscribe()
    this.authSub.unsubscribe()
    this.userSub.unsubscribe()
    this.isGroupSub.unsubscribe()
    this.isDarkModeSub.unsubscribe()
  }
  
}

