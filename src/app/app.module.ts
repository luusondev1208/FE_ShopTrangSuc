import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
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
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { UserPaymentComponent } from './pages/user-payment/user-payment.component';
import { CheckoutCartComponent } from './pages/checkout-cart/checkout-cart.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';

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
    InvoiceComponent,
    UserPaymentComponent,
    CheckoutCartComponent,
    ProductDetailsComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
