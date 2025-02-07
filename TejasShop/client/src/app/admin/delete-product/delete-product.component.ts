import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
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
import { AdminService } from 'src/app/core/Services/admin.service';
import { view_product_c } from 'src/app/constants/messages';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.scss'],
})
export class DeleteProductComponent implements OnInit {
  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;
  @Output() productUpdated = new EventEmitter<any>();

  AllProducts: ProductResDto[] = [];
  router: any;
  productId!: number;

  constructor(
    public authservice: AuthService,
    private adminService: AdminService,
    private route: Router,
    public dialog: MatDialog,
    public aactivatedRoute: ActivatedRoute,
    @Inject(BASE_IMAGE_API) public imageUrl: string,
    private store: Store<AppState>,
    private notification: NotificationService
  ) {}

  displayedColumns: string[] = [
    'id',
    'product',
    'name',
    'stockQuantity',
    'originalPrice',
    'discountPercentage',
    'newPrice',
    'categoryId',
    'brandId',
    'actions',
  ];
  dataSource = new MatTableDataSource<ProductResDto>();
  totalItems: number = 0;
  itemsPerPage: number = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.adminService.getAllProducts().subscribe((data) => {
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

  openConfirmDialog(productId: number): void {
    const dialogRef = this.dialog.open(this.confirmDialog);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteProduct(productId);
      }
    });
  }

  openEditDialog(product: ProductResDto): void {
    const dialogRef = this.dialog.open(EditProductComponent, {
      width: view_product_c.widthofEditDialogbox,
      data: product,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateProduct(product.id, result);
      }
    });
  }

  updateProduct(productId: number, product: addProductDTO): void {

    this.adminService.updateProduct(productId, product).subscribe(
      (response) => {
        this.notification.Success(view_product_c.productUpdatedSuccesffuly_v);
        this.loadProducts();
      },
      (error) => {
        this.notification.Error(view_product_c.updateFailed_v, error);
      }
    );
  }

  deleteProduct(productId: number): void {
    this.adminService.deleteProduct(productId).subscribe(
      () => {
        this.AllProducts = this.AllProducts.filter(
          (product) => product.id !== productId
        );
        this.notification.Success(view_product_c.productDeleted_v);
        window.location.reload();
      },
      (error) => {
        this.notification.Error(view_product_c.ErrorDeletingProduct_v, error);
      }
    );
  }

  logout() {
    this.authservice.LogOutAdminSide().subscribe();
  }
}
