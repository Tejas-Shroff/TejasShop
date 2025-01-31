import { Component, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CategoryResDto, ProductResDto } from 'src/app/core/Models/catalog';
import { AuthService } from 'src/app/core/Services/auth.service';
import { CatalogService } from 'src/app/core/Services/catalog.service';
import { NotificationService } from 'src/app/notification/notification.service';
import { selectCartCount } from 'src/app/redux/cart/cart.selector';
import { selectCategories } from 'src/app/redux/catalog/catalog.selector';
import { AppState } from 'src/app/redux/store';
import { selectWishlistCount } from 'src/app/redux/wishlist/wishlist.selector';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  categories$: Observable<CategoryResDto[]>;
  cartCount$:Observable<number|undefined>;
  wishlistCount$:Observable<number|undefined>;

  searchTerm: string = '';
  showResults: boolean = false;
  searchProducts:ProductResDto[]=[];

  constructor(
    private store: Store<AppState>,
    public auth:AuthService,
    private catalogService: CatalogService,
    private notification: NotificationService
  ) {
    this.categories$ = this.store.select(selectCategories);
    this.cartCount$ = this.store.select(selectCartCount);
    this.wishlistCount$ = this.store.select(selectWishlistCount);
  }

  //@Output() search = new EventEmitter<string>();

  onSearch(): void {
    //this.search.emit(this.searchTerm);
    console.log(this.searchTerm);
    if(this.searchTerm.length>3){
      this.catalogService.getProducts({
        pageIndex: 1,
        pageSize: 5,
        search:this.searchTerm
      }).subscribe(res=>{
        if(res.data?.data) this.searchProducts=res.data?.data;
      })
    }
  }
  resetSearch(){
    this.searchTerm='';
    this.searchProducts=[];
  }
  onFocus(): void {
    this.showResults = true;
  }

  onBlur(): void {
    // Delay hiding to allow click on the results
    setTimeout(() => (this.showResults = false), 200);
  }


  logout(){
    sessionStorage.clear();
    this.notification.clearNotifications();
    this.auth.LogOut().subscribe();
  }
}
