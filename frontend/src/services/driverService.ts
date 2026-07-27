import api from './api';
import { Journey, FuelRecord, Position } from '../types';

export const driverService = {
  startJourney: (data: {
    vehicle_id: number;
    start_km: number;
  }) => api.post<Journey>('/driver/journey/start', data),

  finishJourney: (data: {
    end_lat?: string;
    end_lng?: string;
    end_km: number;
    ticket_count?: number;
    total_collected?: number;
  }) => api.put<Journey>('/driver/journey/finish', { end_km: data.end_km }),

  getActiveJourney: () => api.get<Journey>('/driver/journey/active'),

  getHistory: (params?: { page?: number; per_page?: number }) =>
    api.get<{ data: Journey[]; meta: any }>('/driver/journey/history', { params }),

  updatePosition: (data: {
    latitude: string;
    longitude: string;
    speed: number;
    heading: number;
    recorded_at?: string;
  }) => api.post<Position>('/driver/position', data),

  registerFuel: (data: {
    journey_id: number;
    amount: number;
    cost: number;
    liters: number;
    latitude: string;
    longitude: string;
    odometer: number;
  }) => api.post<FuelRecord>('/driver/fuel', data),

  sendEmergency: (data: {
    type: string;
    title: string;
    description: string;
    latitude: string;
    longitude: string;
  }) => api.post('/driver/emergency', data),

  addNote: (data: { journey_id: number; content: string }) =>
    api.post('/driver/notes', data),

  toggleAC: (vehicleId: number) =>
    api.patch(`/driver/vehicles/${vehicleId}/ac`),

  toggleWiFi: (vehicleId: number) =>
    api.patch(`/driver/vehicles/${vehicleId}/wifi`),
};
