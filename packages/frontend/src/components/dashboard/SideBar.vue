<template>
    <div 
      class="fixed top-0 left-0 h-full bg-primary-800 text-white w-64 transform transition-transform duration-300 ease-in-out z-30"
      :class="{ '-translate-x-full': !isSidebarOpen, 'md:translate-x-0': true }"
    >
      <!-- Logo ve başlık -->
      <div class="flex items-center justify-center p-4 bg-primary-900">
        <img src="@/assets/logo.svg" alt="Logo" class="h-10 w-10 mr-3 filter brightness-0 invert" />
        <h1 class="text-xl font-semibold">Akademik Portal</h1>
      </div>
  
      <!-- Kullanıcı bilgisi -->
      <div class="p-4 border-b border-primary-700">
        <div class="flex items-center mb-3">
          <div class="bg-primary-600 p-2 rounded-full">
            <div class="h-8 w-8 rounded-full bg-primary-400 flex items-center justify-center">
              <span class="text-primary-900 font-semibold">{{ userInitials }}</span>
            </div>
          </div>
          <div class="ml-3">
            <p class="font-medium text-sm">{{ userFullName }}</p>
            <p class="text-xs text-primary-200">{{ userRoleDisplay }}</p>
          </div>
        </div>
      </div>
  
      <!-- Menü -->
      <nav class="p-4">
        <ul class="space-y-2">
          <li v-for="item in menuItems" :key="item.name">
            <RouterLink 
              :to="item.path" 
              class="flex items-center p-2 rounded-md hover:bg-primary-700 transition-colors"
              :class="{ 'bg-primary-700': isActive(item.path) }"
            >
              <component :is="item.icon" class="h-5 w-5 mr-3" />
              <span>{{ item.name }}</span>
            </RouterLink>
          </li>
        </ul>
      </nav>
  
      <!-- Ayarlar ve Çıkış -->
      <div class="absolute bottom-0 w-full p-4 border-t border-primary-700">
        <ul class="space-y-2">
          <li>
            <RouterLink 
              to="/dashboard/profile" 
              class="flex items-center p-2 rounded-md hover:bg-primary-700 transition-colors"
              :class="{ 'bg-primary-700': isActive('/dashboard/profile') }"
            >
              <UserCircleIcon class="h-5 w-5 mr-3" />
              <span>Profil</span>
            </RouterLink>
          </li>
          <li>
            <button 
              @click="logout" 
              class="flex items-center p-2 w-full text-left rounded-md hover:bg-primary-700 transition-colors"
            >
              <ArrowRightOnRectangleIcon class="h-5 w-5 mr-3" />
              <span>Çıkış Yap</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  
    <!-- Mobile backdrop -->
    <div 
      v-if="isSidebarOpen" 
      @click="closeSidebar"
      class="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
    ></div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter, RouterLink } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useDashboardStore } from '@/stores/dashboard'
  import { UserCircleIcon, HomeIcon, BellIcon, DocumentTextIcon, UserGroupIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
  
  // Store
  const dashboardStore = useDashboardStore()
  const { userProfile } = storeToRefs(dashboardStore)
  const router = useRouter()
  
  // Sidebar state
  const isSidebarOpen = ref(false)
  
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
  
  // Menü yapılandırması
  const menuItems = computed(() => {
    const items = [
      { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
      { name: 'Duyurular', path: '/dashboard/announcements', icon: BellIcon },
      { name: 'Başvurularım', path: '/dashboard/applications', icon: DocumentTextIcon },
    ]
  
    // Admin veya yönetici ise ek menü öğesi
    if (userProfile.value?.roles?.includes('admin') || userProfile.value?.roles?.includes('administrator')) {
      items.push({ name: 'Yönetim', path: '/dashboard/admin', icon: Cog6ToothIcon })
    }
  
    // Jüri üyesi ise değerlendirme öğesi
    if (userProfile.value?.roles?.includes('jury')) {
      items.push({ name: 'Değerlendirmeler', path: '/dashboard/evaluations', icon: UserGroupIcon })
    }
  
    return items
  })
  
  // Methods
  const isActive = (path: string) => {
    return router.currentRoute.value.path.startsWith(path)
  }
  
  const closeSidebar = () => {
    isSidebarOpen.value = false
  }
  
  const logout = () => {
    // Oturum bilgilerini temizle
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Login sayfasına yönlendir
    router.push('/login')
  }
  </script>