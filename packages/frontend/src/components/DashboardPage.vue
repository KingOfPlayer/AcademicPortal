<template>
    <div class="dashboard-container">
        <header class="dashboard-header">
            <div class="logo-container">
                <img src="../assets/university-logo.png" alt="University Logo" class="university-logo" />
            </div>
            <h1 class="title">Akademik Değerlendirme Sistemi</h1>
            <div class="user-info">
                <span class="user-name">{{ userFullName }}</span>
                <button class="logout-button" @click="logout">
                    <i class="fas fa-sign-out-alt"></i> Çıkış Yap
                </button>
            </div>
        </header>

        <div class="dashboard-content">
            <aside class="sidebar">
                <nav class="nav-menu">
                    <div v-for="menuItem in filteredMenuItems" :key="menuItem.id"
                        :class="['menu-item', { active: activeMenuItem === menuItem.id }]"
                        @click="navigateTo(menuItem.id)">
                        <i :class="['menu-icon', menuItem.icon]"></i>
                        <span class="menu-label">{{ menuItem.label }}</span>
                    </div>
                </nav>
            </aside>

            <main class="main-content">
                <!-- Dashboard Ana İçerik -->
                <div v-if="activeMenuItem === 'dashboard'" class="dashboard-summary">
                    <div class="summary-cards">
                        <div class="summary-card">
                            <h3 class="card-title">Toplam Puan</h3>
                            <div class="card-value">{{ totalPoints }}</div>
                            <div class="card-icon"><i class="fas fa-star"></i></div>
                        </div>
                        <div class="summary-card">
                            <h3 class="card-title">Tamamlanan Aktiviteler</h3>
                            <div class="card-value">{{ completedActivities }}</div>
                            <div class="card-icon"><i class="fas fa-check-circle"></i></div>
                        </div>
                        <div class="summary-card">
                            <h3 class="card-title">Bekleyen Değerlendirmeler</h3>
                            <div class="card-value">{{ pendingReviews }}</div>
                            <div class="card-icon"><i class="fas fa-clock"></i></div>
                        </div>
                        <div class="summary-card">
                            <h3 class="card-title">Disiplin Durumu</h3>
                            <div class="card-value">{{ disciplineStatus }}</div>
                            <div class="card-icon"><i class="fas fa-graduation-cap"></i></div>
                        </div>
                    </div>

                    <div class="dashboard-grid">
                        <div class="activity-progress dashboard-panel">
                            <h2 class="panel-title">Kategori Bazında İlerleme</h2>
                            <div class="progress-container" v-for="category in categories" :key="category.Code">
                                <div class="progress-header">
                                    <span class="category-name">{{ category.sectionName }}</span>
                                    <span class="category-points">{{ getCategoryPoints(category.Code) }} Puan</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-value"
                                        :style="{ width: getCategoryPercentage(category.Code) + '%', backgroundColor: getCategoryColor(category.Code) }">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="recent-activities dashboard-panel">
                            <h2 class="panel-title">Son Aktiviteler</h2>
                            <div class="activity-list" v-if="recentActivities.length > 0">
                                <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                                    <div class="activity-icon" :class="activity.status">
                                        <i :class="getStatusIcon(activity.status)"></i>
                                    </div>
                                    <div class="activity-details">
                                        <div class="activity-title">{{ activity.description }}</div>
                                        <div class="activity-meta">
                                            <span class="activity-category">{{ activity.categoryName }}</span>
                                            <span class="activity-date">{{ formatDate(activity.date) }}</span>
                                        </div>
                                    </div>
                                    <div class="activity-points">{{ activity.point }} puan</div>
                                </div>
                            </div>
                            <div v-else class="empty-state">
                                Henüz hiç aktivite eklenmemiş.
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Aktiviteler İçeriği -->
                <div v-if="activeMenuItem === 'activities'" class="activities-content">
                    <div class="content-header">
                        <h2 class="section-title">Aktiviteler</h2>
                        <button class="action-button primary" @click="openAddActivityModal">
                            <i class="fas fa-plus"></i> Yeni Aktivite Ekle
                        </button>
                    </div>

                    <div class="activities-filter dashboard-panel">
                        <div class="filter-group">
                            <label for="categoryFilter">Kategori:</label>
                            <select id="categoryFilter" v-model="activityFilters.category">
                                <option value="">Tümü</option>
                                <option v-for="category in categories" :key="category.Code" :value="category.Code">
                                    {{ category.sectionName }}
                                </option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label for="statusFilter">Durum:</label>
                            <select id="statusFilter" v-model="activityFilters.status">
                                <option value="">Tümü</option>
                                <option value="completed">Tamamlanan</option>
                                <option value="pending">Değerlendirme Bekleyen</option>
                                <option value="rejected">Reddedilen</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label for="dateFilter">Tarih:</label>
                            <select id="dateFilter" v-model="activityFilters.dateRange">
                                <option value="">Tümü</option>
                                <option value="last-week">Son 1 Hafta</option>
                                <option value="last-month">Son 1 Ay</option>
                                <option value="last-year">Son 1 Yıl</option>
                            </select>
                        </div>
                        <div class="filter-group search-group">
                            <label for="searchFilter">Ara:</label>
                            <input type="text" id="searchFilter" placeholder="Aktivite adı, açıklama..."
                                v-model="activityFilters.search" class="search-input" />
                        </div>
                    </div>

                    <div class="activities-table dashboard-panel">
                        <table v-if="filteredActivities.length > 0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Kategori</th>
                                    <th>Aktivite</th>
                                    <th>Puan</th>
                                    <th>Tarih</th>
                                    <th>Durum</th>
                                    <th>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="activity in filteredActivities" :key="activity.id">
                                    <td>{{ activity.id }}</td>
                                    <td>{{ activity.categoryName }}</td>
                                    <td>{{ activity.description }}</td>
                                    <td>{{ activity.point }}</td>
                                    <td>{{ formatDate(activity.date) }}</td>
                                    <td>
                                        <span :class="['status-badge', activity.status]">
                                            {{ getStatusText(activity.status) }}
                                        </span>
                                    </td>
                                    <td class="actions">
                                        <button class="action-button view" @click="viewActivity(activity.id)">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button v-if="activity.status === 'pending'" class="action-button edit"
                                            @click="editActivity(activity.id)">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button v-if="activity.status === 'pending'" class="action-button delete"
                                            @click="deleteActivity(activity.id)">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-else class="empty-state">
                            <i class="fas fa-search"></i>
                            <p>Arama kriterlerinize uygun aktivite bulunamadı.</p>
                        </div>
                    </div>
                </div>

                <!-- Disiplin Kuralları İçeriği (Admin) -->
                <div v-if="activeMenuItem === 'discipline-rules' && isAdmin" class="discipline-rules-content">
                    <div class="content-header">
                        <h2 class="section-title">Disiplin Kuralları Yönetimi</h2>
                        <button class="action-button primary" @click="openAddDisciplineRuleModal">
                            <i class="fas fa-plus"></i> Yeni Disiplin Kuralı Ekle
                        </button>
                    </div>

                    <div class="dashboard-panel">
                        <div class="discipline-rule-tabs">
                            <div v-for="rule in disciplineRules" :key="rule.disiciplineName"
                                :class="['discipline-tab', { active: activeDisciplineRule === rule.disiciplineName }]"
                                @click="activeDisciplineRule = rule.disiciplineName">
                                {{ rule.disiciplineName }}
                            </div>
                        </div>

                        <div class="discipline-rule-content" v-if="currentDisciplineRule">
                            <div class="rule-section">
                                <h3 class="subsection-title">Aktivite Kuralları</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Pozisyon</th>
                                            <th>Kriter Aralığı</th>
                                            <th>Minimum Sayı</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(rule, index) in currentDisciplineRule.activityRules" :key="index">
                                            <td>{{ getPositionName(rule.positionType) }}</td>
                                            <td>{{ rule.expression }}</td>
                                            <td>{{ rule.minimumCount }}</td>
                                            <td class="actions">
                                                <button class="action-button edit" @click="editActivityRule(index)">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button class="action-button delete" @click="deleteActivityRule(index)">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button class="action-button secondary" @click="openAddActivityRuleModal">
                                    <i class="fas fa-plus"></i> Aktivite Kuralı Ekle
                                </button>
                            </div>

                            <div class="rule-section">
                                <h3 class="subsection-title">Puan Kuralları</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Pozisyon</th>
                                            <th>Kriter Aralığı</th>
                                            <th>Minimum Puan</th>
                                            <th>Maksimum Puan</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(rule, index) in currentDisciplineRule.pointRules" :key="index">
                                            <td>{{ getPositionName(rule.positionType) }}</td>
                                            <td>{{ rule.expression }}</td>
                                            <td>{{ rule.minPoint }}</td>
                                            <td>{{ rule.maxPoint }}</td>
                                            <td class="actions">
                                                <button class="action-button edit" @click="editPointRule(index)">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button class="action-button delete" @click="deletePointRule(index)">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button class="action-button secondary" @click="openAddPointRuleModal">
                                    <i class="fas fa-plus"></i> Puan Kuralı Ekle
                                </button>
                            </div>

                            <div class="discipline-rule-actions">
                                <button class="action-button primary" @click="saveDisciplineRule">
                                    <i class="fas fa-save"></i> Değişiklikleri Kaydet
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Kullanıcı Yönetimi İçeriği (Admin) -->
                <div v-if="activeMenuItem === 'user-management' && isAdmin" class="user-management-content">
                    <div class="content-header">
                        <h2 class="section-title">Kullanıcı Yönetimi</h2>
                        <div class="search-filter">
                            <input type="text" placeholder="Kullanıcı ara..." v-model="userSearchQuery"
                                class="search-input" />
                        </div>
                    </div>

                    <div class="users-table dashboard-panel">
                        <table v-if="filteredUsers.length > 0">
                            <thead>
                                <tr>
                                    <th>T.C. Kimlik No</th>
                                    <th>Ad</th>
                                    <th>Soyad</th>
                                    <th>E-posta</th>
                                    <th>Roller</th>
                                    <th>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in filteredUsers" :key="user.id_number">
                                    <td>{{ user.id_number }}</td>
                                    <td>{{ user.name }}</td>
                                    <td>{{ user.surname }}</td>
                                    <td>{{ user.email }}</td>
                                    <td>
                                        <span v-for="role in user.roles" :key="role" class="role-badge">
                                            {{ getRoleName(role) }}
                                        </span>
                                    </td>
                                    <td class="actions">
                                        <button class="action-button view" @click="">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="action-button edit" @click="editUserRoles(user)">
                                            <i class="fas fa-user-tag"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-else class="empty-state">
                            <i class="fas fa-users"></i>
                            <p>Arama kriterlerinize uygun kullanıcı bulunamadı.</p>
                        </div>
                    </div>
                </div>

                <!-- Çarpan Tablosu Yönetimi İçeriği (Admin) -->
                <div v-if="activeMenuItem === 'multipliers' && isAdmin" class="multipliers-content">
                    <div class="content-header">
                        <h2 class="section-title">Puan Çarpanları Yönetimi</h2>
                    </div>

                    <div class="dashboard-panel">
                        <div class="multipliers-description">
                            <p>Bu tablo, çok yazarlı çalışmalarda her bir yazarın alacağı puan oranını belirler.</p>
                        </div>

                        <div class="multipliers-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Yazar Sayısı</th>
                                        <th>Çarpan</th>
                                        <th>İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(multiplier, index) in pointTable.pointMultipliers" :key="index">
                                        <td>{{ multiplier.peopleCountCondition }}</td>
                                        <td>{{ multiplier.multiplier }}</td>
                                        <td class="actions">
                                            <button class="action-button edit" @click="editMultiplier(index)">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="multipliers-actions">
                            <button class="action-button secondary" @click="addMultiplier">
                                <i class="fas fa-plus"></i> Yeni Çarpan Ekle
                            </button>
                            <button class="action-button primary" @click="saveMultipliers">
                                <i class="fas fa-save"></i> Değişiklikleri Kaydet
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Profil İçeriği -->
                <div v-if="activeMenuItem === 'profile'" class="profile-content">
                    <h2 class="section-title">Profil Bilgileri</h2>

                    <div class="profile-info dashboard-panel">
                        <div class="profile-header">
                            <div class="profile-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="profile-name">
                                <h3>{{ userFullName }}</h3>
                                <div class="profile-roles">
                                    <span v-for="role in user.roles" :key="role" class="role-badge">
                                        {{ getRoleName(role) }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="profile-details">
                            <div class="info-group">
                                <label>T.C. Kimlik No:</label>
                                <div class="info-value">{{ user.id_number }}</div>
                            </div>
                            <div class="info-group">
                                <label>Doğum Yılı:</label>
                                <div class="info-value">{{ user.bornYear }}</div>
                            </div>
                            <div class="info-group">
                                <label>E-posta:</label>
                                <div class="info-value">{{ user.email }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="password-change dashboard-panel">
                        <h3 class="subsection-title">Şifre Değiştir</h3>

                        <form @submit.prevent="changePassword" class="password-form">
                            <div class="form-group">
                                <label for="currentPassword">Mevcut Şifre:</label>
                                <input type="password" id="currentPassword" v-model="passwordForm.currentPassword"
                                    required />
                            </div>

                            <div class="form-group">
                                <label for="newPassword">Yeni Şifre:</label>
                                <input type="password" id="newPassword" v-model="passwordForm.newPassword" required />
                            </div>

                            <div class="form-group">
                                <label for="confirmPassword">Yeni Şifre (Tekrar):</label>
                                <input type="password" id="confirmPassword" v-model="passwordForm.confirmPassword"
                                    required />
                            </div>

                            <div v-if="passwordError" class="error-message">
                                {{ passwordError }}
                            </div>

                            <button type="submit" class="submit-button">Şifreyi Değiştir</button>
                        </form>
                    </div>
                </div>
            </main>
        </div>

        <!-- Aktivite Ekleme/Düzenleme Modal Dialog -->
        <div v-if="showActivityModal" class="modal-overlay" @click="closeActivityModal">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>{{ editingActivity ? 'Aktivite Düzenle' : 'Yeni Aktivite Ekle' }}</h3>
                    <button class="modal-close" @click="closeActivityModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="saveActivity">
                        <div class="form-group">
                            <label for="activityCategory">Kategori:</label>
                            <select id="activityCategory" v-model="activityForm.category" required>
                                <option value="">Kategori Seçin</option>
                                <option v-for="category in categories" :key="category.Code" :value="category.Code">
                                    {{ category.sectionName }}
                                </option>
                            </select>
                        </div>

                        <div class="form-group" v-if="activityForm.category">
                            <label for="activityType">Aktivite Türü:</label>
                            <select id="activityType" v-model="activityForm.activityId" required>
                                <option value="">Aktivite Türü Seçin</option>
                                <option v-for="activity in getActivitiesByCategory(activityForm.category)"
                                    :key="activity.ID" :value="activity.ID">
                                    {{ activity.description }} ({{ activity.point }} puan)
                                </option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="activityDescription">Açıklama:</label>
                            <textarea id="activityDescription" v-model="activityForm.description"
                                placeholder="Aktiviteye ilişkin açıklama ekleyin" rows="4">
                </textarea>
                        </div>

                        <div class="form-group">
                            <label for="activityDate">Tarih:</label>
                            <input type="date" id="activityDate" v-model="activityForm.date" required />
                        </div>

                        <div class="form-group">
                            <label for="authorCount">Yazar Sayısı:</label>
                            <input type="number" id="authorCount" v-model="activityForm.authorCount" min="1" required />
                            <div class="help-text" v-if="activityForm.authorCount > 1">
                                {{ activityForm.authorCount }} yazarlı çalışma için çarpan: {{
                                    getMultiplierValue(activityForm.authorCount) }}
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="activityFile">Dosya:</label>
                            <input type="file" id="activityFile" @change="handleFileUpload"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                            <div class="help-text">
                                PDF, DOC, DOCX, JPG veya PNG formatında belgeler yükleyebilirsiniz.
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="button" class="action-button secondary" @click="closeActivityModal">
                                İptal
                            </button>
                            <button type="submit" class="action-button primary">
                                {{ editingActivity ? 'Güncelle' : 'Ekle' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Rol Düzenleme Modal Dialog -->
        <div v-if="showRoleModal" class="modal-overlay" @click="closeRoleModal">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>Kullanıcı Rollerini Düzenle</h3>
                    <button class="modal-close" @click="closeRoleModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="user-info-display">
                        <p><strong>Kullanıcı:</strong> {{ selectedUser?.name }} {{ selectedUser?.surname }}</p>
                        <p><strong>T.C. Kimlik No:</strong> {{ selectedUser?.id_number }}</p>
                    </div>

                    <div class="role-checkboxes">
                        <div v-for="role in availableRoles" :key="role" class="role-checkbox">
                            <input type="checkbox" :id="'role-' + role" :value="role" v-model="selectedRoles" />
                            <label :for="'role-' + role">{{ getRoleName(role) }}</label>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="action-button secondary" @click="closeRoleModal">
                            İptal
                        </button>
                        <button type="button" class="action-button primary" @click="saveUserRoles">
                            Kaydet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted, watch } from 'vue';
import axios from 'axios';

interface User {
    id_number?: number;
    name?: string;
    surname?: string;
    bornYear?: number;
    email?: string;
    roles?: string[];
    password?: string;
}

interface Activity {
    id: number;
    category: string;
    categoryName: string;
    activityId: number;
    description: string;
    point: number;
    status: 'completed' | 'pending' | 'rejected';
    date: string;
    authorCount: number;
    file?: string;
}

interface Category {
    Code: string;
    sectionName: string;
    isActive: boolean;
    activities: Array<{
        ID: number;
        description: string;
        point: number;
    }>;
}

interface ActivityFilters {
    category: string;
    status: string;
    dateRange: string;
    search: string;
}

interface PasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface ActivityForm {
    id?: number;
    category: string;
    activityId: number;
    description: string;
    date: string;
    authorCount: number;
    file?: File | null;
}

interface DisciplineActivityRule {
    expression: string;
    positionType: string;
    minimumCount: number;
}

interface DisciplinePointRule {
    expression: string;
    positionType: string;
    minPoint: number;
    maxPoint: number;
}

interface DisciplineRule {
    disiciplineName: string;
    activityRules: DisciplineActivityRule[];
    pointRules: DisciplinePointRule[];
}

interface PointMultiplier {
    peopleCountCondition: string;
    multiplier: string;
}

interface PointTable {
    pointMultipliers: PointMultiplier[];
}

export default defineComponent({
    name: 'DashboardPage',

    setup() {
        // Kullanıcı Verisi ve Kimlik Bilgileri
        const user = reactive<User>({
            id_number: undefined,
            name: '',
            surname: '',
            bornYear: undefined,
            email: '',
            roles: []
        });

        // Menü Yönetimi
        const activeMenuItem = ref<string>('dashboard');
        const menuItems = [
            { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-line', roles: ['admin', 'administrator', 'jury', 'applicant'] },
            { id: 'activities', label: 'Aktiviteler', icon: 'fas fa-tasks', roles: ['admin', 'administrator', 'jury', 'applicant'] },
            { id: 'discipline-rules', label: 'Disiplin Kuralları', icon: 'fas fa-book', roles: ['admin'] },
            { id: 'user-management', label: 'Kullanıcı Yönetimi', icon: 'fas fa-users', roles: ['admin'] },
            { id: 'multipliers', label: 'Puan Çarpanları', icon: 'fas fa-calculator', roles: ['admin'] },
            { id: 'profile', label: 'Profil', icon: 'fas fa-user', roles: ['admin', 'administrator', 'jury', 'applicant'] }
        ];

        // İstatistikler
        const totalPoints = ref<number>(0);
        const completedActivities = ref<number>(0);
        const pendingReviews = ref<number>(0);
        const disciplineStatus = ref<string>('Değerlendiriliyor');

        // Veri Koleksiyonları
        const categories = ref<Category[]>([]);
        const userActivities = ref<Activity[]>([]);
        const disciplineRules = ref<DisciplineRule[]>([]);
        const pointTable = ref<PointTable>({ pointMultipliers: [] });
        const users = ref<User[]>([]);

        // Filtreler
        const activityFilters = reactive<ActivityFilters>({
            category: '',
            status: '',
            dateRange: '',
            search: ''
        });
        const userSearchQuery = ref<string>('');

        // Form Verisi
        const passwordForm = reactive<PasswordForm>({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        const passwordError = ref<string>('');

        // Modal Yönetimi
        const showActivityModal = ref<boolean>(false);
        const showRoleModal = ref<boolean>(false);
        const editingActivity = ref<boolean>(false);
        const activityForm = reactive<ActivityForm>({
            category: '',
            activityId: 0,
            description: '',
            date: new Date().toISOString().split('T')[0],
            authorCount: 1,
            file: null
        });
        const selectedUser = ref<User | null>(null);
        const selectedRoles = ref<string[]>([]);

        // Disiplin Kuralları
        const activeDisciplineRule = ref<string>('');

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
        const getCategoryPoints = (categoryCode: string) => {
            return userActivities.value
                .filter(a => a.category === categoryCode && a.status === 'completed')
                .reduce((sum, a) => sum + a.point, 0);
        };

        const getCategoryPercentage = (categoryCode: string) => {
            const category = categories.value.find(c => c.Code === categoryCode);
            if (!category) return 0;

            const maxPoints = category.activities.reduce((sum, a) => sum + a.point, 0);
            const userPoints = getCategoryPoints(categoryCode);

            if (maxPoints === 0) return 0;
            return Math.min(100, Math.round((userPoints / maxPoints) * 100));
        };

        const getCategoryColor = (categoryCode: string) => {
            const percentage = getCategoryPercentage(categoryCode);
            if (percentage >= 80) return '#2e7d32'; // Yeşil
            if (percentage >= 50) return '#ff9800'; // Turuncu
            return '#f44336'; // Kırmızı
        };

        const getStatusText = (status: string) => {
            switch (status) {
                case 'completed': return 'Tamamlandı';
                case 'pending': return 'Değerlendirme Bekliyor';
                case 'rejected': return 'Reddedildi';
                default: return status;
            }
        };

        const getStatusIcon = (status: string) => {
            switch (status) {
                case 'completed': return 'fas fa-check-circle';
                case 'pending': return 'fas fa-clock';
                case 'rejected': return 'fas fa-times-circle';
                default: return 'fas fa-question-circle';
            }
        };

        const getRoleName = (role: string) => {
            switch (role) {
                case 'admin': return 'Sistem Yöneticisi';
                case 'administrator': return 'Yönetici';
                case 'jury': return 'Jüri Üyesi';
                case 'applicant': return 'Başvuru Sahibi';
                default: return role;
            }
        };

        const getPositionName = (position: string) => {
            switch (position) {
                case 'Lecturer': return 'Dr. Öğr. Üyesi';
                case 'AssociateProfessor': return 'Doçent';
                case 'Professor': return 'Profesör';
                default: return position;
            }
        };

        const formatDate = (dateString: string) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('tr-TR');
        };

        const getActivitiesByCategory = (categoryCode: string) => {
            const category = categories.value.find(c => c.Code === categoryCode);
            return category ? category.activities : [];
        };

        const getMultiplierValue = (authorCount: number) => {
            for (const multiplier of pointTable.value.pointMultipliers) {
                if (multiplier.peopleCountCondition.includes('-')) {
                    const [min, max] = multiplier.peopleCountCondition.split('-').map(Number);
                    if (authorCount >= min && authorCount <= max) {
                        if (multiplier.multiplier === '1/people') {
                            return `1/${authorCount} (${(1 / authorCount).toFixed(2)})`;
                        }
                        return multiplier.multiplier;
                    }
                } else if (multiplier.peopleCountCondition.includes('+')) {
                    const minCount = parseInt(multiplier.peopleCountCondition.replace('+', ''));
                    if (authorCount >= minCount) {
                        if (multiplier.multiplier === '1/people') {
                            return `1/${authorCount} (${(1 / authorCount).toFixed(2)})`;
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
        const navigateTo = (menuId: string) => {
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

        const viewActivity = (activityId: number) => {
            const activity = userActivities.value.find(a => a.id === activityId);
            if (!activity) return;

            // Burada aktivite detayları gösterilebilir
            console.log(`View activity ${activityId}:`, activity);
        };

        const editActivity = (activityId: number) => {
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

        const deleteActivity = async (activityId: number) => {
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

        const handleFileUpload = (event: Event) => {
            const input = event.target as HTMLInputElement;
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
        const editUserRoles = (userToEdit: User) => {
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

        const editActivityRule = (index: number) => {
            // Burada aktivite kuralı düzenleme işlemi yapılabilir
        };

        const deleteActivityRule = (index: number) => {
            // Burada aktivite kuralı silme işlemi yapılabilir
        };

        const editPointRule = (index: number) => {
            // Burada puan kuralı düzenleme işlemi yapılabilir
        };

        const deletePointRule = (index: number) => {
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
        const editMultiplier = (index: number) => {
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
            } catch (error: any) {
                console.error('Password change error:', error);
                passwordError.value = error.response?.data?.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.';
            }
        };

        // Kullanıcı Görüntüleme
        const viewUser = (userId: number) => {
            // Burada kullanıcı detayları görüntülenebilir
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
