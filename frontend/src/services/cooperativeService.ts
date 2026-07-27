import api from './api';
import { Vehicle, Driver, Line, Stop, PointOfInterest, Alert, Maintenance, Statistics, FuelRecord, Journey } from '../types';

export const cooperativeService = {
  // Statistics
  getStatistics: () => api.get<Statistics>('/cooperative/statistics/dashboard'),
  getKmStatistics: (params?: { date_from?: string; date_to?: string }) =>
    api.get('/cooperative/statistics/kilometers', { params }),
  getFuelStatistics: (params?: { date_from?: string; date_to?: string }) =>
    api.get('/cooperative/statistics/fuel', { params }),
  getMaintenanceStatistics: (params?: { date_from?: string; date_to?: string }) =>
    api.get('/cooperative/statistics/maintenance', { params }),
  getIncidentStatistics: (params?: { date_from?: string; date_to?: string }) =>
    api.get('/cooperative/statistics/incidents', { params }),
  getJourneyStatistics: (params?: { date_from?: string; date_to?: string }) =>
    api.get('/cooperative/statistics/journeys', { params }),

  // Vehicles
  getVehicles: () => api.get<{ data: Vehicle[] }>('/cooperative/vehicles'),
  getVehicle: (id: number) => api.get<Vehicle>(`/cooperative/vehicles/${id}`),
  createVehicle: (data: Partial<Vehicle>) => api.post<Vehicle>('/cooperative/vehicles', data),
  updateVehicle: (id: number, data: Partial<Vehicle>) => api.put<Vehicle>(`/cooperative/vehicles/${id}`, data),
  deleteVehicle: (id: number) => api.delete(`/cooperative/vehicles/${id}`),

  // Drivers
  getDrivers: () => api.get<{ data: Driver[] }>('/cooperative/drivers'),
  getDriver: (id: number) => api.get<Driver>(`/cooperative/drivers/${id}`),
  createDriver: (data: Partial<Driver>) => api.post<Driver>('/cooperative/drivers', data),
  updateDriver: (id: number, data: Partial<Driver>) => api.put<Driver>(`/cooperative/drivers/${id}`, data),
  deleteDriver: (id: number) => api.delete(`/cooperative/drivers/${id}`),

  // Monitoring
  getVehiclesPositions: () => api.get<{ data: any[] }>('/cooperative/monitoring/vehicles'),
  getPositions: () => api.get('/cooperative/monitoring/positions'),
  getActiveJourneys: () => api.get<{ data: Journey[] }>('/cooperative/monitoring/journeys/active'),
  getVehiclePosition: (vehicleId: number) => api.get(`/cooperative/monitoring/vehicles/${vehicleId}`),

  // Lines
  getLines: () => api.get<{ data: Line[] }>('/cooperative/lines'),
  getLine: (id: number) => api.get<Line>(`/cooperative/lines/${id}`),
  createLine: (data: { name: string; description?: string; color?: string; stop_ids?: number[] }) =>
    api.post<Line>('/cooperative/lines', data),
  updateLine: (id: number, data: Partial<Line>) => api.put<Line>(`/cooperative/lines/${id}`, data),
  deleteLine: (id: number) => api.delete(`/cooperative/lines/${id}`),
  assignStops: (id: number, stopIds: number[]) =>
    api.post(`/cooperative/lines/${id}/stops`, { stop_ids: stopIds }),

  // Stops
  getStops: () => api.get<{ data: Stop[] }>('/cooperative/stops'),
  createStop: (data: Partial<Stop>) => api.post<Stop>('/cooperative/stops', data),
  updateStop: (id: number, data: Partial<Stop>) => api.put<Stop>(`/cooperative/stops/${id}`, data),
  deleteStop: (id: number) => api.delete(`/cooperative/stops/${id}`),

  // POIs
  getPois: () => api.get<{ data: PointOfInterest[] }>('/cooperative/pois'),
  createPoi: (data: Partial<PointOfInterest>) => api.post<PointOfInterest>('/cooperative/pois', data),
  updatePoi: (id: number, data: Partial<PointOfInterest>) => api.put<PointOfInterest>(`/cooperative/pois/${id}`, data),
  deletePoi: (id: number) => api.delete(`/cooperative/pois/${id}`),

  // Alerts
  getAlerts: () => api.get<{ data: Alert[] }>('/cooperative/alerts'),
  getAlert: (id: number) => api.get<Alert>(`/cooperative/alerts/${id}`),
  attendAlert: (id: number) => api.patch(`/cooperative/alerts/${id}/attend`),
  resolveAlert: (id: number) => api.patch(`/cooperative/alerts/${id}/resolve`),
  closeAlert: (id: number) => api.patch(`/cooperative/alerts/${id}/close`),

  // Maintenance
  getMaintenances: () => api.get<{ data: Maintenance[] }>('/cooperative/maintenance'),
  getUpcomingMaintenance: () => api.get<{ data: Maintenance[] }>('/cooperative/maintenance/upcoming'),
  getMaintenanceTypes: () => api.get('/cooperative/maintenance/types/list'),
  getMaintenance: (id: number) => api.get<Maintenance>(`/cooperative/maintenance/${id}`),
  createMaintenance: (data: Partial<Maintenance>) => api.post<Maintenance>('/cooperative/maintenance', data),
  updateMaintenance: (id: number, data: Partial<Maintenance>) => api.put<Maintenance>(`/cooperative/maintenance/${id}`, data),
  deleteMaintenance: (id: number) => api.delete(`/cooperative/maintenance/${id}`),

  // Emergencies
  getEmergencies: () => api.get<{ data: any[] }>('/cooperative/emergencies'),
  getEmergency: (id: number) => api.get(`/cooperative/emergencies/${id}`),
  updateEmergencyStatus: (id: number, status: string) =>
    api.patch(`/cooperative/emergencies/${id}`, { status }),

  // Reports
  getReports: (params?: any) => api.get('/cooperative/reports', { params }),

  // Fuel
  getFuelHistory: (params?: { vehicle_id?: number; from?: string; to?: string }) =>
    api.get<{ data: any[] }>('/cooperative/statistics/fuel', { params }),
};
