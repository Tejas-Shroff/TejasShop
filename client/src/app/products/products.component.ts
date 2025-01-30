import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CatalogService } from '../core/Services/catalog.service';
import { ProductFilters, ProductResDto } from '../core/Models/catalog';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: ProductResDto[] = [];
  pageIndex: number = 0;
  pageSize: number = 10;
  pageItems!: number;
  maxPrice!: number;
  minPrice!: number;

  initialFilters: ProductFilters = {
    pageIndex: 1,
    pageSize: 10
  };
  filters$ = new BehaviorSubject<ProductFilters>(this.initialFilters);

  constructor(private catalogService: CatalogService) { }

  ngOnInit(): void {
    this.filters$.subscribe((filter) => {
      this.catalogService.getProducts(filter).subscribe((res) => {
        console.log(res);
        if (res.data?.count !== undefined) {
          this.pageItems = res.data.count;
        }
        if (res.data?.minPrice !== undefined) {
          this.minPrice = res.data.minPrice;
        }
        if (res.data?.maxPrice !== undefined) {
          this.maxPrice = res.data.maxPrice;
        }
        if (res.data?.data !== undefined) {
          this.products = res.data.data;
        }
      });
    });
  }

  get getFilters() {
    return this.filters$.value;
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.initialFilters = {
      ...this.initialFilters,
      pageIndex: this.pageIndex + 1,
      pageSize: this.pageSize
    };
    this.filters$.next(this.initialFilters);
  }

  filtersChanged(filters: any): void {
    this.initialFilters = {
      ...this.initialFilters,
      categoryIds: filters.categoryId,
      brandIds: filters.brandId,
      ratings: filters.ratings,
      maxPrice: filters.maxPrice,
      minPrice: filters.minPrice,
      inStock: filters.stockType
    };
    this.filters$.next(this.initialFilters);
  }

  sortFiltersChanged(sortFilters: any): void {
    this.pageSize = sortFilters.itemsToShow;
    this.initialFilters = {
      ...this.initialFilters,
      pageSize: sortFilters.itemsToShow,
      sort: sortFilters.sortBy
    };
    this.filters$.next(this.initialFilters);
  }
}