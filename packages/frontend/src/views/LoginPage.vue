<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-container">
        <img src="../assets/university-logo.png" alt="University Logo" class="university-logo" />
      </div>
      
      <h1 class="title">Sistem Girişi</h1>
      
      <div class="login-form">
        <div class="form-group">
          <label for="tc">T.C. Kimlik numarası </label>
          <input 
            type="text" 
            id="tc" 
            v-model="credentials.tc" 
            placeholder="T.C. Kimlik numarası" />
        </div>
        
        <div class="form-group">
          <label for="password">Şifre</label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="credentials.password" 
              placeholder="Şifrenizi Giriniz" />
            <button 
              type="button" 
              class="toggle-password"
              @click="togglePasswordVisibility">
              {{ showPassword ? 'Gizle' : 'Göster' }}
            </button>
          </div>
        </div>
        
        <div class="form-actions">
          <button 
            type="button" 
            class="login-button"
            @click="login">
            Giriş Yap
          </button>
          <div class="help-links">
            <a href="#" @click.prevent="forgotPassword">Şifremi Unuttum</a>
            <a href="#" @click.prevent="register">Kayıt Ol</a>
          </div>
        </div>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import axios from 'axios';

interface Credentials {
  tc: string;
  password: string;
}

export default defineComponent({
  name: 'LoginPage',
  
  setup() {
    const showPassword = ref<boolean>(false);
    const errorMessage = ref<string>('');
    
    const credentials = reactive<Credentials>({
      tc: '',
      password: ''
    });
    
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };
    
    const login = async () => {
      try {
        errorMessage.value = '';
        
        // Validation
        if (!credentials.tc) {
          errorMessage.value = 'Lütfen T.C. Kimlik No giriiz';
          return;
        }
        
        if (!credentials.password) {
          errorMessage.value = 'Lütfen şifrenizi giriniz';
          return;
        }
        
        // Prepare request data
        const requestData = {
          tc: credentials.tc,
          password: credentials.password
        };
        
        // API call
        const response = await axios.post('/api/auth/login', requestData);
        
        if (response.data.success) {
          // Store token and user data
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // Redirect to dashboard
          window.location.href = '/dashboard';
        } else {
          errorMessage.value = response.data.message || 'Giriş başarısız';
        }
      } catch (error: any) {
        console.error('Login error:', error);
        errorMessage.value = error.response?.data?.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.';
      }
    };
    
    const forgotPassword = () => {
      // Implement password recovery logic
      alert('Şifre yenileme ekranına yönlendiriliyorsunuz');
    };
    
    const register = () => {
      // Implement registration logic
      alert('Kayıt ekranına yönlendiriliyorsunuz');
    };
    
    return {
      credentials,
      showPassword,
      errorMessage,
      togglePasswordVisibility,
      login,
      forgotPassword,
      register
    };
  }
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.login-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  padding: 30px;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.university-logo {
  max-width: 150px;
  max-height: 150px;
}

.title {
  text-align: center;
  color: #2e7d32; /* Dark green */
  margin-bottom: 25px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #424242;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #2e7d32;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #757575;
  cursor: pointer;
  font-size: 14px;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #1b5e20;
}

.help-links {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.help-links a {
  color: #2e7d32;
  text-decoration: none;
  font-size: 14px;
}

.help-links a:hover {
  text-decoration: underline;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin-top: 20px;
  font-size: 14px;
}
</style>