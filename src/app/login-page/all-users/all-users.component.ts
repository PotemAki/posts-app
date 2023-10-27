import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { mimeType } from 'src/app/posts-page/mime-type.validator';
import { PostsService } from 'src/app/posts-page/posts.service';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit, OnDestroy {
  imagePreview = 'assets/pfp.png'
  allUsers: any;
  user = { email: 'User Deleted', displayName: 'User Deleted'};
  private userId: string;
  private userSub: Subscription

  constructor(public postsService: PostsService, private router: Router, private route: ActivatedRoute, public authService: AuthService) { }
 

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')) {
        this.userId = paramMap.get('userId')
        this.userSub = this.authService.allUsers.subscribe((users) => {
          this.allUsers = users
          this.getUser(this.userId)
        })
        }
      })}

  private getUser(id: string) {
    if (!this.allUsers) {
      return 
    }
    let users = this.allUsers
    for (const user of users) {
        if (user._id === id) {
          if (user.imagePath) {
            this.imagePreview = user.imagePath
          }
          this.user = user
        }      
      }
    }
      
  ngOnDestroy(): void {
    this.userSub.unsubscribe()
  }
  
  }
