import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { Home, Calendar, Edit, LogOut, Menu, X } from "lucide-react";
import { navbarStylesDr } from "../assets/dummyStyles";
import logo from "../assets/Logo1.png";

const STORAGE_KEY = "doctorToken_v1";

const DoctorNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);

  // Derive doctorId from route params or pathname
  const doctorId = useMemo(() => {
    if (params?.id) return params.id;
    const m = location.pathname.match(/\/doctor-admin\/([^/]+)/);
    if (m) return m[1];
    return null;
  }, [params, location.pathname]);

  const basePath = doctorId
    ? `/doctor-admin/${doctorId}`
    : "/doctor-admin/login";

  const navItems = [
    { name: "Dashboard", to: `${basePath}`, Icon: Home },
    { name: "Appointments", to: `${basePath}/appointments`, Icon: Calendar },
    { name: "Edit Profile", to: `${basePath}/profile/edit`, Icon: Edit },
  ];

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    navigate("/doctor-admin/login");
  };

  return (
    <>
      {/* Top spacer so content isn't hidden behind fixed navbar */}
      <div className={navbarStylesDr.spacer} />

      <nav ref={navRef} className={navbarStylesDr.navContainer}>
        {/* ── Left: Brand ── */}
        <Link to={basePath} className={navbarStylesDr.leftBrand}>
          <div className={navbarStylesDr.logoContainer}>
            <img src={logo} alt="Medi-B Logo" className={navbarStylesDr.logoImage} />
          </div>
          <div className={navbarStylesDr.brandTextContainer}>
            <p className={navbarStylesDr.brandTitle}>Medi-B</p>
            <p className={navbarStylesDr.brandSubtitle}>Doctor Portal</p>
          </div>
        </Link>

        {/* ── Centre: Desktop Nav Links ── */}
        <div className={navbarStylesDr.desktopMenu}>
          <div className={navbarStylesDr.desktopMenuItems}>
            {navItems.map(({ name, to, Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={name}
                  to={to}
                  className={`${navbarStylesDr.baseLink} ${
                    isActive
                      ? navbarStylesDr.activeLink
                      : navbarStylesDr.inactiveLink
                  }`}
                >
                  <span className={navbarStylesDr.linkContent}>
                    <Icon size={16} className={navbarStylesDr.linkIcon} />
                    <span className={navbarStylesDr.linkText}>{name}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Right: Actions ── */}
        <div className={navbarStylesDr.rightActions}>
          {/* Desktop Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className={navbarStylesDr.logoutButtonDesktop}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>

          {/* Hamburger – small screens (< md) */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={navbarStylesDr.hamburgerButtonMd}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Hamburger – medium screens (md → lg) */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={navbarStylesDr.hamburgerButtonLg}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile / Tablet Dropdown Menu ── */}
      <div className={navbarStylesDr.mobileMenuContainer(isOpen)}>
        <div className={navbarStylesDr.mobileMenuContent}>
          {navItems.map(({ name, to, Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={name}
                to={to}
                onClick={() => setIsOpen(false)}
                className={`${navbarStylesDr.mobileBaseLink} ${
                  isActive
                    ? navbarStylesDr.mobileActiveLink
                    : navbarStylesDr.mobileInactiveLink
                }`}
              >
                <Icon size={18} />
                <span>{name}</span>
              </Link>
            );
          })}

          {/* Mobile Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className={navbarStylesDr.mobileLogoutButton}
          >
            <span className={navbarStylesDr.mobileLogoutContent}>
              <LogOut size={16} />
              Logout
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default DoctorNavbar;
