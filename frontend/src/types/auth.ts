export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  cooperative_id: number | null;
  cooperative?: {
    id: number;
    name: string;
  };
}

export type Role = 'superadmin' | 'gerente' | 'admin' | 'operador' | 'conductor' | 'usuario';

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}
