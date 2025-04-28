<template>
    <div>
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Başvurularım</h1>
  
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
                placeholder="Başvuru, bölüm..." 
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
              <option value="pending">Beklemede</option>
              <option value="approved">Onaylandı</option>
              <option value="rejected">Reddedildi</option>
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
        </div>
      </div>
  
      <!-- Başvuru listesi -->
      <div v-else>
        <div v-if="filteredApplications.length === 0" class="bg-white rounded-lg shadow-sm p-6 border border-gray-200 text-center">
          <p class="text-gray-500">Henüz bir başvurunuz bulunmamaktadır.</p>
          <RouterLink to="/dashboard/announcements" class="inline-block mt-4 px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700">
            Duyurulara Göz At
          </RouterLink>
        </div>
  
        <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <!-- Başvuru tablosu -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başvuru</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bölüm</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="application in filteredApplications" 
                  :key="application._id" 
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ application.title }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">{{ application.department }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">{{ formatDate(application.date) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 py-1 text-xs font-medium rounded-full" 
                      :class="{
                        'bg-yellow-100 text-yellow-800': application.status === 'pending',
                        'bg-green-100 text-green-800': application.status === 'approved',
                        'bg-red-100 text-red-800': application.status === 'rejected'
                      }"
                    >
                      {{ getStatusText(application.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <div class="flex space-x-2">
                      <RouterLink 
                        :to="`/dashboard/applications/${application._id}`" 
                        class="text-primary-600 hover:text-primary-800"
                      >
                        Detaylar
                      </RouterLink>
                      <button 
                        v-if="application.status === 'pending'" 
                        @click="cancelApplication(application._id)" 
                        class="text-red-600 hover:text-red-800"
                      >
                        İptal
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      <!-- Yeni Başvuru Butonu -->
      <div class="mt-6 flex justify-end">
        <RouterLink to="/dashboard/announcements" class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Yeni Başvuru
        </RouterLink>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, reactive, onMounted } from 'vue'
  import { RouterLink } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useDashboardStore } from '@/stores/dashboard'
  import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
  
  const dashboardStore = useDashboardStore()
  const { applications, loading } = storeToRefs(dashboardStore)
  
  // Filtreler
  const filters = reactive({
    search: '',
    status: 'all', // 'all', 'pending', 'approved', 'rejected'
    sort: 'date-desc' // 'date-desc', 'date-asc', 'title-asc', 'title-desc'
  })
  
  // Filtrelenmiş başvurular
  const filteredApplications = computed(() => {
    let result = [...applications.value]
    
    // Arama filtresi
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(application => 
        application.title.toLowerCase().includes(searchLower) || 
        application.department.toLowerCase().includes(searchLower)
      )
    }
    
    // Durum filtresi
    if (filters.status !== 'all') {
      result = result.filter(application => application.status === filters.status)
    }
    
    // Sıralama
    result.sort((a, b) => {
      switch (filters.sort) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
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
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'Beklemede',
      'approved': 'Onaylandı',
      'rejected': 'Reddedildi'
    }
    return statusMap[status] || 'Bilinmiyor'
  }
  
  const cancelApplication = (applicationId: string) => {
    if (confirm('Bu başvuruyu iptal etmek istediğinizden emin misiniz?')) {
      // Gerçek uygulamada API'ye istek göndererek başvuru iptal edilir
      alert(`${applicationId} ID'li başvurunuz iptal edildi.`)
    }
  }
  
  onMounted(async () => {
    // Başvuru verilerini getir
    await dashboardStore.fetchApplications()
  })
  </script>