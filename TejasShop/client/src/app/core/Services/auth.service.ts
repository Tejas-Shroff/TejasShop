import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  interval,
  map,
  of,
  Subscription,
  switchMap,
} from 'rxjs';
import { LoginReq, LoginResData, RegisterUserData } from '../Models/Auth';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ResponseDto } from '../Models/response';
import { UserDto } from '../Models/user';
import { Router } from '@angular/router';
import { autService_c } from 'src/app/constants/messages';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  hasAdminRole(userData: UserDto) {
    throw new Error('Method not implemented.');
  }
  private isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private userDetail = new BehaviorSubject<UserDto | null | undefined>(
    undefined
  );
  private refreshTokenSubscription: Subscription | null = null;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {}

  isUserLogInObservable() {
    //return this.isUserLoggedIn.value && !this.jwtHelper.isTokenExpired(this.getAccessToken());
    return this.isUserLoggedIn.asObservable();
  }
  UserLoggedIn() {
    return (
      this.isUserLoggedIn.value &&
      !this.jwtHelper.isTokenExpired(this.getAccessToken())
    );
  }

  getLoggedInUserDetail() {
    return this.userDetail.value;
  }
  getLoggedInUserId() {
    return this.userDetail.value?.userId;
  }

  Login(crediential: LoginReq) {
    return this.http
      .post<ResponseDto<LoginResData>>('auth/login', crediential)
      .pipe(
        map((res) => {
          if (res.isSuccessed == true) {
            res.data?.accessToken !== undefined &&
              localStorage.setItem(
                autService_c.accesstoken_a,
                res.data?.accessToken
              );
            res.data?.refreshToken !== undefined &&
              localStorage.setItem(
                autService_c.refreshToken_a,
                res.data?.refreshToken
              );
            this.userDetail.next(res.data?.userData);
            this.isUserLoggedIn.next(true);
            this.startTokenRefresh();
          }
          return res;
        })
      );
  }

  RegisterUser(userData: RegisterUserData) {
    return this.http.post<ResponseDto<null>>('auth/register', userData);
  }

  LogOut() {
    return this.http.get<ResponseDto<null>>('auth/revoke').pipe(
      map((res) => {
        if (res.isSuccessed) {
          this.removeUser();
          this.router.navigateByUrl('/');
        }
        return res;
      })
    );
  }

  LogOutAdminSide() {
    return this.http.get<ResponseDto<null>>('auth/revoke').pipe(
      map((res) => {
        if (res.isSuccessed) {
          this.removeUser();
          this.router.navigateByUrl('/');
        }
        return res;
      })
    );
  }

  refreshUser() {
    const accessToken = localStorage.getItem(autService_c.accesstoken_a);
    const refreshToken = localStorage.getItem(autService_c.refreshToken_a);
  
    return this.http
      .post<ResponseDto<LoginResData>>('auth/refresh', {
        accessToken,
        refreshToken,
      })
      .pipe(
        map((res) => {
          if (res.isSuccessed) {
            if (res.data?.accessToken) {
              localStorage.setItem(autService_c.accesstoken_a, res.data.accessToken);
            }
            if (res.data?.refreshToken) {
              localStorage.setItem(autService_c.refreshToken_a, res.data.refreshToken);
            }
            this.userDetail.next(res.data?.userData);
            if (!this.isUserLoggedIn.getValue()) {
              this.isUserLoggedIn.next(true);
            }
            return true;
          } else {
            this.removeUser();
            return of(false);
          }
        }),
        catchError(() => {
          this.removeUser();
          return of(false);
        })
      );
  }

  startTokenRefresh() {
    if (!this.refreshTokenSubscription && this.UserLoggedIn()) {
      this.refreshTokenSubscription = interval(1000 * 60 * 1000) 
        .pipe(switchMap(() => this.refreshUser()))
        .subscribe({
          error: (err) => {
            this.removeUser();
          },
        });
    }
  }

  stopTokenRefresh() {
    if (this.refreshTokenSubscription) {
      this.refreshTokenSubscription.unsubscribe();
      this.refreshTokenSubscription = null;
    }
  }

  getAccessToken() {
    return localStorage.getItem(autService_c.accesstoken_a);
  }

  getRefreshToken() {
    return localStorage.getItem(autService_c.refreshToken_a);
  }

  private removeUser() {
    localStorage.setItem(autService_c.accesstoken_a, '');
    localStorage.setItem(autService_c.refreshToken_a, '');
    this.isUserLoggedIn.next(false);
    this.userDetail.next(undefined);
    this.stopTokenRefresh();
  }

  setUserRole(role: string) {
    localStorage.setItem(autService_c.userRole_a, role);
  }
}
