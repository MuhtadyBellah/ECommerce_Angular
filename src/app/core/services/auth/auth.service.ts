import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import {
  Auth,
  AuthResponse,
  changPasswordRequest,
  loginRequest,
  registerRequest,
  resetPasswordRequest,
  updateProfileRequest,
  UserData,
} from '../../models/auth.interface';
import { DefaultResponse, Paged } from '../../models/default.interface';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(ApiService);

  private readonly _currentUser = signal<UserData | null>(null);
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
        const userData = JSON.parse(storedUserData) as UserData;
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

  setUserData(token: string, userData: any): void {
    localStorage.setItem(environment.userToken, token);
    localStorage.setItem(environment.userData, JSON.stringify(userData));
    this._currentUser.set(userData);
    this._isAuthenticated.set(true);
  }

  postRegister(data: registerRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/signup', data);
  }

  postLogin(data: loginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/signin', data);
  }

  forgotPassword(email: string): Observable<DefaultResponse> {
    return this.api.post<DefaultResponse>('auth/forgotPasswords', { email });
  }

  verifyResetCode(code: string): Observable<DefaultResponse> {
    return this.api.post<DefaultResponse>('auth/verifyResetCode', { code });
  }

  logout(): void {
    this.clearUserData();
  }

  putChangePassword(data: changPasswordRequest): Observable<AuthResponse> {
    return this.api.put<AuthResponse>('users/changeMyPassword', data);
  }

  putResetPassword(data: resetPasswordRequest): Observable<AuthResponse> {
    return this.api.put<AuthResponse>('auth/resetPassword', data);
  }

  putProfileData(data: updateProfileRequest): Observable<AuthResponse> {
    return this.api.put<AuthResponse>('users/updateMe/', data);
  }

  getAllUsers(params?: any): Observable<Paged<Auth>> {
    return this.api.get<Paged<Auth>>('users', params);
  }

  getVerifyToken(params?: any): Observable<DefaultResponse> {
    return this.api.get<Paged<Auth>>('auth/verifyToken', params);
  }
}
