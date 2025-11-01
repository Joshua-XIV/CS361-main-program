import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

const mockUser = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
  username: "testuser"
};

localStorage.setItem("user", JSON.stringify(mockUser));
localStorage.setItem("isAuthenticated", "true");

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
