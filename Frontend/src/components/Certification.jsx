import { Award, ShieldCheck } from 'lucide-react'
import { certificationStyles } from '../assets/dummyStyles'
import c1 from '../assets/C1.png'
import c2 from '../assets/C2.png'
import c3 from '../assets/C3.png'
import c4 from '../assets/C4.svg'
import c5 from '../assets/C5.png'
import c6 from '../assets/C6.png'
import c7 from '../assets/C7.svg'

const certifications = [
  { id: 1, name: 'Medical Commission', image: c1 },
  { id: 2, name: 'Government Approved', image: c2 },
  { id: 3, name: 'NABH Accredited', image: c3 },
  { id: 4, name: 'Medical Council', image: c4 },
  { id: 5, name: 'Quality Healthcare', image: c5 },
  { id: 6, name: 'Paramedical Council', image: c6 },
  { id: 7, name: 'Ministry of Health', image: c7 },
]

const Certification = () => {
  const marqueeItems = [...certifications, ...certifications, ...certifications]

  return (
    <section className={certificationStyles.container}>
      <style>{certificationStyles.animationStyles}</style>

      <div className={certificationStyles.backgroundGrid} aria-hidden="true">
        <div className={certificationStyles.topLine}></div>
        <div className={certificationStyles.gridContainer}>
          <div className={certificationStyles.grid}>
            {Array.from({ length: 48 }).map((_, index) => (
              <div className={certificationStyles.gridCell} key={index}></div>
            ))}
          </div>
        </div>
      </div>

      <div className={certificationStyles.contentWrapper}>
        <div className={certificationStyles.headingContainer}>
          <div className={certificationStyles.headingInner}>
            <span className={certificationStyles.leftLine}></span>
            <h2 className={certificationStyles.title}>
              Certified <span className={certificationStyles.titleText}>Healthcare Partners</span>
            </h2>
            <span className={certificationStyles.rightLine}></span>
          </div>
          <p className={certificationStyles.subtitle}>
            Our network works with recognized medical standards, verified specialists, and secure care practices.
          </p>
          <div className={certificationStyles.badgeContainer}>
            <span className={certificationStyles.badgeDot}></span>
            <ShieldCheck className="w-4 h-4 mr-2 text-amber-700" />
            <span className={certificationStyles.badgeText}>Accredited and trusted care ecosystem</span>
          </div>
        </div>

        <div className={certificationStyles.logosContainer}>
          <div className={certificationStyles.logosInner}>
            <div className={certificationStyles.logosFlexContainer}>
              <div className={certificationStyles.logosMarquee}>
                {marqueeItems.map((certification, index) => (
                  <div className={certificationStyles.logoItem} key={`${certification.name}-${index}`}>
                    <img
                      src={certification.image}
                      alt={certification.name}
                      className={certificationStyles.logoImage}
                      loading="lazy"
                    />
                    <span className={certificationStyles.logoText}>{certification.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-orange-800">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-4 py-2 shadow-sm">
            <Award className="w-4 h-4 text-orange-600" />
            Verified Quality
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-4 py-2 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            Secure Appointments
          </span>
        </div>
      </div>
    </section>
  )
}

export default Certification
