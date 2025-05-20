import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../../features/auth/authSlice'

const Nav = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    const { user, userInfo } = useSelector((state) => state.auth)

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Close mobile menu when location changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate("/")
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    return (
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container">
                <NavLink className="logo" to="/">
                    Power Monitor
                </NavLink>
                
                {/* Mobile menu button */}
                <div className="mobile-menu-button" onClick={toggleMobileMenu}>
                    <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}></span>
                </div>
                
                {/* Navigation links */}
                <div className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    <ul className="nav-links">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <NavLink 
                                        className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} 
                                        to="/dashboard"
                                    >
                                        Dashboard
                                    </NavLink>
                                </li>
                                
                                {userInfo && (
                                    <li className="nav-item user-profile">
                                        <div className="user-avatar">
                                            {userInfo.first_name ? userInfo.first_name[0] : ''}
                                        </div>
                                        <div className="user-dropdown">
                                            <div className="user-info">
                                                <p className="user-name">{userInfo.first_name} {userInfo.last_name}</p>
                                                <p className="user-email">{userInfo.email}</p>
                                            </div>
                                            <div className="dropdown-divider"></div>
                                            <button className="dropdown-item" onClick={() => navigate('/profile')}>
                                                Profile Settings
                                            </button>
                                            <button className="dropdown-item logout-button" onClick={handleLogout}>
                                                Logout
                                            </button>
                                        </div>
                                    </li>
                                )}
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <NavLink 
                                        className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} 
                                        to="/login"
                                    >
                                        Login
                                    </NavLink>
                                </li>

                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Nav