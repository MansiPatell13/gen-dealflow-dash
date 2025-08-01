// Mock User model (in a real app, this would be a database model)
export class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
    this.password = data.password;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static getRolePermissions(role) {
    const permissions = {
      customer: [
        'read:own_briefs',
        'create:briefs',
        'read:own_pitches',
        'update:own_profile'
      ],
      team_manager: [
        'read:all_briefs',
        'assign:briefs',
        'read:all_pitches',
        'approve:pitches',
        'manage:case_studies',
        'read:analytics',
        'manage:users'
      ],
      team_member: [
        'read:assigned_briefs',
        'create:pitches',
        'update:own_pitches',
        'read:case_studies',
        'read:own_profile'
      ]
    };
    return permissions[role] || [];
  }

  hasPermission(permission) {
    const userPermissions = User.getRolePermissions(this.role);
    return userPermissions.includes(permission);
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

// Mock user data (in a real app, this would be in a database)
export const mockUsers = [
  {
    id: '1',
    name: 'John Customer',
    email: 'customer@pitchforge.com',
    role: 'customer',
    password: '$2b$10$example.hash', // bcrypt hash
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'manager@pitchforge.com',
    role: 'team_manager',
    password: '$2b$10$example.hash',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'Mike Developer',
    email: 'member@pitchforge.com',
    role: 'team_member',
    password: '$2b$10$example.hash',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]; 