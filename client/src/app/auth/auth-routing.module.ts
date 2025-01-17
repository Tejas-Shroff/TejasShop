import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { DeleteProductComponent } from './delete-product/delete-product.component';
import { OrderHistoryComponent } from './order-history/order-history.component';

const routes: Routes = [
  {
    path:'login',
    component:LoginComponent,
    pathMatch:'full'
  },
  {
    path:'register',
    component:RegisterComponent,
    pathMatch:'full'
  },
  {
    path:'admin-page',
    component:AdminPageComponent,
    pathMatch:'full'
  },
  {
    path:'admin-page/add-product',
    component:AddProductComponent,
    pathMatch:'full'
  },
  {
    path:'admin-page/edit-product',
    component:EditProductComponent,
    pathMatch:'full'
  },
  {
    path:'admin-page/delete-product',
    component:DeleteProductComponent,
    pathMatch:'full'
  },
  {
    path:'admin-page/order-history',
    component:OrderHistoryComponent,
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
