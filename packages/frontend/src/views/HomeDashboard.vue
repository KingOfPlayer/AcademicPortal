<template>
    <div>
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
  
      <!-- İstatistik Kartları -->
      <StatCards class="mb-6" />
  
      <!-- Ana İçerik Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Sol Sütun -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Aktivite Grafiği -->
          <ActivityChart />
          
          <!-- Son Başvurular -->
          <RecentApplications />
        </div>
  
        <!-- Sağ Sütun -->
        <div class="space-y-6">
          <!-- Profil Bilgileri -->
          <ProfileInfo />
          
          <!-- Güncel Duyurular -->
          <AnnouncementsList />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import StatCards from '@/components/dashboard/StatCards.vue'
  import ActivityChart from '@/components/dashboard/ActivityChart.vue'
  import RecentApplications from '@/components/dashboard/RecentApplications.vue'
  import ProfileInfo from '@/components/dashboard/ProfileInfo.vue'
  import AnnouncementsList from '@/components/dashboard/AnnouncementsList.vue'
  </script>