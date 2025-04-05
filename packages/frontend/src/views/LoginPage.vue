<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-container">
        <img src="/packages/frontend/src/assets/university-logo.png " alt="University Logo" class="university-logo" />
      </div>
      
      <h1 class="title">Sistem Girişi</h1>
      
      <div class="login-tabs">
        <button 
          v-for="tab in loginTabs" 
          :key="tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
          @click="switchTab(tab.id)">
          {{ tab.label }}
        </button>
      </div>
      
      <div class="login-form">
        <div v-if="activeTab === 'candidate'" class="form-group">
          <label for="tc">T.C. Kimlik No</label>
          <input 
            type="text" 
            id="tc" 
            v-model="credentials.tc" 
            placeholder="T.C. Kimlik Numaranızı Giriniz"
            maxlength="11" />
        </div>
        
        <div v-if="activeTab !== 'candidate'" class="form-group">
          <label for="schoolNo">Okul Numarası</label>
          <input 
            type="text" 
            id="schoolNo" 
            v-model="credentials.schoolNo" 
            placeholder="Okul Numaranızı Giriniz" />
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
            <a href="#" @click.prevent="register" v-if="activeTab === 'candidate'">Kayıt Ol</a>
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
  schoolNo: string;
  password: string;
}

interface LoginTab {
  id: string;
  label: string;
}

export default defineComponent({
  name: 'LoginPage',
  
  setup() {
    const activeTab = ref<string>('candidate');
    const showPassword = ref<boolean>(false);
    const errorMessage = ref<string>('');
    
    const credentials = reactive<Credentials>({
      tc: '',
      schoolNo: '',
      password: ''
    });
    
    const loginTabs: LoginTab[] = [
      { id: 'candidate', label: 'Aday' },
      { id: 'admin', label: 'Admin' },
      { id: 'manager', label: 'Yönetici' },
      { id: 'jury', label: 'Jüri' }
    ];
    
    const switchTab = (tabId: string) => {
      activeTab.value = tabId;
      credentials.tc = '';
      credentials.schoolNo = '';
      credentials.password = '';
      errorMessage.value = '';
    };
    
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };
    
    const login = async () => {
      try {
        errorMessage.value = '';
        
        // Validation
        if (activeTab.value === 'candidate' && !credentials.tc) {
          errorMessage.value = 'Lütfen T.C. Kimlik Numaranızı giriniz';
          return;
        }
        
        if (activeTab.value !== 'candidate' && !credentials.schoolNo) {
          errorMessage.value = 'Lütfen Okul Numaranızı giriniz';
          return;
        }
        
        if (!credentials.password) {
          errorMessage.value = 'Lütfen şifrenizi giriniz';
          return;
        }
        
        // Prepare request data
        const requestData = {
          userType: activeTab.value,
          ...(activeTab.value === 'candidate' ? { tc: credentials.tc } : { schoolNo: credentials.schoolNo }),
          password: credentials.password
        };
        
        // API call
        const response = await axios.post('/api/auth/login', requestData);
        
        if (response.data.success) {
          // Store token and user data
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // Redirect based on user type
          const redirectMap: Record<string, string> = {
            candidate: '/candidate/dashboard',
            admin: '/admin/dashboard',
            manager: '/manager/dashboard',
            jury: '/jury/dashboard'
          };
          
          window.location.href = redirectMap[activeTab.value] || '/';
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
      // Implement registration logic for candidates
      alert('Kayıt ekranına yönlendiriliyorsunuz');
    };
    
    return {
      activeTab,
      credentials,
      loginTabs,
      showPassword,
      errorMessage,
      switchTab,
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

.login-tabs {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  border-bottom: 1px solid #e0e0e0;
}

.tab-button {
  background: none;
  border: none;
  padding: 10px 5px;
  cursor: pointer;
  color: #757575;
  font-weight: 500;
  position: relative;
  flex: 1;
  text-align: center;
  transition: all 0.3s ease;
}

.tab-button:hover {
  color: #2e7d32;
}

.tab-button.active {
  color: #2e7d32;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #2e7d32;
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