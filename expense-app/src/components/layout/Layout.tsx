import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { useAuth } from '../../hooks/useAuth'

const Layout = () => {
  const { user } = useAuth()
  const [showWelcome, setShowWelcome] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 5000); // hide after fadeOut completes
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className='background-layout-two'>
      {showWelcome && (
        <div className='welcome-message'>
          Welcome<br/>{user ? user.name : "User"}
        </div>
      )}
      {!showWelcome && (
        <main className='page-content'>
          <Navbar/>
          <Outlet/>
        </main>
      )}
    </div>
  );
}

export default Layout