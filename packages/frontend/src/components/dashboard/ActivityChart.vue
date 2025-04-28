<template>
    <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-800">Aktivite Grafiği</h3>
        <div class="flex items-center space-x-2">
          <select v-model="selectedPeriod" class="text-sm bg-gray-100 border-0 rounded-md p-2">
            <option value="weekly">Haftalık</option>
            <option value="monthly">Aylık</option>
            <option value="yearly">Yıllık</option>
          </select>
        </div>
      </div>
      
      <div class="h-72">
        <canvas ref="chartRef"></canvas>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import Chart from 'chart.js/auto'
  import { storeToRefs } from 'pinia'
  import { useDashboardStore } from '@/stores/dashboard'
  
  const chartRef = ref<HTMLCanvasElement | null>(null)
  const selectedPeriod = ref('monthly')
  let chartInstance: Chart | null = null
  
  const dashboardStore = useDashboardStore()
  const { activities } = storeToRefs(dashboardStore)
  
  // Grafik renklerini tanımla
  const chartColors = {
    primary: 'rgba(22, 163, 74, 1)',
    primaryLight: 'rgba(22, 163, 74, 0.1)',
    gridLines: 'rgba(228, 228, 231, 0.5)'
  }
  
  // Grafiği oluştur
  const renderChart = () => {
    if (!chartRef.value) return
    
    // Eğer önceden oluşturulmuş bir grafik varsa temizle
    if (chartInstance) {
      chartInstance.destroy()
    }
    
    // Veri hazırla
    const labels = activities.value.map((activity: any) => activity.month)
    const data = activities.value.map((activity: any) => activity.count)
    
    const ctx = chartRef.value.getContext('2d')
    if (!ctx) return
    
    // Grafik konfigürasyonu
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Aktiviteler',
            data,
            borderColor: chartColors.primary,
            backgroundColor: chartColors.primaryLight,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: chartColors.primary,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#333',
            bodyColor: '#666',
            borderColor: '#e1e1e1',
            borderWidth: 1,
            padding: 10,
            boxPadding: 5,
            usePointStyle: true,
            callbacks: {
              title: function(items) {
                return items[0].label
              },
              label: function(context) {
                return `Aktivite Sayısı: ${context.parsed.y}`
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 12
              },
              color: '#6b7280'
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: chartColors.gridLines
            },
            ticks: {
              font: {
                size: 12
              },
              color: '#6b7280',
              stepSize: 2
            }
          }
        }
      }
    })
  }
  
  // Zaman periyodu değiştiğinde grafiği güncelle
  watch(selectedPeriod, () => {
    // Gerçek uygulamada periyoda göre veri güncelleme yapılacak
    // Örnek olarak yalnızca grafiği yeniden render ediyoruz
    renderChart()
  })
  
  // Aktivite verileri değiştiğinde grafiği güncelle
  watch(activities, () => {
    renderChart()
  }, { deep: true })
  
  onMounted(async () => {
    // Aktivite verilerini getir
    await dashboardStore.fetchActivities()
    
    // Grafik render edildi
    renderChart()
  })
  </script>