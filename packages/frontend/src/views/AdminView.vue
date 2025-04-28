<template>
    <div>
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Yönetim Paneli</h1>
  
      <!-- Admin Dashboard Kartları -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Toplam Duyuru -->
        <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
          <div class="flex justify-between">
            <div>
              <p class="text-sm text-gray-500 font-medium">Toplam Duyuru</p>
              <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.totalAnnouncements }}</p>
            </div>
            <div class="bg-blue-100 p-2 rounded-lg">
              <BellIcon class="h-6 w-6 text-blue-700" />
            </div>
          </div>
        </div>
        
        <!-- Toplam Başvuru -->
        <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
          <div class="flex justify-between">
            <div>
              <p class="text-sm text-gray-500 font-medium">Toplam Başvuru</p>
              <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.totalApplications }}</p>
            </div>
            <div class="bg-primary-100 p-2 rounded-lg">
              <DocumentTextIcon class="h-6 w-6 text-primary-700" />
            </div>
          </div>
        </div>
        
        <!-- Bekleyen Değerlendirme -->
        <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
          <div class="flex justify-between">
            <div>
              <p class="text-sm text-gray-500 font-medium">Bekleyen Değerlendirme</p>
              <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.pendingReviews }}</p>
            </div>
            <div class="bg-yellow-100 p-2 rounded-lg">
              <ClockIcon class="h-6 w-6 text-yellow-700" />
            </div>
          </div>
        </div>
        
        <!-- Toplam Kullanıcı -->
        <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
          <div class="flex justify-between">
            <div>
              <p class="text-sm text-gray-500 font-medium">Toplam Kullanıcı</p>
              <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.totalUsers }}</p>
            </div>
            <div class="bg-purple-100 p-2 rounded-lg">
              <UserGroupIcon class="h-6 w-6 text-purple-700" />
            </div>
          </div>
        </div>
      </div>
  
      <!-- Ana İçerik Panelleri -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Hızlı İşlemler -->
        <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Hızlı İşlemler</h2>
          
          <div class="space-y-3">
            <button 
              @click="navigateTo('new-announcement')" 
              class="w-full flex items-center p-3 rounded-md bg-primary-50 text-primary-700 hover:bg-primary-100"
            >
              <PlusIcon class="h-5 w-5 mr-3" />
              <span>Yeni Duyuru Ekle</span>
            </button>
            
            <button 
              @click="navigateTo('manage-users')" 
              class="w-full flex items-center p-3 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              <UserPlusIcon class="h-5 w-5 mr-3" />
              <span>Kullanıcı Yönetimi</span>
            </button>
            
            <button 
              @click="navigateTo('manage-disciplines')" 
              class="w-full flex items-center p-3 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100"
            >
              <AcademicCapIcon class="h-5 w-5 mr-3" />
              <span>Disiplin Kuralları Yönetimi</span>
            </button>
            
            <button 
              @click="navigateTo('assign-jury')" 
              class="w-full flex items-center p-3 rounded-md bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
            >
              <UserIcon class="h-5 w-5 mr-3" />
              <span>Jüri Ataması</span>
            </button>
            
            <button 
              @click="navigateTo('export-data')" 
              class="w-full flex items-center p-3 rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100"
            >
              <ArrowDownTrayIcon class="h-5 w-5 mr-3" />
              <span>Veri Dışa Aktar</span>
            </button>
          </div>
        </div>
  
        <!-- Son İşlemler -->
        <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Son İşlemler</h2>
          
          <div class="overflow-hidden">
            <div class="space-y-4 max-h-72 overflow-y-auto pr-2">
              <div v-for="(action, index) in recentActions" :key="index" class="border-b border-gray-100 pb-3 last:border-0">
                <div class="flex">
                  <div class="flex-shrink-0 mr-3">
                    <div 
                      class="w-8 h-8 rounded-full flex items-center justify-center" 
                      :class="getActionIconClass(action.type)"
                    >
                      <component :is="getActionIcon(action.type)" class="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-800">{{ action.title }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ action.description }}</p>
                    <p class="text-xs text-gray-400 mt-1">{{ formatDate(action.date) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Bekleyen Değerlendirmeler -->
        <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-800">Bekleyen Değerlendirmeler</h2>
            <button 
              @click="navigateTo('all-evaluations')" 
              class="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              Tümünü Gör
            </button>
          </div>
          
          <div class="space-y-3 max-h-72 overflow-y-auto pr-2">
            <div 
              v-for="evaluation in pendingEvaluations" 
              :key="evaluation.id" 
              class="border rounded-md p-3 border-gray-200 hover:border-primary-200 hover:bg-primary-50"
            >
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm font-medium text-gray-800">{{ evaluation.title }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ evaluation.applicant }}</p>
                  <div class="flex items-center mt-2">
                    <CalendarIcon class="h-3.5 w-3.5 text-gray-400 mr-1" />
                    <span class="text-xs text-gray-500">Son: {{ formatDate(evaluation.dueDate) }}</span>
                  </div>
                </div>
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                  {{ getDaysLeft(evaluation.dueDate) }} gün kaldı
                </span>
              </div>
              <div class="mt-2 pt-2 border-t border-gray-100 flex justify-end">
                <button 
                  @click="navigateTo(`evaluation/${evaluation.id}`)" 
                  class="text-xs font-medium text-primary-600 hover:text-primary-800"
                >
                  Değerlendir
                </button>
              </div>
            </div>
            
            <div v-if="pendingEvaluations.length === 0" class="text-center text-gray-500 py-3">
              Bekleyen değerlendirme bulunmamaktadır.
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { 
    BellIcon, 
    DocumentTextIcon, 
    ClockIcon, 
    UserGroupIcon,
    PlusIcon,
    UserPlusIcon,
    AcademicCapIcon,
    UserIcon,
    ArrowDownTrayIcon,
    CheckCircleIcon,
    XCircleIcon,
    PencilIcon,
    CalendarIcon
  } from '@heroicons/vue/24/outline'
  
  const router = useRouter()
  
  // Örnek istatistik verileri
  const stats = ref({
    totalAnnouncements: 15,
    totalApplications: 48,
    pendingReviews: 7,
    totalUsers: 120
  })
  
  // Son işlemler
  const recentActions = ref([
    {
      type: 'create',
      title: 'Yeni Duyuru Eklendi',
      description: 'Doçent kadrosu için yeni bir duyuru eklendi.',
      date: new Date(Date.now() - 1000 * 60 * 30) // 30 dakika önce
    },
    {
      type: 'approve',
      title: 'Başvuru Onaylandı',
      description: 'Dr. Öğr. Üyesi başvurusu onaylandı.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 saat önce
    },
    {
      type: 'reject',
      title: 'Başvuru Reddedildi',
      description: 'Doçent başvurusu reddedildi.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 saat önce
    },
    {
      type: 'update',
      title: 'Disiplin Kuralı Güncellendi',
      description: 'Mühendislik Fakültesi disiplin kuralları güncellendi.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 gün önce
    },
    {
      type: 'create',
      title: 'Yeni Kullanıcı Eklendi',
      description: 'Jüri üyesi olarak yeni bir kullanıcı eklendi.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 gün önce
    }
  ])
  
  // Bekleyen değerlendirmeler
  const pendingEvaluations = ref([
    {
      id: 1,
      title: 'Dr. Öğr. Üyesi Başvurusu',
      applicant: 'Ahmet Yılmaz',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2) // 2 gün sonra
    },
    {
      id: 2,
      title: 'Doçent Başvurusu',
      applicant: 'Ayşe Demir',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3) // 3 gün sonra
    },
    {
      id: 3,
      title: 'Profesör Başvurusu',
      applicant: 'Mehmet Kaya',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5) // 5 gün sonra
    }
  ])
  
  // Yardımcı fonksiyonlar
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const getDaysLeft = (dueDate: Date) => {
    const now = new Date()
    const diffTime = new Date(dueDate).getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }
  
  const getActionIcon = (type: string) => {
    const iconMap: Record<string, any> = {
      'create': PlusIcon,
      'approve': CheckCircleIcon,
      'reject': XCircleIcon,
      'update': PencilIcon
    }
    return iconMap[type] || PlusIcon
  }
  
  const getActionIconClass = (type: string) => {
    const classMap: Record<string, string> = {
      'create': 'bg-primary-100 text-primary-700',
      'approve': 'bg-green-100 text-green-700',
      'reject': 'bg-red-100 text-red-700',
      'update': 'bg-blue-100 text-blue-700'
    }
    return classMap[type] || 'bg-gray-100 text-gray-700'
  }
  
  const navigateTo = (path: string) => {
    if (path === 'new-announcement') {
      router.push('/dashboard/admin/announcements/new')
    } else if (path === 'manage-users') {
      router.push('/dashboard/admin/users')
    } else if (path === 'manage-disciplines') {
      router.push('/dashboard/admin/disciplines')
    } else if (path === 'assign-jury') {
      router.push('/dashboard/admin/jury-assignments')
    } else if (path === 'export-data') {
      alert('Veri dışa aktarma özelliği henüz uygulanmadı.')
    } else if (path === 'all-evaluations') {
      router.push('/dashboard/admin/evaluations')
    } else if (path.startsWith('evaluation/')) {
      const id = path.split('/')[1]
      router.push(`/dashboard/admin/evaluations/${id}`)
    }
  }
  
  onMounted(() => {
    // API'den verileri çekme işlemleri burada yapılacak
  });