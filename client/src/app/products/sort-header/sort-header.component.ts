import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';
import { CategoryResDto, ProductResDto } from 'src/app/core/Models/catalog';
import { AuthService } from 'src/app/core/Services/auth.service';
import { CatalogService } from 'src/app/core/Services/catalog.service';
import { BASE_IMAGE_API } from 'src/app/core/token/baseUrl.token';
import { selectCategories } from 'src/app/redux/catalog/catalog.selector';
import { AppState } from 'src/app/redux/store';

@Component({
  selector: 'app-sort-header',
  templateUrl: './sort-header.component.html',
  styleUrls: ['./sort-header.component.css']
})
export class SortHeaderComponent {
  categories$: Observable<CategoryResDto[]>;
  products$:Observable<ProductResDto[]>;
  productCount: number = 0;
  constructor(
    private store: Store<AppState>,
    @Inject(BASE_IMAGE_API) public serveApi:string,
    private catalogService: CatalogService,
    private auth:AuthService
  )
  {
    this.categories$ = this.store.select(selectCategories);
    this.products$ = this.auth.getAllProducts().pipe(
      tap((res) => {
        this.productCount = res.length; // Update product count
        console.log('Product count', this.productCount);
      }),
      map((res) => res !== undefined ? res : [])
    );
  }

  


  readonly showOptions: number[] = [10, 20, 30, 50, 100];
  readonly sortOptions = [
    {
      sortName:'Featured',
      sortCode:'featured'
    },
    {
      sortName:'Price: Low to High',
      sortCode:'price_lth'
    },
    {
      sortName:'Price: High to Low',
      sortCode:'price_htl'
    },
    {
      sortName:'Rating',
      sortCode:'rating'
    },
    {
      sortName:'Newest',
      sortCode:'newest'
    }
];

  @Input() itemsToShow:number=10;
  @Input() sortBy: string = 'featured';

  @Output() sortHeaderChanges = new EventEmitter<any>();

  // itemsToShowChange(obj:MatSelectChange){
  //  this.itemsToShow=obj.value;
  //  this.applyChanges();
  // }

  itemsToShowChange(){
    this.applyChanges();
   }

  // sortByChange(obj:MatSelectChange){
  //   this.sortBy=obj.value;
  //   this.applyChanges();
  // }
  sortByChange(){
    this.applyChanges();
  }
  
  applyChanges(){
    const sortFilter = {
      itemsToShow:this.itemsToShow,
      sortBy:this.sortBy
    }

    this.sortHeaderChanges.emit(sortFilter);
  }

}
