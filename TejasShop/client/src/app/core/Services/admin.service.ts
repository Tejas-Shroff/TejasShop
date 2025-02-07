import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductResDto, addProductDTO } from '../Models/catalog';
import { Messages } from 'src/app/constants/messages';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  addProduct(productData: FormData): Observable<any> {
    return this.http.post(
      `${environment.baseApi + '/Catalog/'}product/create`,
      productData
    );
  }

  getAllProducts(): Observable<ProductResDto[]> {
    return this.http.get<ProductResDto[]>(
      `${environment.baseApi + '/Catalog/'}GetAllProducts`
    );
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(
      `${environment.baseApi + '/Catalog/'}product/delete/${productId}`
    );
  }

  updateProduct(
    productId: number,
    product: addProductDTO
  ): Observable<ProductResDto> {
    console.log(
      'API URL:',
      `${environment.baseApi + '/Catalog/'}product/edit/${productId}`
    );
    return this.http.put<ProductResDto>(
      `${environment.baseApi + '/Catalog/'}product/edit/${productId}`,
      product
    );
  }

  getOrderHistory(months: number = 0): Observable<any> {
    const url = `${
      environment.baseApi + '/OrderHistory/get-All_Users-Orders'
    }?months=${months}`;
    return this.http.get<any>(url);
  }

  getAllProductsSorted(sortBy: string): Observable<ProductResDto[]> {
    return this.http
      .get<ProductResDto[]>(`Catalog/product/getall?sortBy=${sortBy}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    return throwError(
      () => new Error(Messages.SomethingBadErrorOccurred)
    );
  }
}
