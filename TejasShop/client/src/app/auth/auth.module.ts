import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationModule } from '../notification/notification.module';
import { AdminPageComponent } from '../admin/admin-page/admin-page.component';
import { AddProductComponent } from '../admin/add-product/add-product.component';
import { HttpClientModule } from '@angular/common/http';
import { EditProductComponent } from '../admin/edit-product/edit-product.component';
import { DeleteProductComponent } from '../admin/delete-product/delete-product.component';
import { OrderHistoryComponent } from '../admin/order-history/order-history.component';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationService } from '../notification/notification.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { AdminDashboardComponent } from '../admin/admin-dashboard/admin-dashboard.component';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent

  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NotificationModule,
    HttpClientModule,
  ],
  providers:[NotificationService]
})
export class AuthModule { }
