import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useDashboardStore = defineStore('dashboard', () => {
  const userProfile = ref(null)
  const announcements = ref([])
  const applications = ref([])
  const activities = ref([])
  const loading = ref(false)
  const error = ref('')

  // Profil verilerini getir
  async function fetchProfile() {
    try {
      loading.value = true
      const response = await axios.get('/api/v1/user/info', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      userProfile.value = response.data
    } catch (err) {
      error.value = 'Profil bilgileri alınamadı'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Duyuruları getir
  async function fetchAnnouncements() {
    try {
      loading.value = true
      const response = await axios.get('/api/v1/staff-announcement/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      announcements.value = response.data
    } catch (err) {
      error.value = 'Duyurular alınamadı'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Başvuruları getir
  async function fetchApplications() {
    try {
      loading.value = true
      // API henüz hazır olmadığı için örnek veri
      applications.value = [
        {
          _id: '1',
          title: 'Dr. Öğr. Üyesi Başvurusu',
          status: 'pending',
          date: new Date(),
          department: 'Bilgisayar Mühendisliği'
        },
        {
          _id: '2',
          title: 'Doçent Başvurusu',
          status: 'approved',
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 gün önce
          department: 'Elektrik Mühendisliği'
        }
      ]
    } catch (err) {
      error.value = 'Başvurular alınamadı'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Aktivite verileri
  async function fetchActivities() {
    try {
      loading.value = true
      // API henüz hazır olmadığı için örnek veri
      activities.value = [
        { month: 'Ocak', count: 4 },
        { month: 'Şubat', count: 6 },
        { month: 'Mart', count: 8 },
        { month: 'Nisan', count: 10 },
        { month: 'Mayıs', count: 7 },
        { month: 'Haziran', count: 5 }
      ]
    } catch (err) {
      error.value = 'Aktivite verileri alınamadı'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    userProfile,
    announcements,
    applications,
    activities,
    loading,
    error,
    fetchProfile,
    fetchAnnouncements,
    fetchApplications,
    fetchActivities
  }
})