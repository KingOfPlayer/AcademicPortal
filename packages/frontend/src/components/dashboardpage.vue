<script>
import { defineComponent, ref, reactive, computed, onMounted, watch } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'DashboardPage',
  
  setup() {
    // Kullanıcı Verisi ve Kimlik Bilgileri
    const user = reactive({
      id_number: undefined,
      name: '',
      surname: '',
      bornYear: undefined,
      email: '',
      roles: []
    });
    
    // Menü Yönetimi
    const activeMenuItem = ref('dashboard');
    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-line', roles: ['admin', 'administrator', 'jury', 'applicant'] },
      { id: 'activities', label: 'Aktiviteler', icon: 'fas fa-tasks', roles: ['admin', 'administrator', 'jury', 'applicant'] },
      { id: 'discipline-rules', label: 'Disiplin Kuralları', icon: 'fas fa-book', roles: ['admin'] },
      { id: 'user-management', label: 'Kullanıcı Yönetimi', icon: 'fas fa-users', roles: ['admin'] },
      { id: 'multipliers', label: 'Puan Çarpanları', icon: 'fas fa-calculator', roles: ['admin'] },
      { id: 'profile', label: 'Profil', icon: 'fas fa-user', roles: ['admin', 'administrator', 'jury', 'applicant'] }
    ];
    
    // İstatistikler
    const totalPoints = ref(0);
    const completedActivities = ref(0);
    const pendingReviews = ref(0);
    const disciplineStatus = ref('Değerlendiriliyor');
    
    // Veri Koleksiyonları
    const categories = ref([]);
    const userActivities = ref([]);
    const disciplineRules = ref([]);
    const pointTable = ref({ pointMultipliers: [] });
    const users = ref([]); 
    
    // Filtreler
    const activityFilters = reactive({
      category: '',
      status: '',
      dateRange: '',
      search: ''
    });
    const userSearchQuery = ref('');
    
    // Form Verisi
    const passwordForm = reactive({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    const passwordError = ref('');
    
    // Modal Yönetimi
    const showActivityModal = ref(false);
    const showRoleModal = ref(false);
    const editingActivity = ref(false);
    const activityForm = reactive({
      category: '',
      activityId: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
      authorCount: 1,
      file: null
    });
    const selectedUser = ref(null);
    const selectedRoles = ref([]);
    
    // Disiplin Kuralları
    const activeDisciplineRule = ref('');
    
    // Yardımcı Değişkenler
    const availableRoles = Object.values(ref(['admin', 'administrator', 'jury', 'applicant']).value);
    
    // Hesaplanmış Değerler
    const userFullName = computed(() => {
      return `${user.name} ${user.surname}`;
    });
    
    const isAdmin = computed(() => {
      return user.roles?.includes('admin') || false;
    });
    
    const filteredMenuItems = computed(() => {
      return menuItems.filter(item => {
        return item.roles.some(role => user.roles?.includes(role));
      });
    });
    
    const filteredActivities = computed(() => {
      return userActivities.value.filter(activity => {
        // Kategori filtresi
        if (activityFilters.category && activity.category !== activityFilters.category) {
          return false;
        }
        
        // Durum filtresi
        if (activityFilters.status && activity.status !== activityFilters.status) {
          return false;
        }
        
        // Tarih filtresi
        if (activityFilters.dateRange) {
          const activityDate = new Date(activity.date);
          const today = new Date();
          
          if (activityFilters.dateRange === 'last-week') {
            const lastWeek = new Date();
            lastWeek.setDate(today.getDate() - 7);
            if (activityDate < lastWeek) return false;
          } else if (activityFilters.dateRange === 'last-month') {
            const lastMonth = new Date();
            lastMonth.setMonth(today.getMonth() - 1);
            if (activityDate < lastMonth) return false;
          } else if (activityFilters.dateRange === 'last-year') {
            const lastYear = new Date();
            lastYear.setFullYear(today.getFullYear() - 1);
            if (activityDate < lastYear) return false;
          }
        }
        
        // Arama filtresi
        if (activityFilters.search) {
          const searchLower = activityFilters.search.toLowerCase();
          return (
            activity.description.toLowerCase().includes(searchLower) ||
            activity.categoryName.toLowerCase().includes(searchLower)
          );
        }
        
        return true;
      });
    });
    
    const recentActivities = computed(() => {
      return [...userActivities.value]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
    });
    
    const currentDisciplineRule = computed(() => {
      return disciplineRules.value.find(rule => rule.disiciplineName === activeDisciplineRule.value);
    });
    
    const filteredUsers = computed(() => {
      if (!userSearchQuery.value) return users.value;
      
      const searchQuery = userSearchQuery.value.toLowerCase();
      return users.value.filter(user => {
        return (
          (user.id_number?.toString() || '').includes(searchQuery) ||
          (user.name?.toLowerCase() || '').includes(searchQuery) ||
          (user.surname?.toLowerCase() || '').includes(searchQuery) ||
          (user.email?.toLowerCase() || '').includes(searchQuery)
        );
      });
    });
    
    // Veri Yükleme Fonksiyonları
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // Token yoksa login sayfasına yönlendir
          window.location.href = '/';
          return;
        }
        
        const response = await axios.get('/api/user/info', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data) {
          const userData = response.data;
          user.id_number = userData.id_number;
          user.name = userData.name;
          user.surname = userData.surname;
          user.bornYear = userData.bornYear;
          user.email = userData.email;
          user.roles = userData.roles;
        } else {
          // Kullanıcı verisi alınamazsa login sayfasına yönlendir
          window.location.href = '/';
        }
      } catch (error) {
        console.error('User data loading error:', error);
        window.location.href = '/';
      }
    };
    
    const loadCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/activity', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data) {
          categories.value = response.data;
        }
      } catch (error) {
        console.error('Categories loading error:', error);
      }
    };
    
    const loadUserActivities = async () => {
      try {
        // Bu fonksiyon backend yapınıza göre ayarlanmalıdır
        // Şu anda örnek verilerle doldurulmuştur
        
        // Örnek aktivite verileri
        userActivities.value = [
          {
            id: 1,
            category: 'A',
            categoryName: 'Makaleler',
            activityId: 1,
            description: 'SCI-E kapsamında makale (Q1)',
            point: 60,
            status: 'completed',
            date: '2023-06-15',
            authorCount: 2
          },
          {
            id: 2,
            category: 'A',
            categoryName: 'Makaleler',
            activityId: 2,
            description: 'SCI-E kapsamında makale (Q2)',
            point: 50,
            status: 'pending',
            date: '2023-08-22',
            authorCount: 3
          },
          {
            id: 3,
            category: 'B',
            categoryName: 'Bildiriler',
            activityId: 5,
            description: 'Uluslararası kongrede sunulan bildiri',
            point: 25,
            status: 'completed',
            date: '2023-05-10',
            authorCount: 1
          }
        ];
        
        // İstatistikleri güncelle
        totalPoints.value = userActivities.value
          .filter(a => a.status === 'completed')
          .reduce((sum, a) => sum + a.point, 0);
        
        completedActivities.value = userActivities.value
          .filter(a => a.status === 'completed').length;
        
        pendingReviews.value = userActivities.value
          .filter(a => a.status === 'pending').length;
      } catch (error) {
        console.error('User activities loading error:', error);
      }
    };
    
    const loadDisciplineRules = async () => {
      if (!isAdmin.value) return;
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/discipline-rule', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data) {
          disciplineRules.value = response.data;
          
          if (disciplineRules.value.length > 0) {
            activeDisciplineRule.value = disciplineRules.value[0].disiciplineName;
          }
        }
      } catch (error) {
        console.error('Discipline rules loading error:', error);
      }
    };
    
    const loadPointTable = async () => {
      try {
        const response = await axios.get('/api/multipliers');
        
        if (response.data) {
          pointTable.value = { pointMultipliers: response.data };
        }
      } catch (error) {
        console.error('Point table loading error:', error);
      }
    };
    
    const loadUsers = async () => {
      if (!isAdmin.value) return;
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data) {
          users.value = response.data;
        }
      } catch (error) {
        console.error('Users loading error:', error);
      }
    };
    
    // Yardımcı Fonksiyonlar
    const getCategoryPoints = (categoryCode) => {
      return userActivities.value
        .filter(a => a.category === categoryCode && a.status === 'completed')
        .reduce((sum, a) => sum + a.point, 0);
    };
    
    const getCategoryPercentage = (categoryCode) => {
      const category = categories.value.find(c => c.Code === categoryCode);
      if (!category) return 0;
      
      const maxPoints = category.activities.reduce((sum, a) => sum + a.point, 0);
      const userPoints = getCategoryPoints(categoryCode);
      
      if (maxPoints === 0) return 0;
      return Math.min(100, Math.round((userPoints / maxPoints) * 100));
    };
    
    const getCategoryColor = (categoryCode) => {
      const percentage = getCategoryPercentage(categoryCode);
      if (percentage >= 80) return '#2e7d32'; // Yeşil
      if (percentage >= 50) return '#ff9800'; // Turuncu
      return '#f44336'; // Kırmızı
    };
    
    const getStatusText = (status) => {
      switch (status) {
        case 'completed': return 'Tamamlandı';
        case 'pending': return 'Değerlendirme Bekliyor';
        case 'rejected': return 'Reddedildi';
        default: return status;
      }
    };
    
    const getStatusIcon = (status) => {
      switch (status) {
        case 'completed': return 'fas fa-check-circle';
        case 'pending': return 'fas fa-clock';
        case 'rejected': return 'fas fa-times-circle';
        default: return 'fas fa-question-circle';
      }
    };
    
    const getRoleName = (role) => {
      switch (role) {
        case 'admin': return 'Sistem Yöneticisi';
        case 'administrator': return 'Yönetici';
        case 'jury': return 'Jüri Üyesi';
        case 'applicant': return 'Başvuru Sahibi';
        default: return role;
      }
    };
    
    const getPositionName = (position) => {
      switch (position) {
        case 'Lecturer': return 'Dr. Öğr. Üyesi';
        case 'AssociateProfessor': return 'Doçent';
        case 'Professor': return 'Profesör';
        default: return position;
      }
    };
    
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR');
    };
    
    const getActivitiesByCategory = (categoryCode) => {
      const category = categories.value.find(c => c.Code === categoryCode);
      return category ? category.activities : [];
    };
    
    const getMultiplierValue = (authorCount) => {
      for (const multiplier of pointTable.value.pointMultipliers) {
        if (multiplier.peopleCountCondition.includes('-')) {
          const [min, max] = multiplier.peopleCountCondition.split('-').map(Number);
          if (authorCount >= min && authorCount <= max) {
            if (multiplier.multiplier === '1/people') {
              return `1/${authorCount} (${(1/authorCount).toFixed(2)})`;
            }
            return multiplier.multiplier;
          }
        } else if (multiplier.peopleCountCondition.includes('+')) {
          const minCount = parseInt(multiplier.peopleCountCondition.replace('+', ''));
          if (authorCount >= minCount) {
            if (multiplier.multiplier === '1/people') {
              return `1/${authorCount} (${(1/authorCount).toFixed(2)})`;
            }
            return multiplier.multiplier;
          }
        } else {
          const count = parseInt(multiplier.peopleCountCondition);
          if (authorCount === count) {
            return multiplier.multiplier;
          }
        }
      }
      return '1.00';
    };
    
    // Eylem Fonksiyonları
    const navigateTo = (menuId) => {
      activeMenuItem.value = menuId;
    };
    
    const logout = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.post('/api/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    };
    
    // Aktivite İşlemleri
    const openAddActivityModal = () => {
      editingActivity.value = false;
      activityForm.category = '';
      activityForm.activityId = 0;
      activityForm.description = '';
      activityForm.date = new Date().toISOString().split('T')[0];
      activityForm.authorCount = 1;
      activityForm.file = null;
      showActivityModal.value = true;
    };
    
    const closeActivityModal = () => {
      showActivityModal.value = false;
    };
    
    const viewActivity = (activityId) => {
      const activity = userActivities.value.find(a => a.id === activityId);
      if (!activity) return;
      
      // Burada aktivite detayları gösterilebilir
      console.log(`View activity ${activityId}:`, activity);
    };
    
    const editActivity = (activityId) => {
      const activity = userActivities.value.find(a => a.id === activityId);
      if (!activity) return;
      
      editingActivity.value = true;
      activityForm.id = activity.id;
      activityForm.category = activity.category;
      activityForm.activityId = activity.activityId;
      activityForm.description = activity.description;
      activityForm.date = activity.date;
      activityForm.authorCount = activity.authorCount;
      activityForm.file = null;
      
      showActivityModal.value = true;
    };
    
    const deleteActivity = async (activityId) => {
      if (!confirm('Bu aktiviteyi silmek istediğinize emin misiniz?')) return;
      
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/user/activity/${activityId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Aktiviteyi listeden kaldır
        userActivities.value = userActivities.value.filter(a => a.id !== activityId);
        
        // İstatistikleri güncelle
        totalPoints.value = userActivities.value
          .filter(a => a.status === 'completed')
          .reduce((sum, a) => sum + a.point, 0);
        
        completedActivities.value = userActivities.value
          .filter(a => a.status === 'completed').length;
        
        pendingReviews.value = userActivities.value
          .filter(a => a.status === 'pending').length;
      } catch (error) {
        console.error('Activity delete error:', error);
        alert('Aktivite silinirken bir hata oluştu.');
      }
    };
    
    const handleFileUpload = (event) => {
      const input = event.target;
      if (input.files && input.files.length > 0) {
        activityForm.file = input.files[0];
      }
    };
    
    const saveActivity = async () => {
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        
        if (editingActivity.value && activityForm.id) {
          formData.append('id', activityForm.id.toString());
        }
        
        formData.append('category', activityForm.category);
        formData.append('activityId', activityForm.activityId.toString());
        formData.append('description', activityForm.description);
        formData.append('date', activityForm.date);
        formData.append('authorCount', activityForm.authorCount.toString());
        
        if (activityForm.file) {
          formData.append('file', activityForm.file);
        }
        
        let response;
        if (editingActivity.value && activityForm.id) {
          response = await axios.put('/api/user/activity', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        } else {
          response = await axios.post('/api/user/activity', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        }
        
        // Aktiviteleri yeniden yükle
        await loadUserActivities();
        
        closeActivityModal();
      } catch (error) {
        console.error('Activity save error:', error);
        alert('Aktivite kaydedilirken bir hata oluştu.');
      }
    };
    
    // Kullanıcı Rolleri İşlemleri
    const editUserRoles = (userToEdit) => {
      selectedUser.value = userToEdit;
      selectedRoles.value = [...(userToEdit.roles || [])];
      showRoleModal.value = true;
    };
    
    const closeRoleModal = () => {
      showRoleModal.value = false;
      selectedUser.value = null;
    };
    
    const saveUserRoles = async () => {
      if (!selectedUser.value) return;
      
      try {
        const token = localStorage.getItem('token');
        await axios.post('/api/user/update/role', {
          id_number: selectedUser.value.id_number,
          roles: selectedRoles.value
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Kullanıcı listesini güncelle
        const userIndex = users.value.findIndex(u => u.id_number === selectedUser.value?.id_number);
        if (userIndex !== -1) {
          users.value[userIndex].roles = [...selectedRoles.value];
        }
        
        closeRoleModal();
      } catch (error) {
        console.error('User roles update error:', error);
        alert('Kullanıcı rolleri güncellenirken bir hata oluştu.');
      }
    };
    
    // Disiplin Kuralları İşlemleri
    const openAddDisciplineRuleModal = () => {
      // Burada yeni disiplin kuralı ekleme modalı açılabilir
    };
    
    const openAddActivityRuleModal = () => {
      // Burada yeni aktivite kuralı ekleme modalı açılabilir
    };
    
    const openAddPointRuleModal = () => {
      // Burada yeni puan kuralı ekleme modalı açılabilir
    };
    
    const editActivityRule = (index) => {
      // Burada aktivite kuralı düzenleme işlemi yapılabilir
    };
    
    const deleteActivityRule = (index) => {
      // Burada aktivite kuralı silme işlemi yapılabilir
    };
    
    const editPointRule = (index) => {
      // Burada puan kuralı düzenleme işlemi yapılabilir
    };
    
    const deletePointRule = (index) => {
      // Burada puan kuralı silme işlemi yapılabilir
    };
    
    const saveDisciplineRule = async () => {
      if (!currentDisciplineRule.value) return;
      
      try {
        const token = localStorage.getItem('token');
        await axios.put('/api/discipline-rule', currentDisciplineRule.value, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            DisciplineName: currentDisciplineRule.value.disiciplineName
          }
        });
        
        alert('Disiplin kuralı başarıyla güncellendi.');
      } catch (error) {
        console.error('Discipline rule update error:', error);
        alert('Disiplin kuralı güncellenirken bir hata oluştu.');
      }
    };
    
    // Çarpan Tablosu İşlemleri
    const editMultiplier = (index) => {
      // Burada çarpan düzenleme işlemi yapılabilir
    };
    
    const addMultiplier = () => {
      // Burada yeni çarpan ekleme işlemi yapılabilir
    };
    
    const saveMultipliers = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.put('/api/point-table', pointTable.value, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        alert('Puan çarpanları başarıyla güncellendi.');
      } catch (error) {
        console.error('Point multipliers update error:', error);
        alert('Puan çarpanları güncellenirken bir hata oluştu.');
      }
    };
    
    // Profil İşlemleri
    const changePassword = async () => {
      try {
        passwordError.value = '';
        
        // Şifre doğrulama kontrolü
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
          passwordError.value = 'Yeni şifre ve tekrarı eşleşmiyor';
          return;
        }
        
        // Şifre değiştirme isteği
        const token = localStorage.getItem('token');
        const response = await axios.post('/api/user/change-password', {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          // Şifre başarıyla değiştirildi
          passwordForm.currentPassword = '';
          passwordForm.newPassword = '';
          passwordForm.confirmPassword = '';
          alert('Şifreniz başarıyla değiştirildi');
        } else {
          passwordError.value = response.data.message || 'Şifre değiştirme işlemi başarısız';
        }
      } catch (error) {
        console.error('Password change error:', error);
        passwordError.value = error.response?.data?.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.';
      }
    };
    
    // Kullanıcı Görüntüleme 
    const viewUser = (userId) => {
      // Burada kullanıcı detayları görüntülenebilir
      console.log(`View user ${userId}`);
    };
    
    // Sayfa Yükleme
    onMounted(() => {
      loadUserData();
      loadCategories();
      loadUserActivities();
      loadPointTable();
      
      // Kullanıcı admin ise ek verileri yükle
      watch(() => user.roles, (newRoles) => {
        if (newRoles?.includes('admin')) {
          loadDisciplineRules();
          loadUsers();
        }
      }, { immediate: true });
    });
    
    return {
      // Durum değişkenleri
      user,
      userFullName,
      isAdmin,
      activeMenuItem,
      filteredMenuItems,
      menuItems,
      totalPoints,
      completedActivities,
      pendingReviews,
      disciplineStatus,
      categories,
      userActivities,
      filteredActivities,
      recentActivities,
      activityFilters,
      passwordForm,
      passwordError,
      showActivityModal,
      editingActivity,
      activityForm,
      disciplineRules,
      activeDisciplineRule,
      currentDisciplineRule,
      pointTable,
      users,
      filteredUsers,
      userSearchQuery,
      showRoleModal,
      selectedUser,
      selectedRoles,
      availableRoles,
      
      // Fonksiyonlar
      navigateTo,
      logout,
      getCategoryPoints,
      getCategoryPercentage,
      getCategoryColor,
      getStatusText,
      getStatusIcon,
      getRoleName,
      getPositionName,
      formatDate,
      getActivitiesByCategory,
      getMultiplierValue,
      
      // Aktivite işlemleri
      openAddActivityModal,
      closeActivityModal,
      viewActivity,
      editActivity,
      deleteActivity,
      handleFileUpload,
      saveActivity,
      
      // Kullanıcı rolleri işlemleri
      editUserRoles,
      closeRoleModal,
      saveUserRoles,
      
      // Disiplin kuralları işlemleri
      openAddDisciplineRuleModal,
      openAddActivityRuleModal,
      openAddPointRuleModal,
      editActivityRule,
      deleteActivityRule,
      editPointRule,
      deletePointRule,
      saveDisciplineRule,
      
      // Çarpan tablosu işlemleri
      editMultiplier,
      addMultiplier,
      saveMultipliers,
      
      // Profil işlemleri
      changePassword,
      
      // Diğer
      viewUser
    };
  }
});
</script>