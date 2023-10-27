import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsPageComponent } from './posts-page/posts-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthGuard } from './login-page/auth.guard';
import { SettingsComponent } from './login-page/settings/settings.component';
import { AllUsersComponent } from './login-page/all-users/all-users.component';

const routes: Routes = [
  { path: '', component: PostsPageComponent },
  { path: 'edit/:postId', component: PostsPageComponent, canActivate: [AuthGuard] },
  { path: 'comment/:commentId', component: PostsPageComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginPageComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'checkUser/:userId', component: AllUsersComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
