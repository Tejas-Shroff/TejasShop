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
import { sortHeader_c } from 'src/app/constants/messages';
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
  @Input() itemsToShow: number = 10;
  @Input() sortBy: string = 'featured';
  @Output() sortHeaderChanges = new EventEmitter<any>();
  categories$: Observable<CategoryResDto[]>;
  readonly sortOptions = sortHeader_c.sortOptions;

  constructor(
    private store: Store<AppState>,
    @Inject(BASE_IMAGE_API) public serveApi: string,
    private admin: AdminService
  ) {
    this.categories$ = this.store.select(selectCategories);
  }

  ngOnInit(): void {
    this.applyChanges();
  }

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
