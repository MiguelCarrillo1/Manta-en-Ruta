import api from './api';
import { Line, Stop, PointOfInterest } from '../types';

export const publicService = {
  getLines: () => api.get<{ success: boolean; data: Line[] }>('/public/lines'),
  getLine: (id: number) => api.get<{ success: boolean; data: Line }>(`/public/lines/${id}`),
  getStops: () => api.get<{ success: boolean; data: Stop[] }>('/public/stops'),
  getStop: (id: number) => api.get<{ success: boolean; data: Stop }>(`/public/stops/${id}`),
  getPois: () => api.get<{ success: boolean; data: PointOfInterest[] }>('/public/pois'),
  getPoi: (id: number) => api.get<{ success: boolean; data: PointOfInterest }>(`/public/pois/${id}`),
  getPoiCategories: () => api.get('/public/pois/categories/list'),
};
