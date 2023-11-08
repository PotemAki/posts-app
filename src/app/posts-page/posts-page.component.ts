import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostsService } from './posts.service';


@Component({
  selector: 'app-posts-page',
  templateUrl: './posts-page.component.html',
  styleUrls: ['./posts-page.component.css']
})
export class PostsPageComponent implements OnInit, OnDestroy  {
  darkMode = false
  private isDarkModeSub: Subscription

  constructor(public postsService: PostsService) { }

  ngOnInit() {
    this.isDarkModeSub = this.postsService.darkMode.subscribe((res) =>{
      this.darkMode = res
    })
  }
 
  ngOnDestroy() {
    this.isDarkModeSub.unsubscribe()
  }
}
