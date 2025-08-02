import apiService from './api';

export type UserRole = 'customer' | 'team_manager' | 'team_member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Mock user data for fallback
const mockUsers: Record<string, { password: string; user: User }> = {
  'customer@pitchforge.com': {
    password: 'password',
    user: {
      id: '1',
      name: 'John Customer',
      email: 'customer@pitchforge.com',
      role: 'customer'
    }
  },
  'manager@pitchforge.com': {
    password: 'password',
    user: {
      id: '2',
      name: 'Sarah Manager',
      email: 'manager@pitchforge.com',
      role: 'team_manager'
    }
  },
  'member@pitchforge.com': {
    password: 'password',
    user: {
      id: '3',
      name: 'Mike Developer',
      email: 'member@pitchforge.com',
      role: 'team_member'
    }
  }
};

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    // Try backend API first
    const response = await apiService.signIn(email, password);
    const { user, token } = response;
    
    // Store token and user data
    localStorage.setItem('pitchforge_token', token);
    localStorage.setItem('pitchforge_user', JSON.stringify(user));
    
    return user;
  } catch (error) {
    // Fallback to mock data for development
    console.warn('Backend API unavailable, using mock data:', error);
    
    const userData = mockUsers[email];
    if (!userData || userData.password !== password) {
      throw new Error('Invalid credentials');
    }
    
    // Store user data for mock authentication
    localStorage.setItem('pitchforge_user', JSON.stringify(userData.user));
    
    return userData.user;
  }
};

export const signUp = async (name: string, email: string, password: string, role: UserRole): Promise<User> => {
  try {
    // Try backend API first
    const response = await apiService.signUp(name, email, password, role);
    const { user, token } = response;
    
    // Store token and user data
    localStorage.setItem('pitchforge_token', token);
    localStorage.setItem('pitchforge_user', JSON.stringify(user));
    
    return user;
  } catch (error) {
    // Fallback to mock data for development
    console.warn('Backend API unavailable, using mock data:', error);
    
    if (mockUsers[email]) {
      throw new Error('User already exists');
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role
    };
    
    mockUsers[email] = { password, user: newUser };
    localStorage.setItem('pitchforge_user', JSON.stringify(newUser));
    
    return newUser;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    // Try backend API first
    await apiService.signOut();
  } catch (error) {
    console.warn('Backend API unavailable for signout:', error);
  } finally {
    // Clear stored data
    localStorage.removeItem('pitchforge_token');
    localStorage.removeItem('pitchforge_user');
  }
};

// Persistent authentication functions
export const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem('pitchforge_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const storeUser = (user: User): void => {
  localStorage.setItem('pitchforge_user', JSON.stringify(user));
};

export const clearStoredUser = (): void => {
  localStorage.removeItem('pitchforge_user');
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem('pitchforge_token');
};

export const isAuthenticated = (): boolean => {
  const token = getStoredToken();
  const user = getStoredUser();
  return !!(token && user);
};