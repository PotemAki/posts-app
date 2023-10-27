import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule } from '@angular/material/sidenav';
import {MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion'
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatChipsModule} from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { PostsPageComponent } from './posts-page/posts-page.component';
import { InputComponent } from './posts-page/input/input.component';
import { PostComponent } from './posts-page/post/post.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommentsComponent } from './posts-page/post/comments/comments.component';
import { CommentInputComponent } from './posts-page/post/comment-input/comment-input.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthInterceptor } from './login-page/auth-interceptor';
import { SettingsComponent } from './login-page/settings/settings.component';
import { AllUsersComponent } from './login-page/all-users/all-users.component';
import { ErrorComponent } from './login-page/error/error.component';
import { ErrorInterceptor } from './login-page/error.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PostsPageComponent,
    InputComponent,
    PostComponent,
    CommentsComponent,
    CommentInputComponent,
    LoginPageComponent,
    SettingsComponent,
    AllUsersComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatInputModule,
    MatExpansionModule,
    MatCardModule,
    MatTooltipModule,
    MatChipsModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
