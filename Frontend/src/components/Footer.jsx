import { Link } from 'react-router-dom'
import {
  Activity,
  AtSign,
  BriefcaseBusiness,
  ChevronRight,
  Hash,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  PlayCircle,
  Send,
  Stethoscope,
} from 'lucide-react'
import { footerStyles } from '../assets/dummyStyles'
import logo from '../assets/Logo1.png'

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'Doctors', href: '/doctors' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
  { name: 'Appointments', href: '/appointments' },
]

const services = [
  { name: 'Blood Pressure Check', href: '/services' },
  { name: 'Blood Sugar Test', href: '/services' },
  { name: 'Full Blood Count', href: '/services' },
  { name: 'X-Ray Scan', href: '/services' },
  { name: 'Health Consultation', href: '/services' },
]

const socialLinks = [
  {
    Icon: MessageCircle,
    color: footerStyles.facebookColor,
    name: 'Facebook',
    href: 'https://www.facebook.com/people/Hexagon-Digital-Services/61567156598660/',
  },
  {
    Icon: Hash,
    color: footerStyles.twitterColor,
    name: 'Twitter',
    href: 'https://www.linkedin.com/company/hexagondigtial-services/',
  },
  {
    Icon: AtSign,
    color: footerStyles.instagramColor,
    name: 'Instagram',
    href: 'http://instagram.com/hexagondigitalservices?igsh=MWp2NG1oNTlibWVnZA%3D%3D',
  },
  {
    Icon: BriefcaseBusiness,
    color: footerStyles.linkedinColor,
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/hexagondigtial-services/',
  },
  {
    Icon: PlayCircle,
    color: footerStyles.youtubeColor,
    name: 'YouTube',
    href: 'https://youtube.com/@hexagondigitalservices?si=lxEFYNCP42t6AoDJ',
  },
]

const contactItems = [
  {
    Icon: Phone,
    text: '+91 82994 31275',
    href: 'tel:8299431275',
  },
  {
    Icon: Mail,
    text: 'support@medi-b.com',
    href: 'mailto:support@medi-b.com',
  },
  {
    Icon: MapPin,
    text: 'Lucknow, Uttar Pradesh',
    href: 'https://www.google.com/maps/search/Lucknow,+Uttar+Pradesh',
  },
]

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={footerStyles.footerContainer}>
      <style>{footerStyles.animationStyles}</style>

      <div className={footerStyles.floatingIcon1} aria-hidden="true">
        <Stethoscope className={footerStyles.stethoscopeIcon} />
      </div>
      <div className={footerStyles.floatingIcon2} aria-hidden="true">
        <Activity className={footerStyles.activityIcon} />
      </div>

      <div className={footerStyles.mainContent}>
        <div className={footerStyles.gridContainer}>
          <div className={footerStyles.companySection}>
            <Link to="/" className={footerStyles.logoContainer}>
              <div className={footerStyles.logoWrapper}>
                <div className={footerStyles.logoImageContainer}>
                  <img src={logo} alt="Medi-B logo" className={footerStyles.logoImage} />
                </div>
              </div>
              <div>
                <h2 className={footerStyles.companyName}>Medi-B</h2>
                <p className={footerStyles.companyTagline}>Healthcare Solutions</p>
              </div>
            </Link>

            <p className={footerStyles.companyDescription}>
              Reliable healthcare appointments, trusted doctors, and essential diagnostic services in one simple
              platform.
            </p>

            <div className={footerStyles.contactContainer}>
              {contactItems.map(({ Icon, text, href }) => (
                <a
                  className={footerStyles.contactItem}
                  href={href}
                  key={text}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <span className={footerStyles.contactIconWrapper}>
                    <Icon className={footerStyles.contactIcon} />
                  </span>
                  <span className={footerStyles.contactText}>{text}</span>
                </a>
              ))}
            </div>
          </div>

          <div className={footerStyles.linksSection}>
            <h3 className={footerStyles.sectionTitle}>Quick Links</h3>
            <ul className={footerStyles.linksList}>
              {quickLinks.map((link) => (
                <li className={footerStyles.linkItem} key={link.name}>
                  <Link to={link.href} className={footerStyles.quickLink}>
                    <span className={footerStyles.quickLinkIconWrapper}>
                      <ChevronRight className={footerStyles.quickLinkIcon} />
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={footerStyles.linksSection}>
            <h3 className={footerStyles.sectionTitle}>Services</h3>
            <ul className={footerStyles.linksList}>
              {services.map((service) => (
                <li className={footerStyles.linkItem} key={service.name}>
                  <Link to={service.href} className={footerStyles.serviceLink}>
                    <span className={footerStyles.serviceIcon}></span>
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={footerStyles.newsletterSection}>
            <h3 className={footerStyles.newsletterTitle}>Stay Connected</h3>
            <p className={footerStyles.newsletterDescription}>
              Subscribe for health tips, medical updates, and wellness insights delivered to your inbox.
            </p>

            <div className={footerStyles.newsletterForm}>
              <div className={footerStyles.mobileNewsletterContainer}>
                <input type="email" placeholder="Enter your email" className={footerStyles.emailInput} />
                <button type="button" className={footerStyles.mobileSubscribeButton}>
                  <Send className={footerStyles.mobileButtonIcon} />
                  Subscribe
                </button>
              </div>

              <div className={footerStyles.desktopNewsletterContainer}>
                <input type="email" placeholder="Enter your email" className={footerStyles.desktopEmailInput} />
                <button type="button" className={footerStyles.desktopSubscribeButton}>
                  <Send className={footerStyles.desktopButtonIcon} />
                  <span className={footerStyles.desktopButtonText}>Subscribe</span>
                </button>
              </div>

              <div className={footerStyles.socialContainer}>
                {socialLinks.map(({ Icon, color, name, href }, index) => (
                  <a
                    aria-label={name}
                    className={footerStyles.socialLink}
                    href={href}
                    key={name}
                    rel="noopener noreferrer"
                    style={{ animationDelay: `${index * 120}ms` }}
                    target="_blank"
                  >
                    <div className={footerStyles.socialIconBackground}></div>
                    <Icon className={`${footerStyles.socialIcon} ${color}`} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={footerStyles.bottomSection}>
          <p className={footerStyles.copyright}>Copyright {currentYear} Medi-B. All rights reserved.</p>
          <p className={footerStyles.designerText}>
            Built with <Heart className="h-4 w-4 fill-orange-500 text-orange-500" /> by{' '}
            <a
              className={footerStyles.designerLink}
              href="https://www.linkedin.com/company/hexagondigtial-services/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Hexagon Digital Services
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
