import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  }

  return (
    <nav className='navbar'>
      <div className='nav-links'>
        <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Dashboard
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Transactions
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Categories
        </NavLink>
        <NavLink to="/budget" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Budget
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Settings
        </NavLink>
      </div>
      <div onClick={handleLogout} className='logout-button'>
        Hello User
      </div>
    </nav>
  );
}

export default Navbar