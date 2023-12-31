import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../login-page/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../posts-page/posts.service';
import { DialogService } from '../posts-page/dialog.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  showFiller = false;
  user: any;
  allUsers: any;
  isGroup = 'main'
  private isGroupSub: Subscription
  private authSub: Subscription;
  private userSub: Subscription;
  defaultPhoto = 'assets/pfp.png'
  darkMode = true
  private isDarkModeSub: Subscription

  constructor (private authService: AuthService, public postsService: PostsService, private router: Router, private route: ActivatedRoute, public dialogService: DialogService) { }

  ngOnInit() {
    this.user = this.authService.getIsAuth();
    this.authSub = this.authService.user.subscribe(
      isAuth => {
        this.user = isAuth
      }
    )
    this.authService.getUsers()
    this.userSub = this.authService.allUsers.subscribe((users) => {
      this.allUsers = users
    }
    )
    this.isGroupSub = this.postsService.groupActive.subscribe((res) =>{
      this.isGroup = res
    })
    this.isDarkModeSub = this.postsService.darkMode.subscribe((res) =>{
      this.darkMode = res
    })
  }
  toLogin() {
    this.router.navigate(['/login'])
  }
  toLogout() {
    this.authService.logout()
  }
  toSettings() {
    this.router.navigate(['/settings'])
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
  custom() {
    if (!this.darkMode) {
      return 'custom2'
    }
    if (this.darkMode) {
      return 'custom1'
    }
  }
  changeView() {
    if (this.darkMode) {
      this.postsService.darkMode.next(false)
      localStorage.removeItem('darkMode')
      localStorage.setItem('darkMode', 'false')
    } else {
      this.postsService.darkMode.next(true)
      localStorage.removeItem('darkMode')
      localStorage.setItem('darkMode', 'true')
    }
  }
  openInfo() {
    this.dialogService.openDialog({});
  }
  ngOnDestroy() {
    this.authSub.unsubscribe()
    this.userSub.unsubscribe()
    this.isGroupSub.unsubscribe()
    this.isDarkModeSub.unsubscribe()
  }
}