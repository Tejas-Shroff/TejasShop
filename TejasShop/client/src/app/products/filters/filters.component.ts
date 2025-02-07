import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { BrandResDto, CategoryResDto, ProductFilters } from 'src/app/core/Models/catalog';
import { loadBrands } from 'src/app/redux/catalog/catalog.action';
import { selectBrands, selectCategories } from 'src/app/redux/catalog/catalog.selector';
import { AppState } from 'src/app/redux/store';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  categories$: Observable<CategoryResDto[]>;
  brands$: Observable<BrandResDto[]>;
  

  constructor(private store: Store<AppState>) {
    this.categories$ = this.store.select(selectCategories);
    this.brands$ = this.store.select(selectBrands);
  }

  ngOnInit(): void {
    this.brands$.pipe(
      tap(brands => {
        if (brands.length === 0) {
          this.store.dispatch(loadBrands());
        }
      })
    ).subscribe();
  }

  @Input() selectedCategoryIds: number[] = [];
  @Input() selectedBrandIds: number[] = [];
  @Input() selectedStockType: boolean | undefined ;

  @Output() filtersChanged = new EventEmitter<ProductFilters>();

  toggleCategory(categoryId: number): void {
    const index = this.selectedCategoryIds.indexOf(categoryId);
    if (index === -1) {
      this.selectedCategoryIds.push(categoryId);
    } else {
      this.selectedCategoryIds.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleBrand(brandId: number): void {
    const index = this.selectedBrandIds.indexOf(brandId);
    if (index === -1) {
      this.selectedBrandIds.push(brandId);
    } else {
      this.selectedBrandIds.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleStock(value: boolean): void {
    if(this.selectedStockType === value){
      this.selectedStockType = undefined;
    }else{
    this.selectedStockType = value;
    }
    this.applyFilters();
  }

  applyFilters(): void {
    const selectedFilters: ProductFilters = {
      brandIds: this.selectedBrandIds,
      categoryIds: this.selectedCategoryIds,
      inStock: this.selectedStockType
    };
    this.filtersChanged.emit(selectedFilters);
  }
}
