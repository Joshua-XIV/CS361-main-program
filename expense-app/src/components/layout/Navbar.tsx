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
        <div className="nav-links-left">
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
        <div className="profile flex justify-end">
          <NavLink to="/" className='logout-link' onClick={handleLogout}>
            Logout
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar