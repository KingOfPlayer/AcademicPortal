<template>
    <div>
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Profil Bilgileri</h1>
  
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- Header -->
        <div class="bg-primary-800 py-8 px-8">
          <div class="flex flex-col md:flex-row items-center">
            <div class="flex-shrink-0 mb-4 md:mb-0">
              <div class="h-32 w-32 rounded-full bg-white flex items-center justify-center text-primary-800 text-4xl font-bold">
                {{ userInitials }}
              </div>
            </div>
            <div class="md:ml-6 text-center md:text-left">
              <h2 class="text-2xl font-bold text-white">{{ userFullName }}</h2>
              <p class="text-primary-100 mt-1">{{ userRoleDisplay }}</p>
              <p class="text-primary-200 mt-1">{{ userProfile?.email || 'E-posta belirtilmemiş' }}</p>
            </div>
          </div>
        </div>
  
        <!-- Content -->
        <div class="p-6">
          <div v-if="loading" class="flex flex-col space-y-4">
            <div class="animate-pulse h-6 bg-gray-200 rounded w-1/4"></div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="animate-pulse h-12 bg-gray-200 rounded"></div>
              <div class="animate-pulse h-12 bg-gray-200 rounded"></div>
              <div class="animate-pulse h-12 bg-gray-200 rounded"></div>
              <div class="animate-pulse h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          <div v-else>
            <!-- Kişisel Bilgiler -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Kişisel Bilgiler</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">T.C. Kimlik No</label>
                  <div class="bg-gray-50 border border-gray-300 rounded-md px-4 py-2.5">
                    {{ userProfile?.id_number || 'Belirtilmemiş' }}
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                  <input 
                    type="text" 
                    v-model="form.name" 
                    class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
  
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                  <input 
                    type="text" 
                    v-model="form.surname" 
                    class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                  <input 
                    type="email" 
                    v-model="form.email" 
                    class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Doğum Yılı</label>
                  <input 
                    type="number" 
                    v-model="form.bornYear" 
                    class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
  
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <div class="bg-gray-50 border border-gray-300 rounded-md px-4 py-2.5">
                    {{ userRoleDisplay }}
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Şifre Değiştir -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Şifre Değiştir</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifre</label>
                  <input 
                    type="password" 
                    v-model="form.currentPassword" 
                    class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div></div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
                  <input 
                    type="password" 
                    v-model="form.newPassword" 
                    class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Tekrar)</label>
                  <input 
                    type="password" 
                    v-model="form.confirmPassword" 
                    class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
  
            <!-- Kaydet Butonu -->
            <div class="flex justify-end">
              <button 
                @click="saveProfile" 
                class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                :disabled="isSaving"
              >
                <span v-if="isSaving">Kaydediliyor...</span>
                <span v-else>Değişiklikleri Kaydet</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, reactive } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useDashboardStore } from '@/stores/dashboard'
  
  const dashboardStore = useDashboardStore()
  const { userProfile, loading } = storeToRefs(dashboardStore)
  
  // Form state
  const form = reactive({
    name: '',
    surname: '',
    email: '',
    bornYear: 0,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const isSaving = ref(false)
  
  // Kullanıcı bilgileri
  const userFullName = computed(() => {
    if (userProfile.value) {
      return `${userProfile.value.name} ${userProfile.value.surname}`
    }
    return 'Kullanıcı'
  })
  
  const userInitials = computed(() => {
    if (userProfile.value) {
      return `${userProfile.value.name?.charAt(0)}${userProfile.value.surname?.charAt(0)}`
    }
    return 'KU'
  })
  
  const userRoleDisplay = computed(() => {
    if (!userProfile.value || !userProfile.value.roles || userProfile.value.roles.length === 0) {
      return 'Aday'
    }
  
    const roleMap: Record<string, string> = {
      'admin': 'Yönetici',
      'administrator': 'Yönetici',
      'jury': 'Jüri Üyesi',
      'applicant': 'Aday'
    }
  
    return roleMap[userProfile.value.roles[0]] || 'Aday'
  })
  
  // Form kontrollerini doldur
  const populateForm = () => {
    if (userProfile.value) {
      form.name = userProfile.value.name || ''
      form.surname = userProfile.value.surname || ''
      form.email = userProfile.value.email || ''
      form.bornYear = userProfile.value.bornYear || 0
    }
  }
  
  // Profil değişikliklerini kaydet
  const saveProfile = async () => {
    try {
      isSaving.value = true
      
      // Şifreyi değiştir
      if (form.currentPassword && form.newPassword) {
        if (form.newPassword !== form.confirmPassword) {
          alert('Yeni şifreler eşleşmiyor')
          return
        }
        
        // Şifre değiştirme API çağrısı burada olacak
      }
      
      // Profil güncelleme API çağrısı burada olacak
      // Örnek:
      /*
      await axios.put('/api/v1/user/update', {
        name: form.name,
        surname: form.surname,
        email: form.email,
        bornYear: form.bornYear
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      */
      
      // Başarılı olduğunda kullanıcıya bilgilendirme yap
      setTimeout(() => {
        alert('Profil bilgileriniz başarıyla güncellendi')
        isSaving.value = false
        
        // Şifre alanlarını temizle
        form.currentPassword = ''
        form.newPassword = ''
        form.confirmPassword = ''
      }, 1000)
      
    } catch (error) {
      console.error('Profil güncelleme hatası:', error)
      alert('Profil güncellenirken bir hata oluştu')
      isSaving.value = false
    }
  }
  
  onMounted(async () => {
    // Profil verilerini getir
    if (!userProfile.value) {
      await dashboardStore.fetchProfile()
    }
    
    // Form alanlarını doldur
    populateForm()
  })
  </script>