import api from './api';

export const superadminService = {
  getCooperatives: (params?: { q?: string; scope?: string; is_active?: string }) =>
    api.get('/superadmin/cooperatives', { params }),
  getCooperative: (id: number) => api.get(`/superadmin/cooperatives/${id}`),
  createCooperative: (data: any) => api.post('/superadmin/cooperatives', data),
  updateCooperative: (id: number, data: any) => api.put(`/superadmin/cooperatives/${id}`, data),
  deleteCooperative: (id: number) => api.delete(`/superadmin/cooperatives/${id}`),
  assignGerente: (id: number, userId: number) =>
    api.post(`/superadmin/cooperatives/${id}/assign-gerente`, { user_id: userId }),

  getGlobalConfig: () => api.get('/superadmin/global-config'),
  updateGlobalConfig: (data: any) => api.put('/superadmin/global-config', data),

  getCatalogs: () => api.get('/superadmin/catalogs'),
  createCatalog: (data: any) => api.post('/superadmin/catalogs', data),
  updateCatalog: (id: number, data: any) => api.put(`/superadmin/catalogs/${id}`, data),
  deleteCatalog: (id: number) => api.delete(`/superadmin/catalogs/${id}`),
  getCatalogItems: (catalogId: number) => api.get(`/superadmin/catalogs/${catalogId}/items`),
  createCatalogItem: (catalogId: number, data: any) => api.post(`/superadmin/catalogs/${catalogId}/items`, data),
  updateCatalogItem: (catalogId: number, itemId: number, data: any) =>
    api.put(`/superadmin/catalogs/${catalogId}/items/${itemId}`, data),
  deleteCatalogItem: (catalogId: number, itemId: number) =>
    api.delete(`/superadmin/catalogs/${catalogId}/items/${itemId}`),

  getRoles: () => api.get('/superadmin/roles'),
  getRole: (id: number) => api.get(`/superadmin/roles/${id}`),
  assignPermissions: (id: number, permissionIds: number[]) =>
    api.put(`/superadmin/roles/${id}/permissions`, { permission_ids: permissionIds }),
  getPermissions: () => api.get('/superadmin/permissions'),

  getUsers: (params?: { q?: string }) => api.get('/superadmin/users', { params }),
  createUser: (data: any) => api.post('/superadmin/users', data),

  getLogs: (params?: { from?: string; to?: string; user_id?: number; action?: string }) =>
    api.get('/superadmin/logs', { params }),
  getAudit: (params?: { from?: string; to?: string; severity?: string }) =>
    api.get('/superadmin/audit', { params }),

  getGlobalStatistics: () => api.get('/superadmin/statistics/global'),
};
