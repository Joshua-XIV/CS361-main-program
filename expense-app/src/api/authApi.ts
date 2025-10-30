const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface LoginRequest {
  email: string;
  passwordHash: string;
}

interface SignupRequest {
  email: string;
  passwordHash: string;
}

interface UserResponse {
  id?: number;
  email: string;
  passwordHash: string;
  createdAt?: string;
}

export const authApi = {
  // POST to /users/testAuth
  login: async (email: string, passwordHash: string): Promise<UserResponse> => {
    const response = await fetch(`${API_URL}/users/testAuth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, passwordHash }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        const errorText = await response.text();
        throw new Error(errorText || 'Invalid credentials');
      }
      throw new Error('Login failed');
    }

    return response.json();
  },

  // POST to /users/testAddUser
  signup: async (email: string, passwordHash: string): Promise<UserResponse> => {
    const response = await fetch(`${API_URL}/users/testAddUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, passwordHash }),
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('User already exists or invalid data');
      }
      throw new Error('Signup failed');
    }

    return response.json();
  },
};