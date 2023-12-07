import { NgModule } from '@angular/core';
// import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { ListproductComponent } from './pages/listproduct/listproduct.component';
import { BlogpageComponent } from './pages/blogpage/blogpage.component';
import { HeaderClientComponent } from './components/client/header-client/header-client.component';
import { FooterClientComponent } from './components/client/footer-client/footer-client.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { WebsiteLayoutComponent } from './layouts/website-layout/website-layout.component';
import { SlideshowComponent } from './slideshow/slideshow.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddProdcutComponent } from './pages/admin/add-prodcut/add-prodcut.component';
import { SiderbarAdminComponent } from './components/siderbar-admin/siderbar-admin.component';
import { HeaderAdminComponent } from './components/admin/header-admin/header-admin.component';
import { FooterAdminComponent } from './components/admin/footer-admin/footer-admin.component';
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
import { NgxUploaderModule } from 'ngx-uploader';
import { FileUploadModule } from 'ng2-file-upload';
import { ListuserComponent } from './pages/admin/listuser/listuser.component';
import { UpdateUserComponent } from './pages/admin/update-user/update-user.component';
import { AddUserComponent } from './pages/admin/add-user/add-user.component';
import { CartComponent } from './pages/cart/cart.component';
import { InforAccountComponent } from './pages/account/infor-account/infor-account.component';
import { UpdateAccountComponent } from './pages/account/update-account/update-account.component';
import { ToastrModule, ToastrService, ToastNoAnimationModule } from 'ngx-toastr';
import { SendEmailComponent } from './pages/send-email/send-email.component'
import { NgToastModule } from 'ng-angular-popup';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideToastr } from 'ngx-toastr';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { AuthGuardComponent } from './pages/auth-guard/auth-guard.component';
import { OrderComponent } from './pages/order/order.component';
import { ChangeStatusOrderComponent } from './pages/change-status-order/change-status-order.component';
import { TitleComponent } from './pages/title/title.component';
import { ListOderComponent } from './pages/admin/list-oder/list-oder.component';
import { UpdatePasswordComponent } from './pages/account/update-password/update-password.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { AddBlogComponent } from './pages/admin/blog/add-blog/add-blog.component';
import { ListBlogComponent } from './pages/admin/blog/list-blog/list-blog.component';
import { UpdateBlogComponent } from './pages/admin/blog/update-blog/update-blog.component';
import { ErrorComponent } from './pages/error/error.component';
import {MatTabsModule} from '@angular/material/tabs';
import { ListNhanComponent } from './pages/list-nhan/list-nhan.component';



@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    ListproductComponent,
    BlogpageComponent,
    HeaderClientComponent,
    FooterClientComponent,
    AdminLayoutComponent,
    WebsiteLayoutComponent,
    SlideshowComponent,
    AddProdcutComponent,
    SiderbarAdminComponent,
    HeaderAdminComponent,
    FooterAdminComponent,
    DashboardComponent,
    UpdateProductComponent,
    ListComponent,
    ListCategoriComponent,
    AddCategoriComponent,
    UpdateCategoriComponent,
    InvoiceComponent,
    UserPaymentComponent,
    CheckoutCartComponent,
    ProductDetailsComponent,
    RegisterComponent,
    LoginComponent,
    ListuserComponent,
    UpdateUserComponent,
    AddUserComponent,
    CartComponent,
    InforAccountComponent,
    UpdateAccountComponent,
    SendEmailComponent,
    ForgotPasswordComponent,
    AuthGuardComponent,
    OrderComponent,
    ChangeStatusOrderComponent,
    TitleComponent,
    ListOderComponent,
    UpdatePasswordComponent,
    BlogDetailsComponent,
    AddBlogComponent,
    ListBlogComponent,
    UpdateBlogComponent,
    ErrorComponent,
    ListNhanComponent,


  ],
  imports: [

    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxUploaderModule,
    FileUploadModule,
    NgToastModule,
    MatTabsModule,
    ToastNoAnimationModule.forRoot(),
    BrowserAnimationsModule, // required animations module
    // NgbPaginationModule,
    // NgbAlertModule,
    ToastrModule.forRoot(

      {
        timeOut: 5000,
        progressBar: false,
        positionClass: 'toast-top-right',
        closeButton: true
      }
    ),

  ],
  providers: [
    ToastrService,
    provideAnimations(), // required animations providers
    provideToastr(), // Toastr providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
