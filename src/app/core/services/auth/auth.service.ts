import { inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Auth, User } from '../../models/auth.interface';
import {
  changPasswordRequest,
  loginRequest,
  registerRequest,
  resetPasswordRequest,
  updateProfileRequest,
} from '../../models/request.interface';
import { Root } from '../../models/root.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(ApiService);

  private readonly _currentUser = signal<User | null>(null);
  private readonly _isAuthenticated = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  constructor() {
    this.loadStoredUserData();
  }

  private loadStoredUserData(): void {
    const storedToken = localStorage.getItem(environment.userToken);
    const storedUserData = localStorage.getItem(environment.userData);

    if (storedToken && storedUserData) {
      try {
        const userData = JSON.parse(storedUserData) as User;
        this._currentUser.set(userData);
        this._isAuthenticated.set(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearUserData();
      }
    }
  }

  private clearUserData(): void {
    localStorage.removeItem(environment.userToken);
    localStorage.removeItem(environment.userData);
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
  }

  setUserData(token: string): void {
    debugger;
    localStorage.setItem(environment.userToken, token);

    const decoded = jwtDecode(token);
    localStorage.setItem(environment.userData, JSON.stringify(decoded));
    this._currentUser.set(decoded as User);
    this._isAuthenticated.set(true);
  }

  postRegister(data: registerRequest): Observable<Auth> {
    return this.api.post<Auth>('auth/signup', data);
  }

  postLogin(data: loginRequest): Observable<Auth> {
    return this.api.post<Auth>('auth/signin', data);
  }

  forgotPassword(email: string): Observable<Root> {
    return this.api.post<Root>('auth/forgotPasswords', { email });
  }

  verifyResetCode(code: string): Observable<Root> {
    return this.api.post<Root>('auth/verifyResetCode', { code });
  }

  putResetPassword(data: resetPasswordRequest): Observable<Auth> {
    return this.api.put<Auth>('auth/resetPassword', data);
  }

  logout(): void {
    this.clearUserData();
  }

  putChangePassword(data: changPasswordRequest): Observable<Auth> {
    return this.api.put<Auth>('users/changeMyPassword', data);
  }

  putProfileData(data: updateProfileRequest): Observable<Auth> {
    return this.api.put<Auth>('users/updateMe/', data);
  }

  getAllUsers(params?: any): Observable<Auth> {
    return this.api.get<Auth>('users', params);
  }

  getVerifyToken(params?: any): Observable<Root> {
    return this.api.get<Root>('auth/verifyToken', params);
  }
}
