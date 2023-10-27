import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AuthData } from "./auth.model";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Router } from "@angular/router";
import { User } from "./user.model";

const BACKEDN_URL = environment.apiUrl

@Injectable({ providedIn: 'root' })
export class AuthService { 
  private isAuth = false;
  private token: string;
  private tokenTimer: any;
  public user = new BehaviorSubject<any>(null);
  public allUsers = new BehaviorSubject<any>(null);

  constructor (private http: HttpClient, public router: Router) { }

  getToken() {
    return this.token
  }
  getIsAuth() { 
    return this.isAuth
  }

  createUser(email: string, displayName: string, password: string) {
    const authData: AuthData = {
      email: email, 
      displayName: displayName,
      password: password
    }

    this.http.post(BACKEDN_URL + '/user/signup', authData)
      .subscribe({
      next: (response) => {
        this.login(email, password)
      }, error: (err) =>{
        this.user.next(null)
      }})
  }
  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    }
    this.http.post<{token: string, expiresIn: number}>(BACKEDN_URL + '/user/login', authData)
      .subscribe({
      next: (response) => {
        const token = response.token
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration)
          this.isAuth = true;
          this.user.next(response);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000)
          this.saveAuthData(token, expirationDate, response);
          this.router.navigate(['/']);
        }
      }, error: () => {
        this.user.next(false)
      }})
  }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuth = true;
      this.setAuthTimer(expiresIn / 1000)
      this.user.next(authInformation.loadedUser)
    }
  }

  logout() {
    this.token = null;
    this.user.next(false);
    clearInterval(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  getUser(userId: string) {
    this.http.get(BACKEDN_URL + '/users/' + userId).subscribe((user) => {
      let newUser = this.user.value
      newUser.displayName = user['displayName']
      if (user['imagePath']) {
        newUser.imagePath = user['imagePath']
      }
      this.user.next(newUser)

      const authInformation = this.getAuthData();
      if (!authInformation) {
        return
      }
      const expiresInDuration = newUser.expiresIn;
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000)
      this.clearAuthData()
      this.saveAuthData(authInformation.token, expirationDate, newUser);
      
    })
  }

  getUsers() {
    this.http.get<{users: any}>(BACKEDN_URL + '/users/')
      .subscribe((users) => {
        this.allUsers.next(users.users)
      })
  }
  

  updateUser(id: string, displayName: string, image: File | string) {
    let userData: AuthData | FormData;
    if (typeof image === 'object' && image) {
      userData = new FormData();
      userData.append('displayName', displayName);
      userData.append('image', image);
    } else {
      userData = {
        displayName: displayName,
        imagePath: image as string,
      }
    }
    this.http.put(BACKEDN_URL + '/users/' + id, userData)
      .subscribe(response => {
        this.getUser(id)
        this.getUsers()
      })
  }
  changePass(id: string, password:string ) {
    const onlyPass = true
    const userData = {
      onlyPass: onlyPass,
      password: password
    }
    this.http.put(BACKEDN_URL + '/users/' + id, userData)
    .subscribe(response => {
      this.getUser(id)
    })
  }
  deleteAccount(userId: string) {
    this.http.delete(BACKEDN_URL + '/users/' + userId).subscribe(()=>{
      this.logout()
    })
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
  private saveAuthData(token: string, expirationDate: Date, response: object) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userData', JSON.stringify(response));
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userData');
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userDataString = localStorage.getItem('userData');
    const userData: {
      displayName: string,
      email: string,
      expiresIn: number,
      token: string,
      userId: string,
      imagePath: string
    } = JSON.parse(userDataString)
    if (!userData) {
      return
    }
    const loadedUser = new User(
      userData.displayName,
      userData.email,
      userData.expiresIn,
      userData.token,
      userData.userId,
      userData.imagePath,
    )
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      loadedUser
    }
  }
}

