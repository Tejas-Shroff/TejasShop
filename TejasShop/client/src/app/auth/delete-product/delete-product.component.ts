import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { addProductDTO, ProductResDto } from 'src/app/core/Models/catalog';
import { AuthService } from 'src/app/core/Services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { BASE_IMAGE_API } from 'src/app/core/token/baseUrl.token';
import { Store } from '@ngrx/store';
import { AppState } from '../../redux/store';


@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.scss']
})
export class DeleteProductComponent implements OnInit{

  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;
   
  AllProducts: ProductResDto[] = [];
  router: any;
  productId!: number;

  constructor(

    private authservice: AuthService,
    private route: Router,
    public dialog: MatDialog, 
    public aactivatedRoute : ActivatedRoute, 
    @Inject(BASE_IMAGE_API) public imageUrl: string,
    private store:Store<AppState>) 

    {
  
    }

  
  ngOnInit(): void {

    // this.authservice.getAllProducts().subscribe(
    //   data => {this.AllProducts.push(...data)}
    //   );
    //   console.log(this.AllProducts);

    this.authservice.getAllProducts().subscribe(data => {
      this.AllProducts = data;
                                                // console.log('Fetched Products:', this.AllProducts); // Log the fetched data
      this.AllProducts.forEach(product => {
                                                // console.log('Product Category:', product.category);
      });
    }); 
  }

  openEditDialog(product: ProductResDto): void {
    const dialogRef = this.dialog.open(EditProductComponent, {
      width: '400px',
      data: product
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateProduct(product.id, result);
      }
    });
  }
 
  openConfirmDialog(productId: number): void {
    const dialogRef = this.dialog.open(this.confirmDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProduct(productId);
      }
    });
  }

  updateProduct(productId: number, product: addProductDTO): void {
    console.log('Updating product with data:', product);
    this.authservice.updateProduct(productId, product).subscribe(response => {
      // here we can handle the resposne
    }, error => {
      console.error('Update failed', error);
    });
  }

  deleteProduct(productId: number): void {
    this.authservice.deleteProduct(productId).subscribe(() => {
      this.AllProducts = this.AllProducts.filter(product => product.id !== productId);
                                          console.log('Product deleted successfully');
    }, error => {
                                          console.error('Error deleting product', error);
    });
  }

  logout(){
    this.authservice.LogOutAdminSide().subscribe();
  }

}
