import apiClient from './api.service';

// İlan tipleri
export interface Announcement {
  _id?: string;
  title: string;
  content: string;
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  disciplineRules?: DisciplineRule[];
  juries?: string[] | User[];
}

export interface DisciplineRule {
  _id?: string;
  disiciplineName: string;
  activityRules: ActivityRule[];
  pointRules: PointRule[];
}

export interface ActivityRule {
  _id?: string;
  expression: string;
  positionType: string;
  minimumCount: number;
}

export interface PointRule {
  _id?: string;
  expression: string;
  positionType: string;
  minPoint: number;
  maxPoint: number;
}

export interface User {
  _id?: string;
  id_number?: number;
  name?: string;
  surname?: string;
  email?: string;
  roles?: string[];
}

const announcementService = {
  // Tüm ilanları getir
  getAnnouncements: async (): Promise<Announcement[]> => {
    const response = await apiClient.get('/staff-announcements');
    return response.data;
  },

  // ID'ye göre ilan getir
  getAnnouncementById: async (id: string): Promise<Announcement> => {
    const response = await apiClient.get(`/staff-announcements/${id}`);
    return response.data;
  },

  // Jüri ID'sine göre ilanları getir
  getAnnouncementsByJuryId: async (id_number: number): Promise<Announcement[]> => {
    const response = await apiClient.get(`/staff-announcements/jury/${id_number}`);
    return response.data;
  },

  // İlandaki jürileri getir
  getJuriesFromAnnouncement: async (id: string): Promise<User[]> => {
    const response = await apiClient.get(`/staff-announcements/${id}/juries`);
    return response.data;
  },

  // Yeni ilan oluştur
  createAnnouncement: async (announcement: Announcement): Promise<{ message: string }> => {
    const response = await apiClient.post('/staff-announcements', announcement);
    return response.data;
  },

  // İlanı güncelle
  updateAnnouncement: async (id: string, announcement: Announcement): Promise<Announcement> => {
    const response = await apiClient.put(`/staff-announcements/${id}`, announcement);
    return response.data;
  },

  // İlanı sil
  deleteAnnouncement: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/staff-announcements/${id}`);
    return response.data;
  },

  // İlandaki disiplin kurallarını güncelle
  updateDisciplineRules: async (id: string): Promise<Announcement> => {
    const response = await apiClient.put(`/staff-announcements/${id}/discipline-rules`);
    return response.data;
  }
};

export default announcementService;