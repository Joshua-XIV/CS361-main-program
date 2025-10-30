import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const Layout = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 5000); // hide after fadeOut completes
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className='background-layout-two'>
      {showWelcome && (
        <div className='welcome-message'>
          Welcome<br/>User
        </div>
      )}
      {!showWelcome && (
        <main className='page-content'>
          <div className='page-card'>
            <Navbar />
            <Outlet />
          </div>
        </main>
      )}
    </div>
  );
}

export default Layout