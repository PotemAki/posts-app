import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../login-page/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../posts-page/posts.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  showFiller = false;
  user: any;
  allUsers: any;
  private authSub: Subscription;
  private userSub: Subscription;
  defaultPhoto = 'assets/pfp.png'

  constructor (private authService: AuthService, public postsService: PostsService, private router: Router, private route: ActivatedRoute,) { }

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

  ngOnDestroy() {
    this.authSub.unsubscribe()
    this.userSub.unsubscribe()
  }
}