import React, { useState, useRef, useEffect } from 'react';
import { navbarStyles } from '../assets/dummyStyles';
import { useLocation, Link } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/react';
import { User, Key, Menu, X, LogOut } from 'lucide-react';
import logo from '../assets/Logo1.png';

const STORAGE_KEY = "doctorToken_v1";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(() => {
    try {
      return Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {
      return false;
    }
  });
  const location = useLocation();
  const navRef = useRef(null);
  const clerk = useClerk();
  const { user, isLoaded } = useUser();

    // Hide and show navbar on Scroll if greater than 80px from top

    useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);


  // Sync doctor login state across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        setIsDoctorLoggedIn(Boolean(e.newValue));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // close the toggle menu for mobile when clicking outside

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);


    const navItems = [
    { label: "Home", href: "/" },
    { label: "Doctors", href: "/doctors" },
    { label: "Services", href: "/services" },
    { label: "Appointments", href: "/appointments" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
    <div className={navbarStyles.navbarBorder}>
    </div>
    <nav ref={navRef}
    className={`${navbarStyles.navbarContainer} ${
        showNavbar ? navbarStyles.navbarVisible : navbarStyles.navbarHidden
    }`}>
      <div className={navbarStyles.contentWrapper}>
        <div className={navbarStyles.flexContainer}>
          {/* logo */}
          <Link to="/" className={navbarStyles.logoLink}>
          <div className={navbarStyles.logoContainer}>
            <div className={navbarStyles.logoImageWrapper}>
              <img 
              src={logo} 
              alt="Logo" 
              className={navbarStyles.logoImage} />
              </div>
              </div>          
              <div className={navbarStyles.logoTextContainer}>
                <h1 className={navbarStyles.logoTitle}>Medi-B</h1>
                <p className={navbarStyles.logoSubtitle}>Healthcare Solutions</p>
              </div>
          </Link>

          <div className={navbarStyles.desktopNav}>
            <div className={navbarStyles.navItemsContainer}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return(
                  <Link key={item.href} to={item.href}
                  className = {`${navbarStyles.navItem} ${
                    isActive ? navbarStyles.navItemActive : navbarStyles.navItemInactive
                    }`}> 
                    {item.label}
                     </Link>
                )
              })}
              </div>
          </div>

          {/* right side */}
          <div className={navbarStyles.rightContainer}>
            <Link to="/doctor-admin/login" className={navbarStyles.doctorAdminButton}>
              <User className={navbarStyles.doctorAdminIcon} />
              <span className={navbarStyles.doctorAdminText}>
                Doctor Admin
              </span>
            </Link>
              {isLoaded && user ? (
                <div className="ml-4 flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-gray-800">
                      {user.firstName || user.emailAddresses[0]?.emailAddress}
                    </span>
                  </div>
                  {user.imageUrl && (
                    <img
                      src={user.imageUrl}
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => clerk.signOut()}
                    className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => clerk.openSignIn()}
                  className="ml-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  <Key className="h-4 w-4" />
                 Login
                </button>
              )}
            {/* toggle */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={navbarStyles.mobileToggle}
            >
              {isOpen ? (
                <X className={navbarStyles.toggleicon} />
              ) : (
                <Menu className={navbarStyles.toggleicon} />
              )}
            </button>
          </div>
        </div>

        {/* mobile nav */}
        {isOpen && (
          <div className={navbarStyles.mobileMenu}>
            {navItems.map((item, idx) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                 key={idx}
                  to={item.href} 
                onClick={() => setIsOpen(false)}
                className={`${navbarStyles.mobileMenuItem} ${
                  isActive 
                  ? navbarStyles.mobileMenuItemActive 
                  : navbarStyles.mobileMenuItemInactive
             }`}
            >
              {item.label}
            </Link> 
            );
          })}

          <Link to="/doctor-admin/login" 
          className={navbarStyles.mobileDoctorAdminButton}
          onClick={() => setIsOpen(false)} >
            Doctor Admin
          </Link>

          <div className={navbarStyles.mobileLoginButtonContainer}>
              {isLoaded && user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    {user.imageUrl && (
                      <img
                        src={user.imageUrl}
                        alt="Profile"
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <span className="font-semibold text-gray-800">
                      {user.firstName || user.emailAddresses[0]?.emailAddress}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      clerk.signOut();
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    clerk.openSignIn();
                  }}
                  className={navbarStyles.mobileLoginButton}>
                  Login
                </button>
              )}
          </div>
          </div>
        )}
      </div>

      <style> {navbarStyles.animationStyles}</style>
    </nav>
    </>
  );
};

export default Navbar
