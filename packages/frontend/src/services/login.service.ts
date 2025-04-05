// src/services/login.service.ts
import axios from 'axios';

interface LoginResponse {
  success: boolean;
  token?: string;
  userData?: any;
  message?: string;
}

class LoginService {
  private apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Aday girişi için (TC Kimlik No ve şifre)
  async candidateLogin(tc: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${this.apiUrl}/api/auth/candidate/login`, {
        tc,
        password
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return {
          success: false,
          message: error.response.data.message || 'Giriş işlemi başarısız oldu.'
        };
      }
      
      throw error;
    }
  }

  // Admin, Yönetici ve Jüri girişi için (Okul No ve şifre)
  async userLogin(userType: string, schoolId: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${this.apiUrl}/api/auth/${userType}/login`, {
        schoolId,
        password
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return {
          success: false,
          message: error.response.data.message || 'Giriş işlemi başarısız oldu.'
        };
      }
      
      throw error;
    }
  }

  // Kullanıcı oturumunu kontrol et
  async checkAuth(): Promise<boolean> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return false;
    }
    
    try {
      const response = await axios.get(`${this.apiUrl}/api/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.valid === true;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('userData');
      return false;
    }
  }

  // Çıkış yap
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
  }
}

export const loginService = new LoginService();