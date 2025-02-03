
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';
import { CategoryResDto, ProductResDto } from 'src/app/core/Models/catalog';
import { AdminService } from 'src/app/core/Services/admin.service';
import { AuthService } from 'src/app/core/Services/auth.service';
import { BASE_IMAGE_API } from 'src/app/core/token/baseUrl.token';
import { selectCategories } from 'src/app/redux/catalog/catalog.selector';
import { AppState } from 'src/app/redux/store';

@Component({
  selector: 'app-sort-header',
  templateUrl: './sort-header.component.html',
  styleUrls: ['./sort-header.component.css'],
})
export class SortHeaderComponent implements OnInit {
  categories$: Observable<CategoryResDto[]>;
  products$: Observable<ProductResDto[]>;
  productCount: number = 0;

  constructor(
    private store: Store<AppState>,
    @Inject(BASE_IMAGE_API) public serveApi: string,
    private admin: AdminService
  ) {
    this.categories$ = this.store.select(selectCategories);
    this.products$ = this.admin.getAllProducts().pipe(
      tap((res) => {
        this.productCount = res.length; // Update product count
        console.log('Product count', this.productCount);
      }),
      map((res) => (res !== undefined ? res : []))
    );
  }

  ngOnInit(): void {
    this.applyChanges();
  }

  readonly showOptions: number[] = [10, 20, 30, 50, 100];
  readonly sortOptions = [
    { sortName: 'Featured', sortCode: 'featured' },
    { sortName: 'Price: Low to High', sortCode: 'price_lth' },
    { sortName: 'Price: High to Low', sortCode: 'price_htl' },
  ];

  @Input() itemsToShow: number = 10;
  @Input() sortBy: string = 'featured';

  @Output() sortHeaderChanges = new EventEmitter<any>();

  itemsToShowChange(): void {
    this.applyChanges();
  }

  sortByChange(obj: MatSelectChange): void {
    this.sortBy = obj.value;
    this.applyChanges();
  }

  applyChanges(): void {
    const sortFilter = {
      itemsToShow: this.itemsToShow,
      sortBy: this.sortBy,
    };

    this.sortHeaderChanges.emit(sortFilter);
  }
}
