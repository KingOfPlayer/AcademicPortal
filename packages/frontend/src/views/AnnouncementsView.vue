<template>
    <div>
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Duyurular</h1>
  
      <!-- Filtreler -->
      <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-6">
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div class="flex-grow">
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Ara</label>
            <div class="relative">
              <input 
                id="search"
                type="text" 
                v-model="filters.search" 
                placeholder="Duyuru başlığı, içeriği..." 
                class="w-full pr-10 border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <span class="absolute inset-y-0 right-0 flex items-center pr-3">
                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
              </span>
            </div>
          </div>
          
          <div class="w-full md:w-48">
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Durum</label>
            <select 
              id="status"
              v-model="filters.status" 
              class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Tümü</option>
              <option value="active">Aktif</option>
              <option value="expired">Süresi Dolmuş</option>
            </select>
          </div>
          
          <div class="w-full md:w-48">
            <label for="sort" class="block text-sm font-medium text-gray-700 mb-1">Sıralama</label>
            <select 
              id="sort"
              v-model="filters.sort" 
              class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="date-desc">Tarihe Göre (Yeni-Eski)</option>
              <option value="date-asc">Tarihe Göre (Eski-Yeni)</option>
              <option value="title-asc">Başlığa Göre (A-Z)</option>
              <option value="title-desc">Başlığa Göre (Z-A)</option>
            </select>
          </div>
        </div>
      </div>
  
      <!-- Yükleniyor durumu -->
      <div v-if="loading" class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div class="flex flex-col space-y-4">
          <div class="animate-pulse flex space-x-4">
            <div class="flex-1 space-y-4 py-1">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 rounded"></div>
                <div class="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
          <div class="animate-pulse flex space-x-4">
            <div class="flex-1 space-y-4 py-1">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 rounded"></div>
                <div class="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
          <div class="animate-pulse flex space-x-4">
            <div class="flex-1 space-y-4 py-1">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 rounded"></div>
                <div class="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Duyuru listesi -->
      <div v-else>
        <div v-if="filteredAnnouncements.length === 0" class="bg-white rounded-lg shadow-sm p-6 border border-gray-200 text-center">
          <p class="text-gray-500">Belirtilen kriterlere uygun duyuru bulunamadı.</p>
        </div>
  
        <div v-else class="space-y-6">
          <div 
            v-for="announcement in filteredAnnouncements" 
            :key="announcement._id" 
            class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div class="border-l-4" :class="getStatusBorderClass(announcement)">
              <div class="p-5">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">{{ announcement.title }}</h3>
                    <div class="flex items-center mt-1 text-sm text-gray-500">
                      <CalendarIcon class="h-4 w-4 mr-1" />
                      <span>Başlangıç: {{ formatDate(announcement.startDate) }}</span>
                      <span class="mx-2">•</span>
                      <span>Bitiş: {{ formatDate(announcement.endDate) }}</span>
                    </div>
                  </div>
                  <span 
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getStatusClass(announcement)"
                  >
                    {{ getStatusText(announcement) }}
                  </span>
                </div>
                
                <div class="mt-3">
                  <p class="text-gray-600">{{ truncateContent(announcement.content) }}</p>
                </div>
                
                <div class="mt-4 flex items-center justify-between">
                  <RouterLink 
                    :to="`/dashboard/announcements/${announcement._id}`" 
                    class="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    Detayları Görüntüle
                  </RouterLink>
                  
                  <button 
                    v-if="isAnnouncementActive(announcement)"
                    @click="applyAnnouncement(announcement._id)" 
                    class="px-4 py-2 text-sm font-medium rounded-md bg-primary-100 text-primary-700 hover:bg-primary-200"
                  >
                    Başvur
                  </button>
                  <button 
                    v-else
                    disabled
                    class="px-4 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-400 cursor-not-allowed"
                  >
                    Başvuru Süresi Doldu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, reactive, onMounted } from 'vue'
  import { RouterLink } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useDashboardStore } from '@/stores/dashboard'
  import { MagnifyingGlassIcon, CalendarIcon } from '@heroicons/vue/24/outline'
  
  const dashboardStore = useDashboardStore()
  const { announcements, loading } = storeToRefs(dashboardStore)
  
  // Filtreler
  const filters = reactive({
    search: '',
    status: 'all', // 'all', 'active', 'expired'
    sort: 'date-desc' // 'date-desc', 'date-asc', 'title-asc', 'title-desc'
  })
  
  // Filtrelenmiş duyurular
  const filteredAnnouncements = computed(() => {
    let result = [...announcements.value]
    
    // Arama filtresi
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(announcement => 
        announcement.title.toLowerCase().includes(searchLower) || 
        announcement.content.toLowerCase().includes(searchLower)
      )
    }
    
    // Durum filtresi
    if (filters.status !== 'all') {
      const now = new Date()
      if (filters.status === 'active') {
        result = result.filter(announcement => 
          new Date(announcement.endDate) >= now
        )
      } else if (filters.status === 'expired') {
        result = result.filter(announcement => 
          new Date(announcement.endDate) < now
        )
      }
    }
    
    // Sıralama
    result.sort((a, b) => {
      switch (filters.sort) {
        case 'date-desc':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        case 'date-asc':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        case 'title-asc':
          return a.title.localeCompare(b.title)
        case 'title-desc':
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })
    
    return result
  })
  
  // Yardımcı fonksiyonlar
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }
  
  const isAnnouncementActive = (announcement: any) => {
    const now = new Date()
    return new Date(announcement.endDate) >= now
  }
  
  const getStatusText = (announcement: any) => {
    return isAnnouncementActive(announcement) ? 'Aktif' : 'Süresi Doldu'
  }
  
  const getStatusClass = (announcement: any) => {
    return isAnnouncementActive(announcement) 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'
  }
  
  const getStatusBorderClass = (announcement: any) => {
    return isAnnouncementActive(announcement) 
      ? 'border-primary-500' 
      : 'border-gray-300'
  }
  
  const applyAnnouncement = (announcementId: string) => {
    // Gerçek uygulamada API'ye istek göndererek başvuru oluşturulur
    alert(`${announcementId} ID'li duyuruya başvuru yapmak için başvuru sayfasına yönlendiriliyorsunuz.`)
  }
  
  onMounted(async () => {
    // Duyuru verilerini getir
    await dashboardStore.fetchAnnouncements()
  });