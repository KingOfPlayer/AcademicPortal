<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-6">
        <div class="flex justify-center mb-6">
          <img src="../assets/university-logo.png" alt="University Logo" class="h-24" />
        </div>
        
        <h1 class="text-center text-2xl font-bold text-gray-900 mb-6">Sistem Girişi</h1>
        
        <form @submit.prevent="login" class="space-y-6">
          <div>
            <label for="tc" class="block text-sm font-medium text-gray-700">T.C. Kimlik numarası</label>
            <input 
              type="text" 
              id="tc" 
              v-model="credentials.tc" 
              placeholder="T.C. Kimlik numarası" 
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Şifre</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="credentials.password" 
                placeholder="Şifrenizi Giriniz" 
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-12"
              />
              <button 
                type="button" 
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
              >
                {{ showPassword ? 'Gizle' : 'Göster' }}
              </button>
            </div>
          </div>
          
          <div>
            <button 
              type="submit" 
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Giriş Yap
            </button>
          </div>
        </form>
        
        <div class="mt-4 flex items-center justify-between">
          <a href="#" @click.prevent="forgotPassword" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Şifremi Unuttum
          </a>
          <a href="#" @click.prevent="register" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Kayıt Ol
          </a>
        </div>
        
        <div v-if="errorMessage" class="mt-6 bg-red-50 border-l-4 border-red-500 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">
                {{ errorMessage }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/auth.service';

interface Credentials {
  tc: string;
  password: string;
}

export default defineComponent({
  name: 'LoginPage',
  
  setup() {
    const router = useRouter();
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
          errorMessage.value = 'Lütfen T.C. Kimlik No giriniz';
          return;
        }
        
        if (!credentials.password) {
          errorMessage.value = 'Lütfen şifrenizi giriniz';
          return;
        }
        
        // Login
        await authService.login(credentials);
        
        // Redirect to dashboard
        router.push('/dashboard');
      } catch (error: any) {
        console.error('Login error:', error);
        errorMessage.value = error.response?.data?.message || 'Giriş başarısız. Lütfen T.C. Kimlik No ve şifrenizi kontrol ediniz.';
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