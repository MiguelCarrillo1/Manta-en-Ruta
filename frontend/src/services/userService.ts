import api from './api';

export const userService = {
  search: (params: { q?: string; lat?: string; lng?: string }) =>
    api.get('/user/search', { params }),
  searchNearby: (params: { lat: string; lng: string; radius?: number }) =>
    api.get('/user/search/nearby', { params }),
  getActiveBuses: () => api.get('/user/buses/active'),
  getNearbyBuses: (params: { lat: string; lng: string; radius?: number }) =>
    api.get('/user/buses/nearby', { params }),
  getBus: (id: number) => api.get(`/user/buses/${id}`),
  getBusEta: (busId: number, stopId: number) =>
    api.get(`/user/buses/${busId}/eta`, { params: { stop_id: stopId } }),
};
