<template>
    <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-800">Profil Bilgileri</h3>
        <RouterLink to="/dashboard/profile" class="text-primary-600 hover:text-primary-800 text-sm font-medium">
          Düzenle
        </RouterLink>
      </div>
  
      <div v-if="loading" class="flex flex-col space-y-3">
        <div class="animate-pulse h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="animate-pulse h-4 bg-gray-200 rounded w-1/2"></div>
        <div class="animate-pulse h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
  
      <div v-else class="flex flex-col md:flex-row">
        <!-- Avatar -->
        <div class="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          <div class="h-24 w-24 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-semibold">
            {{ userInitials }}
          </div>
        </div>
  
        <!-- Profil bilgileri -->
        <div class="flex-grow">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Ad Soyad</p>
              <p class="font-medium text-gray-800">{{ userFullName }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">T.C. Kimlik No</p>
              <p class="font-medium text-gray-800">{{ userProfile?.id_number || 'Belirtilmemiş' }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">E-posta</p>
              <p class="font-medium text-gray-800">{{ userProfile?.email || 'Belirtilmemiş' }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Rol</p>
              <p class="font-medium">
                <span 
                  class="px-2 py-1 text-xs font-medium rounded-full" 
                  :class="getRoleClass(userProfile?.roles?.[0])"
                >
                  {{ userRoleDisplay }}
                </span>
              </p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Doğum Yılı</p>
              <p class="font-medium text-gray-800">{{ userProfile?.bornYear || 'Belirtilmemiş' }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Yaş</p>
              <p class="font-medium text-gray-800">{{ userProfile?.age || 'Belirtilmemiş' }}</p>
            </div>
          </div>
  
          <!-- Tamamlanma yüzdesi -->
          <div class="mt-6">
            <div class="flex justify-between items-center mb-2">
              <p class="text-sm text-gray-500">Profil Tamamlama</p>
              <p class="text-sm font-medium text-gray-700">{{ profileCompletion }}%</p>
            </div>
            <div class="h-2 bg-gray-200 rounded-full">
              <div 
                class="h-2 bg-primary-500 rounded-full" 
                :style="{ width: `${profileCompletion}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { RouterLink } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useDashboardStore } from '@/stores/dashboard'
  
  const dashboardStore = useDashboardStore()
  const { userProfile, loading } = storeToRefs(dashboardStore)
  
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
  
  // Rola göre class döndür
  const getRoleClass = (role: string) => {
    const roleClassMap: Record<string, string> = {
      'admin': 'bg-purple-100 text-purple-800',
      'administrator': 'bg-purple-100 text-purple-800',
      'jury': 'bg-blue-100 text-blue-800',
      'applicant': 'bg-primary-100 text-primary-800'
    }
    
    return roleClassMap[role] || 'bg-gray-100 text-gray-800'
  }
  
  // Profil tamamlama yüzdesi
  const profileCompletion = computed(() => {
    if (!userProfile.value) return 0
    
    const fields = [
      userProfile.value.name,
      userProfile.value.surname,
      userProfile.value.email,
      userProfile.value.id_number,
      userProfile.value.bornYear,
      userProfile.value.age
    ]
    
    const filledFields = fields.filter(field => field !== undefined && field !== null && field !== '').length
    return Math.round((filledFields / fields.length) * 100)
  })
  
  onMounted(async () => {
    // Profil verilerini getir
    if (!userProfile.value) {
      await dashboardStore.fetchProfile()
    }
  })
  </script>