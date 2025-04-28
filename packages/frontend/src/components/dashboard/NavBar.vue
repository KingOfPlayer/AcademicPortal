<template>
    <header class="bg-white shadow-sm">
      <div class="flex justify-between items-center px-4 py-3 lg:px-6">
        <!-- Sol taraf: Menu toggle ve başlık -->
        <div class="flex items-center">
          <button 
            @click="toggleSidebar" 
            class="md:hidden text-gray-600 hover:text-primary-600 focus:outline-none"
          >
            <Bars3Icon class="h-6 w-6" />
          </button>
          <h1 class="text-xl font-semibold text-gray-800 ml-3">{{ pageTitle }}</h1>
        </div>
  
        <!-- Sağ taraf: Arama, bildirimler ve profil -->
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Ara..." 
              class="hidden md:block bg-gray-100 rounded-md py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
            />
            <button class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <MagnifyingGlassIcon class="h-4 w-4" />
            </button>
          </div>
  
          <!-- Bildirimler -->
          <div class="relative">
            <button 
              @click="showNotifications = !showNotifications" 
              class="text-gray-600 hover:text-primary-600 focus:outline-none"
            >
              <div class="relative">
                <BellIcon class="h-6 w-6" />
                <span 
                  v-if="notificationCount > 0" 
                  class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center"
                >
                  {{ notificationCount > 9 ? '9+' : notificationCount }}
                </span>
              </div>
            </button>
  
            <!-- Bildirim dropdown -->
            <div 
              v-if="showNotifications" 
              class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
            >
              <div class="px-4 py-2 border-b border-gray-200">
                <div class="flex justify-between items-center">
                  <h3 class="font-semibold text-gray-800">Bildirimler</h3>
                  <button 
                    v-if="notifications.length > 0" 
                    @click="markAllAsRead" 
                    class="text-xs text-primary-600 hover:text-primary-800"
                  >
                    Tümünü okundu işaretle
                  </button>
                </div>
              </div>
              
              <div class="max-h-96 overflow-y-auto">
                <div v-if="notifications.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
                  Bildirim bulunmamaktadır
                </div>
                <div 
                  v-for="notification in notifications" 
                  :key="notification.id" 
                  class="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  :class="{ 'bg-primary-50': !notification.read }"
                >
                  <div class="flex">
                    <div class="flex-shrink-0 mr-3">
                      <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <component :is="getNotificationIcon(notification.type)" class="h-4 w-4 text-primary-600" />
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-800">{{ notification.title }}</p>
                      <p class="text-xs text-gray-500 mt-1">{{ notification.message }}</p>
                      <p class="text-xs text-gray-400 mt-1">{{ formatDate(notification.date) }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="notifications.length > 0" class="px-4 py-2 border-t border-gray-200">
                <button class="w-full text-center text-xs text-primary-600 hover:text-primary-800">
                  Tüm bildirimleri gör
                </button>
              </div>
            </div>
          </div>
  
          <!-- Profil dropdown -->
          <div class="relative">
            <button 
              @click="showProfileMenu = !showProfileMenu" 
              class="flex items-center space-x-2 focus:outline-none"
            >
              <div class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                {{ userInitials }}
              </div>
              <span class="hidden md:block text-gray-700">{{ userFullName }}</span>
              <ChevronDownIcon class="hidden md:block h-4 w-4 text-gray-500" />
            </button>
  
            <div 
              v-if="showProfileMenu" 
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
            >
              <RouterLink to="/dashboard/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profil
              </RouterLink>
              <RouterLink to="/dashboard/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Ayarlar
              </RouterLink>
              <div class="border-t border-gray-100 my-1"></div>
              <button 
                @click="logout" 
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRoute, useRouter, RouterLink } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useDashboardStore } from '@/stores/dashboard'
  import { 
    Bars3Icon, 
    MagnifyingGlassIcon, 
    BellIcon, 
    ChevronDownIcon,
    DocumentTextIcon,
    BellAlertIcon,
    CheckCircleIcon,
    ExclamationCircleIcon
  } from '@heroicons/vue/24/outline'
  
  const dashboardStore = useDashboardStore()
  const { userProfile } = storeToRefs(dashboardStore)
  const route = useRoute()
  const router = useRouter()
  
  // UI state
  const showNotifications = ref(false)
  const showProfileMenu = ref(false)
  
  // Sayfa başlığını hesaplama
  const pageTitle = computed(() => {
    const pathMap: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/dashboard/profile': 'Profil',
      '/dashboard/announcements': 'Duyurular',
      '/dashboard/applications': 'Başvurularım',
      '/dashboard/admin': 'Yönetim Paneli',
      '/dashboard/evaluations': 'Değerlendirmeler'
    }
    
    return pathMap[route.path] || 'Dashboard'
  })
  
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
  
  // Örnek bildirimler (gerçek uygulamada API'den gelir)
  const notifications = ref([
    {
      id: 1,
      title: 'Başvurunuz Onaylandı',
      message: 'Dr. Öğr. Üyesi pozisyonu için başvurunuz onaylandı.',
      date: new Date(Date.now() - 1000 * 60 * 30), // 30 dakika önce
      read: false,
      type: 'success'
    },
    {
      id: 2,
      title: 'Yeni Duyuru',
      message: 'Mühendislik Fakültesi için yeni bir kadro ilanı yayınlandı.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 saat önce
      read: true,
      type: 'info'
    },
    {
      id: 3,
      title: 'Belge Eksikliği',
      message: 'Doçentlik başvurunuzda eksik belgeler tespit edildi.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 gün önce
      read: false,
      type: 'warning'
    }
  ])
  
  // Bildirim sayısı hesaplama
  const notificationCount = computed(() => {
    return notifications.value.filter(n => !n.read).length
  })
  
  // Bildirim ikonu seçimi
  const getNotificationIcon = (type: string) => {
    const iconMap: Record<string, any> = {
      'success': CheckCircleIcon,
      'warning': ExclamationCircleIcon,
      'info': BellAlertIcon,
      'default': BellIcon
    }
    return iconMap[type] || iconMap.default
  }
  
  // Methods
  const toggleSidebar = () => {
    // Sidebar'ı açıp kapatma işlemini event ile gerçekleştirilecek
    document.dispatchEvent(new CustomEvent('toggle-sidebar'))
  }
  
  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    // 1 dakikadan az
    if (diff < 60 * 1000) {
      return 'Az önce'
    }
    
    // 1 saatten az
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000))
      return `${minutes} dakika önce`
    }
    
    // 1 günden az
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000))
      return `${hours} saat önce`
    }
    
    // 1 günden fazla
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    return `${days} gün önce`
  }
  
  const markAllAsRead = () => {
    notifications.value = notifications.value.map(n => ({ ...n, read: true }))
  }
  
  const logout = () => {
    // Oturum bilgilerini temizle
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Login sayfasına yönlendir
    router.push('/login')
  }
  
  // Dışarı tıklandığında dropdown'ları kapat
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    
    if (showNotifications.value && !target.closest('.notifications-dropdown')) {
      showNotifications.value = false
    }
    
    if (showProfileMenu.value && !target.closest('.profile-dropdown')) {
      showProfileMenu.value = false
    }
  }
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  });