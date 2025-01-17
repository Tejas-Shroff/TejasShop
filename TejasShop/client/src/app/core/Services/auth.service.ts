import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, interval, map, Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { LoginReq, LoginResData, RegisterUserData } from '../Models/Auth';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ResponseDto } from '../Models/response';
import { UserDto } from '../Models/user';
import { Router } from '@angular/router';

import { addProductDTO, ProductResDto } from '../Models/catalog';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isUserLoggedIn:BehaviorSubject<boolean>= new BehaviorSubject(false);
  private userDetail=new BehaviorSubject<UserDto|null|undefined>(undefined);
  private refreshTokenSubscription: Subscription | null = null;
  private addproducturl = 'http://localhost:5129/api/Catalog/product';
  private apiUrl = 'http://localhost:5129/api/Catalog/GetAllProducts';
  private deleteproductUrl = 'http://localhost:5129/api/Catalog/product/delete';
  private baseUrl = 'http://localhost:5129/api/Catalog';
  private orderhistoryURL = 'http://localhost:5129/api/OrderHistory/get-All_Users-Orders';
  

  constructor(
    private http:HttpClient,
    private jwtHelper:JwtHelperService,
    private router:Router
  ) { }

  isUserLogInObservable(){
    //return this.isUserLoggedIn.value && !this.jwtHelper.isTokenExpired(this.getAccessToken());
    return this.isUserLoggedIn.asObservable();
  }
  UserLoggedIn(){
    return this.isUserLoggedIn.value && !this.jwtHelper.isTokenExpired(this.getAccessToken());
  }

  getLoggedInUserDetail(){
    return this.userDetail.value;
  }
  getLoggedInUserId(){
    return this.userDetail.value?.userId;
  }

  Login(crediential:LoginReq){
      return this.http.post<ResponseDto<LoginResData>>('auth/login',crediential).pipe(
        map((res)=>{
            if(res.isSuccessed==true){
              res.data?.accessToken!==undefined && localStorage.setItem('accestoken',res.data?.accessToken);
              res.data?.refreshToken!==undefined && localStorage.setItem('refreshtoken',res.data?.refreshToken);
              this.userDetail.next(res.data?.userData);
              this.isUserLoggedIn.next(true);
              this.startTokenRefresh();

            }
            return res;
        })
      )
  }

  RegisterUser(userData:RegisterUserData){
    return this.http.post<ResponseDto<null>>('auth/register',userData);
  }

  LogOut(){
    return this.http.get<ResponseDto<null>>('auth/revoke').pipe(
      map((res)=>{
        if(res.isSuccessed){
          this.removeUser();
          this.router.navigateByUrl('/');
        }
        return res;
      })
    );

  }

  LogOutAdminSide(){
    return this.http.get<ResponseDto<null>>('auth/revoke').pipe(
      map((res)=>{
        if(res.isSuccessed){
          this.removeUser();
          this.router.navigateByUrl('/auth/login');
        }
        return res;
      })
    );

  }

  refreshUser() {
    var accessToken = localStorage.getItem('accestoken');
    var refreshToken = localStorage.getItem('refreshtoken');

    return this.http.post<ResponseDto<LoginResData>>('auth/refresh', {
      accessToken,
      refreshToken
    }).pipe(
      map((res) => {
        if (res.isSuccessed == true) {
          res.data?.accessToken!==undefined && localStorage.setItem('accestoken',res.data?.accessToken);
          res.data?.refreshToken!==undefined && localStorage.setItem('refreshtoken',res.data?.refreshToken);
          this.userDetail.next(res.data?.userData)
          if(!this.isUserLoggedIn.getValue()) this.isUserLoggedIn.next(true);
          return true;
        }
        else{
          this.removeUser();
          return of(false);

        }
      }),
      catchError(()=>{
        this.removeUser();
        return of(false);
      })
    )

  }

  startTokenRefresh() {
    if (!this.refreshTokenSubscription && this.UserLoggedIn()) {
      this.refreshTokenSubscription = interval(1000 * 60 * 1000) // Refresh every 1000 minutes
        .pipe(
          switchMap(() => this.refreshUser())
        )
        .subscribe({
          next: (token) => {
            console.log('Token refreshed:', token);
          },
          error: (err) => {
            console.error('Token refresh failed:', err);
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

  getAccessToken(){
    return localStorage.getItem('accestoken')
  }

  getRefreshToken(){
    return localStorage.getItem('refreshtoken')
  }

  private removeUser(){
    localStorage.setItem('accestoken','');
    localStorage.setItem('refreshtoken','');
    this.isUserLoggedIn.next(false);
    this.userDetail.next(undefined);
    this.stopTokenRefresh();
  }

  setUserRole(role: string) {
    localStorage.setItem('userRole', role);
  }

  // addProduct(product: addProductDTO): Observable<ResponseDto<null>> {
  //   return this.http.post<ResponseDto<null>>(this.addproducturl, product);
  
  // addProduct(product: addProductDTO): Observable<ProductResDto> {
  //   const params = new HttpParams()
  //     .set('Name', product.name)
  //     .set('Description', product.description)
  //     .set('OriginalPrice', product.originalPrice.toString())
  //     .set('StockQuantity', product.stockQuantity.toString())
  //     .set('CategoryId', product.categoryId.toString())
  //     .set('BrandId', product.brandId.toString());
  //   return this.http.post<ProductResDto>(`${this.addproducturl}/create`, null, { params });
  // }

  // addProduct(product: addProductDTO, thumbnailFile: File) : Observable<any> {
  //   const formData = new FormData();
  //   formData.append('Name', product.name);
  //   formData.append('Description', product.description);
  //   formData.append('OrginalPrice', product.originalPrice.toString());
  //   formData.append('StockQuantity',product.stockQuantity.toString());
  //   formData.append('CategoryId', product.categoryId.toString());
  //   formData.append('BrandId', product.brandId.toString());
  //   formData.append('Thumbnail', thumbnailFile);

  //   return this.http.post<ProductResDto>(`${this.addproducturl}/create`, formData);

  // }


  addProduct(productData: FormData): Observable<any> {
    return this.http.post(`${this.addproducturl}/create`, productData);
  }

  getAllProducts(): Observable<ProductResDto[]> {
    return this.http.get<ProductResDto[]>(this.apiUrl);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.deleteproductUrl}/${productId}`);
  }

  updateProduct(productId: number, product: addProductDTO): Observable<ProductResDto> {
    return this.http.put<ProductResDto>(`${this.addproducturl}/edit/${productId}`, product);
  }

  getOrderHistory(): Observable<any> {
    return this.http.get<any>(this.orderhistoryURL);
  }




  
}
