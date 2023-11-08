import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/login-page/auth.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-side-part',
  templateUrl: './side-part.component.html',
  styleUrls: ['./side-part.component.css']
})
export class SidePartComponent implements OnInit, OnDestroy {
  isGroup = 'main'
  private isGroupSub: Subscription
  allUsers: any;
  user: any;
  private authSub: Subscription
  private userSub: Subscription;
  darkMode = false
  private isDarkModeSub: Subscription

  constructor(public postsService: PostsService, public authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.user = this.authService.getIsAuth();
    this.authSub = this.authService.user.subscribe(
      isAuth => {
        this.user = isAuth
      }
    )
    this.userSub = this.authService.allUsers.subscribe((users) => {
      this.allUsers = users
    })
    this.isGroupSub = this.postsService.groupActive.subscribe((res) =>{
      this.isGroup = res
    })
    this.isDarkModeSub = this.postsService.darkMode.subscribe((res) =>{
      this.darkMode = res
    })
  }
  isUserActive(id: string) {
    if (!this.user) {
      return false
    }
    if (id === this.user.userId) {
      return true
    } else {
      return false
    }
  }
  checkMember(id: string){
    this.router.navigate(['/checkUser', id], {relativeTo: this.route})
  }

  toMain() {
    this.isGroup = 'main'
    this.postsService.groupActive.next('main')
  }
  toGroup1() {
    this.isGroup = 'group1'
    this.postsService.groupActive.next('group1')
  }
  toGroup2() {
    this.isGroup = 'group2'
    this.postsService.groupActive.next('group2')
  }
  toGroup3() {
    this.isGroup = 'group3'
    this.postsService.groupActive.next('group3')
  }

  ngOnDestroy(): void {
    this.isGroupSub.unsubscribe()
    this.authSub.unsubscribe()
    this.userSub.unsubscribe()
    this.isDarkModeSub.unsubscribe()
  }
}
