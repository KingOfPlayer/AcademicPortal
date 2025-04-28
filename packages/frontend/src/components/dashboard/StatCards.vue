<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <!-- Bekleyen Başvurular -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-gray-500 text-sm font-medium">Bekleyen Başvurular</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">{{ stats.pendingApplications }}</p>
          </div>
          <div class="bg-primary-100 p-2 rounded-lg">
            <DocumentTextIcon class="h-6 w-6 text-primary-700" />
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <span :class="stats.pendingChange > 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
            {{ stats.pendingChange > 0 ? '+' : '' }}{{ stats.pendingChange }}%
          </span>
          <span class="text-gray-500 text-sm ml-2">geçen aydan</span>
        </div>
      </div>
  
      <!-- Onaylanan Başvurular -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-gray-500 text-sm font-medium">Onaylanan Başvurular</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">{{ stats.approvedApplications }}</p>
          </div>
          <div class="bg-green-100 p-2 rounded-lg">
            <CheckCircleIcon class="h-6 w-6 text-green-700" />
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <span :class="stats.approvedChange > 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
            {{ stats.approvedChange > 0 ? '+' : '' }}{{ stats.approvedChange }}%
          </span>
          <span class="text-gray-500 text-sm ml-2">geçen aydan</span>
        </div>
      </div>
  
      <!-- Aktif Duyurular -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-gray-500 text-sm font-medium">Aktif Duyurular</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">{{ stats.activeAnnouncements }}</p>
          </div>
          <div class="bg-blue-100 p-2 rounded-lg">
            <BellIcon class="h-6 w-6 text-blue-700" />
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <span :class="stats.announcementChange > 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
            {{ stats.announcementChange > 0 ? '+' : '' }}{{ stats.announcementChange }}%
          </span>
          <span class="text-gray-500 text-sm ml-2">geçen aydan</span>
        </div>
      </div>
  
      <!-- Toplam Puan -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-gray-500 text-sm font-medium">Toplam Puan</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">{{ stats.totalPoints }}</p>
          </div>
          <div class="bg-purple-100 p-2 rounded-lg">
            <StarIcon class="h-6 w-6 text-purple-700" />
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <span :class="stats.pointsChange > 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
            {{ stats.pointsChange > 0 ? '+' : '' }}{{ stats.pointsChange }}%
          </span>
          <span class="text-gray-500 text-sm ml-2">geçen aydan</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { 
    DocumentTextIcon, 
    CheckCircleIcon, 
    BellIcon, 
    StarIcon 
  } from '@heroicons/vue/24/outline'
  
  // Örnek istatistikler (gerçek uygulamada API'den gelecektir)
  const stats = ref({
    pendingApplications: 3,
    pendingChange: 20,
    approvedApplications: 12,
    approvedChange: 10,
    activeAnnouncements: 5,
    announcementChange: -5,
    totalPoints: 325,
    pointsChange: 15
  })
  
  onMounted(() => {
    // API'den verileri getir
    // fetchStats()
  })
  
  // API'den veri çekme fonksiyonu
  /*
  async function fetchStats() {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      stats.value = data
    } catch (error) {
      console.error('Stats verileri alınamadı:', error)
    }
  }
  */
  </script>