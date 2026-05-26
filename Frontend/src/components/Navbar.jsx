import React from 'react'
import{NavbarStyles} from '../assets/dummyStyles';

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
  const navigate = useNavigate();

  return (
    <>
    <div className={navbarStyles.navbarBorder}>
    </div>
    < nav className={`${NavbarStyles.navbarContainer} ${
        showNavbar ? navbarStyles.navbarVisible : navbarStyles.navbarHidden
    }`}>
    </nav>
    </>
  )
}

export default Navbar
