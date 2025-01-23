import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { addProductDTO, ProductResDto } from 'src/app/core/Models/catalog';
import { AuthService } from 'src/app/core/Services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { BASE_IMAGE_API } from 'src/app/core/token/baseUrl.token';
import { Store } from '@ngrx/store';
import { AppState } from '../../redux/store';
import { NotificationService } from 'src/app/notification/notification.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


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

    public authservice: AuthService,
    private route: Router,
    public dialog: MatDialog, 
    public aactivatedRoute : ActivatedRoute, 
    @Inject(BASE_IMAGE_API) public imageUrl: string,
    private store:Store<AppState>,
    private notification: NotificationService
  ) 

    {
  
    }

  
    displayedColumns: string[] = ['id', 'product', 'name', 'stockQuantity', 'originalPrice', 'categoryId', 'brandId', 'actions'];
    dataSource = new MatTableDataSource<ProductResDto>();
    totalItems: number = 0;
    itemsPerPage: number = 10;
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
  

  
    ngOnInit(): void {
      this.authservice.getAllProducts().subscribe(data => {
        this.dataSource.data = data;
        this.totalItems = data.length;
        this.dataSource.paginator = this.paginator;
      });
    }
  
    onPageChange(event: PageEvent): void {
      this.itemsPerPage = event.pageSize;
      this.paginator.pageIndex = event.pageIndex;
      this.dataSource.paginator = this.paginator;
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
      this.notification.Success('Product deleted!')
                                          console.log('Product deleted successfully');
    }, error => {
                                          console.error('Error deleting product', error);
    });
  }

  logout(){
    this.authservice.LogOutAdminSide().subscribe();
  }

}
