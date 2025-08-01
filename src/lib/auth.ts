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

// Mock user data
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
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const userData = mockUsers[email];
  if (!userData || userData.password !== password) {
    throw new Error('Invalid credentials');
  }
  
  return userData.user;
};

export const signUp = async (name: string, email: string, password: string, role: UserRole): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
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
  return newUser;
};

export const signOut = async (): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
};