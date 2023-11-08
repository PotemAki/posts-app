import { Component, OnInit } from '@angular/core';
import { AuthService } from './login-page/auth.service';
import { PostsService } from './posts-page/posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'posts-app';

  constructor(private authService: AuthService, public postsService: PostsService) { }

  ngOnInit() {
    this.authService.autoAuthUser();
    this.postsService.autoDarkMode();
  }
}
