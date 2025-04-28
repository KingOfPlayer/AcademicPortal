<template>
    <div class="min-h-screen bg-gray-100">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div class="flex items-center">
            <img src="../assets/university-logo.png" alt="University Logo" class="h-10 w-auto mr-3" />
            <h1 class="text-xl font-bold text-gray-800">Akademik Personel Değerlendirme Sistemi</h1>
          </div>
          <div class="flex items-center gap-4">
            <span v-if="user" class="text-gray-600">{{ user.name }} {{ user.surname }}</span>
            <button 
              @click="logout" 
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>
  
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Sidebar -->
          <aside class="w-full md:w-64 bg-white p-4 rounded-lg shadow">
            <nav class="space-y-1">
              <a 
                href="#" 
                @click.prevent="setActiveSection('announcements')" 
                :class="[
                  activeSection === 'announcements' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100',
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
                ]"
              >
                <span class="truncate">📢 İlanlar</span>
              </a>
              <a 
                v-if="isAdmin" 
                href="#" 
                @click.prevent="setActiveSection('create-announcement')" 
                :class="[
                  activeSection === 'create-announcement' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100',
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
                ]"
              >
                <span class="truncate">✏️ İlan Oluştur</span>
              </a>
              <a 
                v-if="isJury" 
                href="#" 
                @click.prevent="setActiveSection('jury-announcements')" 
                :class="[
                  activeSection === 'jury-announcements' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100',
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
                ]"
              >
                <span class="truncate">⚖️ Jüri İlanlarım</span>
              </a>
              <a 
                v-if="isApplicant" 
                href="#" 
                @click.prevent="setActiveSection('my-applications')" 
                :class="[
                  activeSection === 'my-applications' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100',
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
                ]"
              >
                <span class="truncate">📝 Başvurularım</span>
              </a>
              <a 
                href="#" 
                @click.prevent="setActiveSection('profile')" 
                :class="[
                  activeSection === 'profile' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100',
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
                ]"
              >
                <span class="truncate">👤 Profil</span>
              </a>
            </nav>
          </aside>
  
          <!-- Main Content -->
          <main class="flex-1 bg-white p-6 rounded-lg shadow">
            <!-- İlan Listesi -->
            <section v-if="activeSection === 'announcements'">
              <h2 class="text-lg font-medium text-gray-900 mb-4">İlanlar</h2>
              
              <div v-if="loading" class="text-center py-6">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p class="mt-2 text-gray-600">Yükleniyor...</p>
              </div>
              
              <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p class="text-red-700">{{ error }}</p>
              </div>
              
              <div v-else-if="announcements.length === 0" class="text-center py-6 text-gray-500">
                Henüz ilan bulunmamaktadır.
              </div>
              
              <div v-else class="space-y-4">
                <div 
                  v-for="announcement in announcements" 
                  :key="announcement._id" 
                  class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 class="text-lg font-medium text-gray-900">{{ announcement.title }}</h3>
                  
                  <div class="mt-2 text-sm text-gray-600 flex gap-4">
                    <span>Başlangıç: {{ formatDate(announcement.startDate) }}</span>
                    <span>Bitiş: {{ formatDate(announcement.endDate) }}</span>
                  </div>
                  
                  <p class="mt-2 text-gray-700">{{ announcement.content }}</p>
                  
                  <div class="mt-4 flex flex-wrap gap-2">
                    <button 
                      @click="viewAnnouncementDetails(announcement._id)" 
                      class="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
                    >
                      Detayları Görüntüle
                    </button>
                    
                    <button 
                      v-if="isApplicant" 
                      @click="applyToAnnouncement(announcement._id)" 
                      class="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      Başvur
                    </button>
                    
                    <template v-if="isAdmin">
                      <button 
                        @click="editAnnouncement(announcement._id)" 
                        class="px-3 py-1.5 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
                      >
                        Düzenle
                      </button>
                      
                      <button 
                        @click="deleteAnnouncement(announcement._id)" 
                        class="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Sil
                      </button>
                    </template>
                  </div>
                </div>
              </div>
            </section>
  
            <!-- İlan Oluşturma Formu -->
            <section v-if="activeSection === 'create-announcement' && isAdmin">
              <h2 class="text-lg font-medium text-gray-900 mb-4">Yeni İlan Oluştur</h2>
              
              <form @submit.prevent="submitAnnouncementForm" class="space-y-6">
                <div>
                  <label for="title" class="block text-sm font-medium text-gray-700">İlan Başlığı</label>
                  <input 
                    type="text" 
                    id="title" 
                    v-model="newAnnouncement.title" 
                    required 
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="İlan başlığını girin"
                  />
                </div>
                
                <div>
                  <label for="content" class="block text-sm font-medium text-gray-700">İlan İçeriği</label>
                  <textarea 
                    id="content" 
                    v-model="newAnnouncement.content" 
                    required 
                    rows="5" 
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="İlan içeriğini girin"
                  ></textarea>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="startDate" class="block text-sm font-medium text-gray-700">Başlangıç Tarihi</label>
                    <input 
                      type="date" 
                      id="startDate" 
                      v-model="newAnnouncement.startDate" 
                      required 
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label for="endDate" class="block text-sm font-medium text-gray-700">Bitiş Tarihi</label>
                    <input 
                      type="date" 
                      id="endDate" 
                      v-model="newAnnouncement.endDate" 
                      required 
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
  
                <div>
                  <label for="juries" class="block text-sm font-medium text-gray-700">Jüriler</label>
                  <select 
                    id="juries" 
                    v-model="newAnnouncement.juries" 
                    multiple
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option v-for="jury in juries" :key="jury._id" :value="jury._id">
                      {{ jury.name }} {{ jury.surname }}
                    </option>
                  </select>
                  <p class="mt-1 text-xs text-gray-500">Birden fazla jüri seçmek için CTRL/CMD tuşuna basılı tutarak seçim yapın.</p>
                </div>
  
                <div>
                  <label for="disciplineRules" class="block text-sm font-medium text-gray-700">Disiplin Kuralları</label>
                  <select 
                    id="disciplineRules" 
                    v-model="newAnnouncement.disciplineRules" 
                    multiple
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option v-for="rule in disciplineRules" :key="rule._id" :value="rule._id">
                      {{ rule.disiciplineName }}
                    </option>
                  </select>
                  <p class="mt-1 text-xs text-gray-500">Birden fazla kural seçmek için CTRL/CMD tuşuna basılı tutarak seçim yapın.</p>
                </div>
                
                <div class="flex justify-end space-x-3">
                  <button 
                    type="button" 
                    @click="resetForm"
                    class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    İptal
                  </button>
                  <button 
                    type="submit" 
                    class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    İlanı Oluştur
                  </button>
                </div>
              </form>
            </section>
  
            <!-- Jüri İlanları -->
            <section v-if="activeSection === 'jury-announcements' && isJury">
              <h2 class="text-lg font-medium text-gray-900 mb-4">Jüri Olduğum İlanlar</h2>
              
              <div v-if="loading" class="text-center py-6">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p class="mt-2 text-gray-600">Yükleniyor...</p>
              </div>
              
              <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p class="text-red-700">{{ error }}</p>
              </div>
              
              <div v-else-if="juryAnnouncements.length === 0" class="text-center py-6 text-gray-500">
                Jüri olduğunuz ilan bulunmamaktadır.
              </div>
              
              <div v-else class="space-y-4">
                <div 
                  v-for="announcement in juryAnnouncements" 
                  :key="announcement._id" 
                  class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 class="text-lg font-medium text-gray-900">{{ announcement.title }}</h3>
                  
                  <div class="mt-2 text-sm text-gray-600 flex gap-4">
                    <span>Başlangıç: {{ formatDate(announcement.startDate) }}</span>
                    <span>Bitiş: {{ formatDate(announcement.endDate) }}</span>
                  </div>
                  
                  <p class="mt-2 text-gray-700">{{ announcement.content }}</p>
                  
                  <div class="mt-4">
                    <button 
                      @click="viewJuryApplications(announcement._id)" 
                      class="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
                    >
                      Başvuruları Görüntüle
                    </button>
                  </div>
                </div>
              </div>
            </section>
  
            <!-- Başvurularım -->
            <section v-if="activeSection === 'my-applications' && isApplicant">
              <h2 class="text-lg font-medium text-gray-900 mb-4">Başvurularım</h2>
              
              <div v-if="loading" class="text-center py-6">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p class="mt-2 text-gray-600">Yükleniyor...</p>
              </div>
              
              <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p class="text-red-700">{{ error }}</p>
              </div>
              
              <div v-else-if="myApplications.length === 0" class="text-center py-6 text-gray-500">
                Henüz bir başvurunuz bulunmamaktadır.
              </div>
              
              <div v-else class="space-y-4">
                <div 
                  v-for="application in myApplications" 
                  :key="application._id" 
                  class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 class="text-lg font-medium text-gray-900">{{ application.announcement.title }}</h3>
                  
                  <div class="mt-2 flex items-center">
                    <span class="text-sm mr-2">Durum:</span>
                    <span 
                      :class="{
                        'bg-yellow-100 text-yellow-800': application.status === 'pending',
                        'bg-green-100 text-green-800': application.status === 'approved',
                        'bg-red-100 text-red-800': application.status === 'rejected'
                      }"
                      class="px-2 py-1 text-xs rounded-full"
                    >
                      {{ getStatusText(application.status) }}
                    </span>
                  </div>
                  
                  <div class="mt-2 text-sm text-gray-600">
                    <span>Başvuru Tarihi: {{ formatDate(application.createdAt) }}</span>
                  </div>
                  
                  <div class="mt-4">
                    <button 
                      @click="viewApplicationDetails(application._id)" 
                      class="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
                    >
                      Detayları Görüntüle
                    </button>
                  </div>
                </div>
              </div>
            </section>
  
            <!-- Profil -->
            <section v-if="activeSection === 'profile'">
              <h2 class="text-lg font-medium text-gray-900 mb-4">Profil Bilgilerim</h2>
              
              <div v-if="!user" class="text-center py-6 text-gray-500">
                Kullanıcı bilgileri yüklenemedi.
              </div>
              
              <div v-else class="bg-white overflow-hidden">
                <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl class="sm:divide-y sm:divide-gray-200">
                    <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">Ad Soyad</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ user.name }} {{ user.surname }}</dd>
                    </div>
                    
                    <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">T.C. Kimlik No</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ user.id_number }}</dd>
                    </div>
                    
                    <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">E-posta</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ user.email }}</dd>
                    </div>
                    
                    <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">Roller</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <span 
                          v-for="role in user.roles" 
                          :key="role" 
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2"
                        >
                          {{ getRoleName(role) }}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
                
                <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button 
                    @click="openChangePasswordModal" 
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Şifremi Değiştir
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, reactive, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import authService, { User } from '../services/auth.service';
  import announcementService, { 
    Announcement, 
    DisciplineRule 
  } from '../services/announcement.service';
  
  interface Application {
    _id: string;
    announcement: Announcement;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
  }
  
  export default defineComponent({
    name: 'DashboardView',
    
    setup() {
      const router = useRouter();
      const user = ref<User | null>(null);
      const activeSection = ref<string>('announcements');
      const loading = ref<boolean>(false);
      const error = ref<string>('');
      
      // İlanlar
      const announcements = ref<Announcement[]>([]);
      const juryAnnouncements = ref<Announcement[]>([]);
      
      // Başvurular
      const myApplications = ref<Application[]>([]);
      
      // Jüriler ve Disiplin Kuralları
      const juries = ref<User[]>([]);
      const disciplineRules = ref<DisciplineRule[]>([]);
      
      // Yeni İlan Formu
      const newAnnouncement = reactive<Announcement>({
        title: '',
        content: '',
        startDate: new Date(),
        endDate: new Date(),
        juries: [],
        disciplineRules: []
      });
      
      // Hesaplanan değerler
      const isAdmin = computed(() => {
        return authService.hasRole('admin') || authService.hasRole('administrator');
      });
      
      const isJury = computed(() => {
        return authService.hasRole('jury');
      });
      
      const isApplicant = computed(() => {
        return authService.hasRole('applicant');
      });
      
      // Metodlar
      const setActiveSection = (section: string) => {
        activeSection.value = section;
        
        // İlgili verileri yükle
        if (section === 'announcements') {
          loadAnnouncements();
        } else if (section === 'jury-announcements' && isJury.value) {
          loadJuryAnnouncements();
        } else if (section === 'my-applications' && isApplicant.value) {
          loadMyApplications();
        } else if (section === 'create-announcement' && isAdmin.value) {
          loadJuriesAndDisciplineRules();
        }
      };
      
      const logout = () => {
        authService.logout();
        router.push('/loginpage');
      };
      
      const loadAnnouncements = async () => {
        try {
          loading.value = true;
          error.value = '';
          announcements.value = await announcementService.getAnnouncements();
        } catch (err: any) {
          error.value = err.response?.data?.message || 'İlanlar yüklenirken bir hata oluştu';
          console.error('Error loading announcements:', err);
        } finally {
          loading.value = false;
        }
      };
      
      const loadJuryAnnouncements = async () => {
        try {
          loading.value = true;
          error.value = '';
          const currentUser = authService.getCurrentUser();
          if (currentUser?.id_number) {
            juryAnnouncements.value = await announcementService.getAnnouncementsByJuryId(currentUser.id_number);
          }
        } catch (err: any) {
          error.value = err.response?.data?.message || 'Jüri ilanları yüklenirken bir hata oluştu';
          console.error('Error loading jury announcements:', err);
        } finally {
          loading.value = false;
        }
      };
      
      const loadMyApplications = async () => {
        try {
          loading.value = true;
          error.value = '';
          // Backend'de uygun API yok henüz, bu kısım daha sonra eklenecek
          myApplications.value = [];
        } catch (err: any) {
          error.value = err.response?.data?.message || 'Başvurularınız yüklenirken bir hata oluştu';
          console.error('Error loading applications:', err);
        } finally {
          loading.value = false;
        }
      };
      
      const loadJuriesAndDisciplineRules = async () => {
        try {
          loading.value = true;
          error.value = '';
          // Bu API'ler henüz yok, daha sonra eklenecek
          juries.value = [];
          disciplineRules.value = [];
        } catch (err: any) {
          error.value = err.response?.data?.message || 'Veriler yüklenirken bir hata oluştu';
          console.error('Error loading form data:', err);
        } finally {
          loading.value = false;
        }
      };
      
      const viewAnnouncementDetails = (id?: string) => {
        if (id) {
          router.push(`/announcements/${id}`);
        }
      };
      
      const editAnnouncement = (id?: string) => {
        if (id) {
          router.push(`/announcements/edit/${id}`);
        }
      };
      
      const deleteAnnouncement = async (id?: string) => {
        if (!id) return;
        
        if (!confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;
        
        try {
          loading.value = true;
          await announcementService.deleteAnnouncement(id);
          loadAnnouncements();
        } catch (err: any) {
          error.value = err.response?.data?.message || 'İlan silinirken bir hata oluştu';
          console.error('Error deleting announcement:', err);
        } finally {
          loading.value = false;
        }
      };
      
      const applyToAnnouncement = (id?: string) => {
        if (id) {
          router.push(`/apply/${id}`);
        }
      };
      
      const viewJuryApplications = (id?: string) => {
        if (id) {
          router.push(`/jury/applications/${id}`);
        }
      };
      
      const viewApplicationDetails = (id?: string) => {
        if (id) {
          router.push(`/applications/${id}`);
        }
      };
      
      const resetForm = () => {
        Object.assign(newAnnouncement, {
          title: '',
          content: '',
          startDate: new Date(),
          endDate: new Date(),
          juries: [],
          disciplineRules: []
        });
      };
      
      const submitAnnouncementForm = async () => {
        try {
          loading.value = true;
          error.value = '';
          
          await announcementService.createAnnouncement(newAnnouncement);
          alert('İlan başarıyla oluşturuldu');
          resetForm();
          setActiveSection('announcements');
        } catch (err: any) {
          error.value = err.response?.data?.message || 'İlan oluşturulurken bir hata oluştu';
          console.error('Error creating announcement:', err);
        } finally {
          loading.value = false;
        }
      };
      
      const openChangePasswordModal = () => {
        // Bu kısım daha sonra eklenecek
        alert('Şifre değiştirme fonksiyonu henüz eklenmedi');
      };
      
      const formatDate = (date: Date | string | undefined): string => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('tr-TR');
      };
      
      const getStatusText = (status: string): string => {
        switch (status) {
          case 'pending': return 'Değerlendiriliyor';
          case 'approved': return 'Onaylandı';
          case 'rejected': return 'Reddedildi';
          default: return status;
        }
      };
      
      const getRoleName = (role: string): string => {
        switch (role) {
          case 'admin': return 'Yönetici';
          case 'administrator': return 'Yönetici';
          case 'jury': return 'Jüri';
          case 'applicant': return 'Başvuran';
          default: return role;
        }
      };
      
      // Sayfa yüklendiğinde
      onMounted(() => {
        // Kullanıcı bilgilerini al
        user.value = authService.getCurrentUser();
        
        // Oturum açık değilse giriş sayfasına yönlendir
        if (!authService.isAuthenticated()) {
          router.push('/loginpage');
          return;
        }
        
        // İlanları yükle
        loadAnnouncements();
      });
      
      return {
        user,
        activeSection,
        loading,
        error,
        announcements,
        juryAnnouncements,
        myApplications,
        juries,
        disciplineRules,
        newAnnouncement,
        isAdmin,
        isJury,
        isApplicant,
        setActiveSection,
        logout,
        viewAnnouncementDetails,
        editAnnouncement,
        deleteAnnouncement,
        applyToAnnouncement,
        viewJuryApplications,
        viewApplicationDetails,
        resetForm,
        submitAnnouncementForm,
        openChangePasswordModal,
        formatDate,
        getStatusText,
        getRoleName
      };
    }
  });
  </script>