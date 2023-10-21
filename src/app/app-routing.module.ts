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

const routes: Routes = [
  //client
  {
    path: '',
    component: WebsiteLayoutComponent,
    children: [
      { path: '', component: HomepageComponent },
      { path: 'products', component: ListproductComponent },
      { path: 'slide', component: SlideshowComponent },
      { path: 'blog', component: BlogpageComponent },
     
    ],
  },
   //admin
   {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'list', component: ListComponent },
      { path: 'addProduct', component: AddProdcutComponent },
      { path: 'update/:id', component: UpdateProductComponent },
      { path: 'listCategori', component: ListCategoriComponent },
      { path: 'addCategori', component: AddCategoriComponent },
      { path: 'updateCategori/:id', component: UpdateCategoriComponent },
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
