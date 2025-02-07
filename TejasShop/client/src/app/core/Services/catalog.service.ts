import { Injectable } from '@angular/core';
import { ResponseDto } from '../Models/response';
import {
  BrandResDto,
  CategoryResDto,
  ProductFilters,
  ProductResDto,
} from '../Models/catalog';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  constructor(private http: HttpClient) {}

  searchProducts(params: { search: string }): Observable<ProductResDto[]> {
    return this.http.get<ProductResDto[]>(
      `Catalog/product/getall?Search=${params.search}`
    );
  }
  getCategories() : Observable<ResponseDto<CategoryResDto[]>> {
    return this.http.get<ResponseDto<CategoryResDto[]>>(
      'Catalog/category/getall'
    );
  }
  getBrands() : Observable<ResponseDto<BrandResDto[]>> {
    return this.http.get<ResponseDto<BrandResDto[]>>('Catalog/brand/getall');
  }
  getProductById(productId: string) {
    return this.http.get<ResponseDto<ProductResDto>>('Catalog/' + productId);
  }
  
  getFilteredProducts(filters: ProductFilters): Observable<ProductResDto[]> {
    let params = new HttpParams();
    if (filters.brandIds) {
      filters.brandIds.forEach((id) => (params = params.append('BrandIds', id)));
    }
    if (filters.categoryIds) {
      filters.categoryIds.forEach((id) => (params = params.append('CategoryIds', id)));
    }
    if (filters.inStock !== undefined) {
      params = params.set('InStock', filters.inStock.toString());
    }
    if (filters.sort) {
      params = params.set('sortBy', filters.sort);
    }
    return this.http.get<ProductResDto[]>('Catalog/product/getall', { params });
  }

}
