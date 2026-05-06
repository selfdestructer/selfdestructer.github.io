import { NavLink } from 'react-router-dom'
import './NavBar.css'

export default function NavBar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <span className="navbar-wave">🌊</span>
          <span className="navbar-title">NJ Coast</span>
          <span className="navbar-sub">Cape May County</span>
        </NavLink>
        <nav className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            Explore Map
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
            About
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
