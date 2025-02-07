import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ProductFilters, ProductResDto } from '../core/Models/catalog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AuthService } from '../core/Services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { BASE_IMAGE_API } from '../core/token/baseUrl.token';
import { MatSelectChange } from '@angular/material/select';
import { CatalogService } from '../core/Services/catalog.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, AfterViewInit {
  products: ProductResDto[] = [];
  displayedProducts: ProductResDto[] = [];
  totalItems: number = 0;
  itemsPerPage: number = 5;
  currentPage: number = 0;
  sortBy: string = 'featured';
  filters: ProductFilters = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private authService: AuthService,
    private catalogService: CatalogService,
    public activatedRoute: ActivatedRoute,
    @Inject(BASE_IMAGE_API) public imageUrl: string
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe((event: PageEvent) => {
      this.currentPage = event.pageIndex;
      this.itemsPerPage = event.pageSize;
      this.updateDisplayedProducts();
    });
  }

  loadProducts(): void {
    this.catalogService.getFilteredProducts(this.filters).subscribe((res) => {
      this.products = res;
      this.totalItems = res.length;
      this.updateDisplayedProducts();
    });
  }

  updateDisplayedProducts(): void {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedProducts = this.products.slice(startIndex, endIndex);
  }

  onSortChange(event: MatSelectChange): void {
    this.sortBy = event.value;
    this.applyFilters();
  }

  onFiltersChange(filters: ProductFilters): void {
    this.filters = filters;
    this.applyFilters();
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.paginator.firstPage();
    this.filters.sort = this.sortBy;
    this.loadProducts();
  }
}
