<template>
  <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800">Güncel Duyurular</h3>
      <RouterLink to="/dashboard/announcements" class="text-primary-600 hover:text-primary-800 text-sm font-medium">
        Tümünü Gör
      </RouterLink>
    </div>

    <div v-if="loading" class="py-4 text-center">
      <div class="animate-pulse flex flex-col space-y-3">
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
    
    <div v-else-if="announcements.length === 0" class="py-4 text-center text-gray-500">
      Aktif duyuru bulunmamaktadır.
    </div>
    
    <div v-else class="space-y-4">
      <div 
        v-for="announcement in visibleAnnouncements" 
        :key="announcement._id" 
        class="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0 mr-3">
            <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <BellIcon class="h-5 w-5 text-primary-600" />
            </div>
          </div>
          <div>
            <h4 class="text-base font-medium text-gray-800">{{ announcement.title }}</h4>
            <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ announcement.content }}</p>
            <div class="mt-2 flex items-center text-xs text-gray-500">
              <CalendarIcon class="h-3.5 w-3.5 mr-1" />
              <span>Başlangıç: {{ formatDate(announcement.startDate) }}</span>
              <span class="mx-2">•</span>
              <span>Bitiş: {{ formatDate(announcement.endDate) }}</span>
            </div>
            <div class="mt-2">
              <RouterLink 
                :to="`/dashboard/announcements/${announcement._id}`" 
                class="text-primary-600 hover:text-primary-800 text-sm"
              >
                Detaylar
              </RouterLink>
              <button 
                @click="applyAnnouncement(announcement._id)" 
                class="ml-4 px-3 py-1 text-xs font-medium rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100"
              >
                Başvur
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/dashboard'
import { BellIcon, CalendarIcon } from '@heroicons/vue/24/outline'

const dashboardStore = useDashboardStore()
const { announcements, loading } = storeToRefs(dashboardStore)

// Görüntülenecek en fazla duyuru sayısı
const maxAnnouncementsToShow = ref(3)

// UI'da gösterilecek duyuruları belirle
const visibleAnnouncements = computed(() => {
  return announcements.value.slice(0, maxAnnouncementsToShow.value)
})

// Tarihi formatla
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Duyuruya başvur
const applyAnnouncement = (announcementId: string) => {
  // Gerçek uygulamada API'ye istek göndererek başvuru oluşturulur
  alert(`${announcementId} ID'li duyuruya başvuru yapmak için başvuru sayfasına yönlendiriliyorsunuz.`)
}

onMounted(async () => {
  // Duyuru verilerini getir
  await dashboardStore.fetchAnnouncements()
});