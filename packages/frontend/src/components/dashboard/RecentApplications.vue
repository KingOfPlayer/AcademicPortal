<template>
    <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-800">Son Başvurular</h3>
        <RouterLink to="/dashboard/applications" class="text-primary-600 hover:text-primary-800 text-sm font-medium">
          Tümünü Gör
        </RouterLink>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Başvuru Adı
              </th>
              <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bölüm
              </th>
              <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih
              </th>
              <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlem
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="application in applications" :key="application._id" class="border-b border-gray-200 hover:bg-gray-50">
              <td class="py-3 px-4 text-sm text-gray-800">
                {{ application.title }}
              </td>
              <td class="py-3 px-4 text-sm text-gray-600">
                {{ application.department }}
              </td>
              <td class="py-3 px-4 text-sm text-gray-600">
                {{ formatDate(application.date) }}
              </td>
              <td class="py-3 px-4 text-sm">
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
              <td class="py-3 px-4 text-sm">
                <RouterLink 
                  :to="`/dashboard/applications/${application._id}`" 
                  class="text-primary-600 hover:text-primary-800"
                >
                  Detaylar
                </RouterLink>
              </td>
            </tr>
            
            <tr v-if="applications.length === 0">
              <td colspan="5" class="py-4 text-center text-gray-500">
                Hiç başvurunuz bulunmamaktadır.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { RouterLink } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useDashboardStore } from '@/stores/dashboard'
  
  const dashboardStore = useDashboardStore()
  const { applications } = storeToRefs(dashboardStore)
  
  // Durumu insan tarafından okunabilir metne dönüştür
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'Beklemede',
      'approved': 'Onaylandı',
      'rejected': 'Reddedildi'
    }
    return statusMap[status] || 'Bilinmiyor'
  }
  
  // Tarihi formatla
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  onMounted(async () => {
    // Başvuru verilerini getir
    await dashboardStore.fetchApplications()
  })
  </script>