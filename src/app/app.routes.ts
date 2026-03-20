import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/components/login/login.component';
import { RegisterComponent } from './core/auth/components/register/register.component';
import { authGuard } from './core/guards/auth-guard';
import { HomeComponent } from './features/home/home.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { ProfileAddressesComponent } from './features/profile-addresses/profile-addresses.component';
import { ProfileSettingsComponent } from './features/profile-settings/profile-settings.component';
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
        path: 'product',
        component: NotFoundComponent,
        title: 'Product',
      },
      {
        path: 'product-search',
        component: NotFoundComponent,
        title: 'Product Search',
      },
      {
        path: 'product-details',
        component: NotFoundComponent,
        title: 'Product Details',
      },
      {
        path: 'product-details/:id',
        component: NotFoundComponent,
        title: 'Product Details',
      },
      {
        path: 'brands',
        component: NotFoundComponent,
        title: 'Brands',
      },
      {
        path: 'categories',
        component: NotFoundComponent,
        title: 'Categories',
      },
      {
        path: 'card',
        component: NotFoundComponent,
        title: 'Card',
        canActivate: [authGuard],
      },
      {
        path: 'checkout',
        component: NotFoundComponent,
        title: 'Checkout',
        canActivate: [authGuard],
      },
      {
        path: 'orders',
        component: NotFoundComponent,
        title: 'Orders',
        canActivate: [authGuard],
      },
      {
        path: 'wishlist',
        component: NotFoundComponent,
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
        component: ProfileSettingsComponent,
        title: 'Settings',
      },
      {
        path: 'addresses',
        component: ProfileAddressesComponent,
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
