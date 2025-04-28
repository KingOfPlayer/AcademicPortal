<template>
    <div class="dashboard-container min-h-screen bg-gray-50">
      <SideBar />
      <div class="md:ml-64 flex flex-col min-h-screen">
        <NavBar />
        <main class="flex-grow p-4 md:p-6">
          <RouterView />
        </main>
        <footer class="bg-white p-4 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>© {{ currentYear }} Kocaeli Üniversitesi - Akademik Personel Başvuru Sistemi</p>
        </footer>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { RouterView } from 'vue-router'
  import { useDashboardStore } from '@/stores/dashboard'
  import SideBar from '@/components/dashboard/SideBar.vue'
  import NavBar from '@/components/dashboard/NavBar.vue'
  
  const dashboardStore = useDashboardStore()
  const currentYear = computed(() => new Date().getFullYear())
  
  onMounted(async () => {
    // Dashboard verilerini yükle
    await Promise.all([
      dashboardStore.fetchProfile(),
      dashboardStore.fetchAnnouncements()
    ])
  })
  </script>
  
  <style scoped>
  /* TailwindCSS varsayılan olarak layout için yeterli olduğundan ekstra CSS'e ihtiyaç duymuyoruz */
  </style>