import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListproductComponent } from './pages/listproduct/listproduct.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { WebsiteLayoutComponent } from './layouts/website-layout/website-layout.component';
import { SlideshowComponent } from './slideshow/slideshow.component';
import { BlogpageComponent } from './pages/blogpage/blogpage.component';
import { AddProdcutComponent } from './pages/admin/add-prodcut/add-prodcut.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { UpdateProductComponent } from './pages/admin/update-product/update-product.component';
import { ListComponent } from './pages/admin/list/list.component';
import { ListCategoriComponent } from './pages/admin/list-categori/list-categori.component';
import { AddCategoriComponent } from './pages/admin/add-categori/add-categori.component';
import { UpdateCategoriComponent } from './pages/admin/update-categori/update-categori.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { UserPaymentComponent } from './pages/user-payment/user-payment.component';
import { CheckoutCartComponent } from './pages/checkout-cart/checkout-cart.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ListuserComponent } from './pages/admin/listuser/listuser.component';
import { UpdateUserComponent } from './pages/admin/update-user/update-user.component';
import { AddUserComponent } from './pages/admin/add-user/add-user.component';
import { CartComponent } from './pages/cart/cart.component';
import { InforAccountComponent } from './pages/account/infor-account/infor-account.component';
import { UpdateAccountComponent } from './pages/account/update-account/update-account.component';
import { SendEmailComponent } from './pages/send-email/send-email.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { OrderComponent } from './pages/order/order.component';
import { AuthGuardComponent } from './pages/auth-guard/auth-guard.component';
import { ChangeStatusOrderComponent } from './pages/change-status-order/change-status-order.component';
import { ListOderComponent } from './pages/admin/list-oder/list-oder.component';
import { UpdatePasswordComponent } from './pages/account/update-password/update-password.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { AuthGuard } from './Guard/auth.guard';
import { ListBlogComponent } from './pages/admin/blog/list-blog/list-blog.component';
import { AddBlogComponent } from './pages/admin/blog/add-blog/add-blog.component';
import { UpdateBlogComponent } from './pages/admin/blog/update-blog/update-blog.component';
import { ErrorComponent } from './pages/error/error.component';
import { ListNhanComponent } from './pages/list-nhan/list-nhan.component';
const routes: Routes = [
  //client
  {
    path: '',
    component: WebsiteLayoutComponent,
    children: [
      { path: '', component: HomepageComponent },
      { path: 'products', component: ListproductComponent },
      { path: 'listNhan', component: ListNhanComponent },
      { path: 'slide', component: SlideshowComponent },
      { path: 'blog', component: BlogpageComponent },
      { path: 'blog/:id', component: BlogDetailsComponent },

      { path: 'invoice', component: InvoiceComponent },
      { path: 'user-payment', component: UserPaymentComponent },
      { path: 'checkout', component: CheckoutCartComponent },
      { path: 'product/:id', component: ProductDetailsComponent },
      {
        path: 'cart',
        component: CartComponent
      },
      { path: 'account/infor-account', component: InforAccountComponent },
      { path: 'account/update-account', component: UpdateAccountComponent },
      { path: 'account/update-password', component: UpdatePasswordComponent },

      {
        path: 'order',
        component: OrderComponent
      },
      {
        path: 'orderUser/:id', component: ChangeStatusOrderComponent
      },
      
      
    ],
  },
  //admin
  {
    path: 'admin', canActivate: [AuthGuard],
    component: AdminLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'list', component: ListComponent },
      { path: 'listCategori', component: ListCategoriComponent },
      { path: 'listOrder', component: ListOderComponent },
      { path: 'listBlog', component: ListBlogComponent },
      { path: 'listUser', component: ListuserComponent },
      { path: 'addUser', component: AddUserComponent },
    ],
  },
  {
    path: 'admin',

    children: [
      { path: 'addProduct', component: AddProdcutComponent },
      { path: 'addCategori', component: AddCategoriComponent },
      { path: 'addBlog', component: AddBlogComponent },
      { path: 'update/:id', component: UpdateProductComponent },
      { path: 'updateCategori/:id', component: UpdateCategoriComponent },
      { path: 'updateUser/:id', component: UpdateUserComponent },
      { path: 'updateBlog/:id', component: UpdateBlogComponent },
    ],
  },

  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgotPassword', component: SendEmailComponent },
  { path: 'resetpassword', component: ForgotPasswordComponent },
  {path:'**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
