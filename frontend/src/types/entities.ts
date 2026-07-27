export interface Vehicle {
  id: number;
  cooperative_id: number;
  plate: string;
  brand: string;
  model: string;
  year: number;
  capacity: number;
  status: 'active' | 'inactive' | 'maintenance';
  has_ac: boolean;
  has_wifi: boolean;
  vehicle_type: 'bus' | 'van' | 'microbus';
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: number;
  cooperative_id: number;
  user_id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  license_number: string;
  license_expiration: string;
  phone: string;
  status: 'available' | 'on_journey' | 'off_duty';
  created_at: string;
  updated_at: string;
}

export interface Journey {
  id: number;
  driver_id: number;
  vehicle_id: number;
  cooperative_id: number;
  line_id: number | null;
  start_time: string;
  end_time: string | null;
  start_lat: string;
  start_lng: string;
  end_lat: string | null;
  end_lng: string | null;
  start_odometer: number;
  end_odometer: number | null;
  status: 'active' | 'completed' | 'cancelled';
  vehicle?: Vehicle;
  driver?: Driver;
  line?: Line;
  ticket_count?: number;
  total_collected?: number;
  distance_km?: number;
}

export interface Line {
  id: number;
  cooperative_id: number;
  name: string;
  description: string;
  color: string;
  status: 'active' | 'inactive';
  stops: Stop[];
  vehicles_count?: number;
}

export interface Stop {
  id: number;
  cooperative_id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  order: number;
  lines?: Line[];
}

export interface PointOfInterest {
  id: number;
  cooperative_id: number;
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  type: 'landmark' | 'terminal' | 'station' | 'other';
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: number;
  cooperative_id: number;
  driver_id: number | null;
  vehicle_id: number | null;
  type: 'emergency' | 'mechanical' | 'traffic' | 'accident' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  latitude: string;
  longitude: string;
  status: 'active' | 'attended' | 'resolved' | 'closed';
  assigned_to: number | null;
  driver?: Driver;
  vehicle?: Vehicle;
  created_at: string;
  updated_at: string;
}

export interface Maintenance {
  id: number;
  cooperative_id: number;
  vehicle_id: number;
  driver_id: number | null;
  type: 'preventive' | 'corrective' | 'predictive';
  description: string;
  scheduled_date: string;
  completed_date: string | null;
  cost: number | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  mechanic: string;
  notes: string;
  vehicle?: Vehicle;
  driver?: Driver;
  created_at: string;
  updated_at: string;
}

export interface FuelRecord {
  id: number;
  journey_id: number;
  driver_id: number;
  vehicle_id: number;
  cooperative_id: number;
  amount: number;
  cost: number;
  liters: number;
  latitude: string;
  longitude: string;
  odometer: number;
  created_at: string;
  updated_at: string;
}

export interface Position {
  id: number;
  driver_id: number;
  vehicle_id: number;
  cooperative_id: number;
  latitude: string;
  longitude: string;
  speed: number;
  heading: number;
  recorded_at: string;
}

export interface Catalog {
  id: number;
  name: string;
  description: string;
  scope: 'global' | 'cooperative';
  cooperative_id: number | null;
  items: CatalogItem[];
  created_at: string;
  updated_at: string;
}

export interface CatalogItem {
  id: number;
  catalog_id: number;
  code: string;
  label: string;
  value: string;
  order: number;
  active: boolean;
  children?: CatalogItem[];
  created_at: string;
  updated_at: string;
}

export interface GlobalConfig {
  id: number;
  key: string;
  value: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Statistics {
  total_vehicles: number;
  active_vehicles: number;
  total_drivers: number;
  active_drivers: number;
  total_journeys: number;
  active_journeys: number;
  total_km: number;
  total_fuel_cost: number;
  total_maintenance_cost: number;
  alerts_resolved: number;
  alerts_pending: number;
}
