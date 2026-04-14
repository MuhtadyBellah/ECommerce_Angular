import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/components/login/login.component';
import { RegisterComponent } from './core/auth/components/register/register.component';
import { authGuard } from './core/guards/auth-guard';
import { CategoriesComponent } from './features/categories/categories.component';
import { HomeComponent } from './features/home/home.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { ProductComponent } from './features/product/product.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { PasswordLayoutComponent } from './layouts/password-layout/password-layout.component';
import { ProfileLayoutComponent } from './layouts/profile-layout/profile-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
        title: 'Login',
      },
      {
        path: 'register',
        component: RegisterComponent,
        title: 'Sign Up',
      },
    ],
  },
  {
    path: 'password',
    component: PasswordLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'forgot',
        pathMatch: 'full',
      },
      {
        path: 'forgot',
        loadComponent: () =>
          import('./core/auth/components/forgot/forgot.component').then((m) => m.ForgotComponent),
        title: 'Forgot Password',
      },
      {
        path: 'confirm',
        loadComponent: () =>
          import('./core/auth/components/confirm/confirm.component').then(
            (m) => m.ConfirmComponent,
          ),
        title: 'Verify Reset Code',
      },
      {
        path: 'reset',
        loadComponent: () =>
          import('./core/auth/components/reset/reset.component').then((m) => m.ResetComponent),
        title: 'Reset Password',
      },
      {
        path: 'reset/:email',
        loadComponent: () =>
          import('./core/auth/components/reset/reset.component').then((m) => m.ResetComponent),
        title: 'Reset Password',
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent,
        title: 'Home',
      },
      {
        path: 'products',
        component: ProductComponent,
        title: 'Product',
      },
      {
        path: 'products:id',
        component: ProductComponent,
        title: 'Product',
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./features/product-details/product-details.component').then(
            (m) => m.ProductDetailsComponent,
          ),
        title: 'Product Details',
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./features/product-search/product-search.component').then(
            (m) => m.ProductSearchComponent,
          ),
        title: 'Product Search',
      },
      {
        path: 'search/:id',
        loadComponent: () =>
          import('./features/product-search/product-search.component').then(
            (m) => m.ProductSearchComponent,
          ),
        title: 'Product Search',
      },
      {
        path: 'brands',
        loadComponent: () =>
          import('./features/brands/brands.component').then((m) => m.BrandsComponent),
        title: 'Brands',
      },
      {
        path: 'categories',
        component: CategoriesComponent,
        title: 'Categories',
      },
      {
        path: 'categories/:id',
        loadComponent: () =>
          import('./features/sub-category/sub-category.component').then(
            (m) => m.SubCategoryComponent,
          ),
        title: 'SubCategories',
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/concat/concat.component').then((m) => m.ConcatComponent),
        title: 'Contcat',
      },
      {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart.component').then((m) => m.CartComponent),
        title: 'Cart',
        canActivate: [authGuard],
      },
      {
        path: 'checkout/:id',
        loadComponent: () =>
          import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
        title: 'Checkout',
        canActivate: [authGuard],
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/orders.component').then((m) => m.OrdersComponent),
        title: 'Orders',
        canActivate: [authGuard],
      },
      {
        path: 'wishlist',
        loadComponent: () =>
          import('./features/wishlist/wishlist.component').then((m) => m.WishlistComponent),
        title: 'Wishlist',
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'profile',
    component: ProfileLayoutComponent,
    title: 'Profile',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'address',
        pathMatch: 'full',
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/profile-settings/profile-settings.component').then(
            (m) => m.ProfileSettingsComponent,
          ),
        title: 'Settings',
      },
      {
        path: 'addresses',
        loadComponent: () =>
          import('./features/profile-addresses/profile-addresses.component').then(
            (m) => m.ProfileAddressesComponent,
          ),
        title: 'Addresses',
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Not Found',
  },
];
