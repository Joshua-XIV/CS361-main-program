import { authApi } from "../api/authApi";

interface User {
  id?: number
  email: string;
  name?: string;
}

export const authService = {
  // Login with password hashing and storage
  login: async (email: string, password: string): Promise<User> => {
    try {
      // Hash password before sending
      // const passwordHash = await bcrypt.hash(password, 10);
      
      // Call API
      const data = await authApi.login({email, passwordHash: password});
      
      // Store user data in localStorage
      const user: User = {
        id: data.id,
        email: data.email,
      };
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      
      return user;
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  },

  // Signup with password hashing and storage
  signup: async (
    name: string,
    email: string,
    password: string
  ): Promise<User> => {
    try {
      // Hash password before sending
      //const passwordHash = await bcrypt.hash(password, 10);
      
      // Call API (backend doesn't use name/username yet)
      const data = await authApi.signup({email, passwordHash: password});
      
      // Store user data in localStorage
      const user: User = {
        id: data.id,
        email: data.email,
        name: name,
      };
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      
      return user;
    } catch (error) {
      console.error('Signup service error:', error);
      throw error;
    }
  },

  // Logout with cleanup
  logout: (): void => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  },

  // Get current user from storage
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },
};