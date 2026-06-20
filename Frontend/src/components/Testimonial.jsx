import { useEffect, useRef, useState } from 'react'
import { Star } from 'lucide-react'
import { testimonialStyles } from '../assets/dummyStyles'
import hd1 from '../assets/HD1.png'
import hd2 from '../assets/HD2.png'
import hd3 from '../assets/HD3.png'
import hd4 from '../assets/HD4.png'
import hd5 from '../assets/HD5.png'
import hd6 from '../assets/HD6.png'

const testimonials = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    role: 'Cardiologist',
    rating: 5,
    text: 'The appointment booking system is incredibly efficient. It saves me valuable time and helps me focus on patient care.',
    image: hd1,
    type: 'doctor',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Patient',
    rating: 5,
    text: 'Scheduling appointments has never been easier. The interface is intuitive and reminders are very helpful.',
    image: hd4,
    type: 'patient',
  },
  {
    id: 3,
    name: 'Dr. Robert Martinez',
    role: 'Pediatrician',
    rating: 4,
    text: 'This platform has streamlined our clinic operations significantly. Patient management is much more organized.',
    image: hd2,
    type: 'doctor',
  },
  {
    id: 4,
    name: 'Emily Williams',
    role: 'Patient',
    rating: 5,
    text: 'Booking appointments online 24/7 is a game-changer. The confirmation system gives me peace of mind.',
    image: hd5,
    type: 'patient',
  },
  {
    id: 5,
    name: 'Dr. Amanda Lee',
    role: 'Dermatologist',
    rating: 5,
    text: 'Excellent platform for managing appointments. Automated reminders reduce no-shows dramatically.',
    image: hd3,
    type: 'doctor',
  },
  {
    id: 6,
    name: 'David Thompson',
    role: 'Patient',
    rating: 5,
    text: 'The wait time has reduced significantly since using this platform. Very convenient and user-friendly.',
    image: hd6,
    type: 'patient',
  },
]

const renderStars = (rating) =>
  Array.from({ length: 5 }, (_, index) => (
    <span
      className={index < rating ? testimonialStyles.activeStar : testimonialStyles.inactiveStar}
      key={index}
    >
      <Star className={testimonialStyles.star} fill="currentColor" />
    </span>
  ))

const TestimonialCard = ({ testimonial, direction }) => (
  <div
    className={`${testimonialStyles.testimonialCard} ${
      direction === 'left' ? testimonialStyles.leftCardBorder : testimonialStyles.rightCardBorder
    }`}
  >
    <div className={testimonialStyles.cardContent}>
      <img src={testimonial.image} alt={testimonial.name} className={testimonialStyles.avatar} loading="lazy" />
      <div className={testimonialStyles.textContainer}>
        <div className={testimonialStyles.nameRoleContainer}>
          <div>
            <h4
              className={`${testimonialStyles.name} ${
                direction === 'left' ? testimonialStyles.leftName : testimonialStyles.rightName
              }`}
            >
              {testimonial.name}
            </h4>
            <p className={testimonialStyles.role}>{testimonial.role}</p>
          </div>
          <div className={testimonialStyles.starsContainer}>{renderStars(testimonial.rating)}</div>
        </div>

        <p className={testimonialStyles.quote}>"{testimonial.text}"</p>
        <div className={testimonialStyles.mobileStarsContainer}>{renderStars(testimonial.rating)}</div>
      </div>
    </div>
  </div>
)

const Testimonial = () => {
  const scrollRefLeft = useRef(null)
  const scrollRefRight = useRef(null)
  const [isPaused, setIsPaused] = useState(false)

  const leftTestimonials = testimonials.filter((testimonial) => testimonial.type === 'doctor')
  const rightTestimonials = testimonials.filter((testimonial) => testimonial.type === 'patient')
  const scrollingLeftTestimonials = [...leftTestimonials, ...leftTestimonials]
  const scrollingRightTestimonials = [...rightTestimonials, ...rightTestimonials]

  useEffect(() => {
    const scrollLeft = scrollRefLeft.current
    const scrollRight = scrollRefRight.current
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!scrollLeft || !scrollRight || prefersReducedMotion) return undefined

    const scrollSpeed = 0.5
    let rafId

    scrollRight.scrollTop = scrollRight.scrollHeight / 2

    const smoothScroll = () => {
      if (!isPaused) {
        scrollLeft.scrollTop += scrollSpeed
        scrollRight.scrollTop -= scrollSpeed

        if (scrollLeft.scrollTop >= scrollLeft.scrollHeight / 2) {
          scrollLeft.scrollTop = 0
        }

        if (scrollRight.scrollTop <= 0) {
          scrollRight.scrollTop = scrollRight.scrollHeight / 2
        }
      }

      rafId = requestAnimationFrame(smoothScroll)
    }

    rafId = requestAnimationFrame(smoothScroll)
    return () => cancelAnimationFrame(rafId)
  }, [isPaused])

  return (
    <section
      className={testimonialStyles.container}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <style>{testimonialStyles.animationStyles}</style>

      <div className={testimonialStyles.headerContainer}>
        <h2 className={testimonialStyles.title}>Trusted by Doctors and Patients</h2>
        <p className={testimonialStyles.subtitle}>
          Real experiences from medical professionals and patients who use Medi-B for smoother healthcare visits.
        </p>
      </div>

      <div className={testimonialStyles.grid}>
        <div className={`${testimonialStyles.columnContainer} ${testimonialStyles.leftColumnBorder}`}>
          <h3 className={`${testimonialStyles.columnHeader} ${testimonialStyles.leftColumnHeader}`}>
            Medical Professionals
          </h3>
          <div className={testimonialStyles.scrollContainer} ref={scrollRefLeft}>
            {scrollingLeftTestimonials.map((testimonial, index) => (
              <TestimonialCard
                testimonial={testimonial}
                direction="left"
                key={`${testimonial.id}-doctor-${index}`}
              />
            ))}
          </div>
        </div>

        <div className={`${testimonialStyles.columnContainer} ${testimonialStyles.rightColumnBorder}`}>
          <h3 className={`${testimonialStyles.columnHeader} ${testimonialStyles.rightColumnHeader}`}>Patients</h3>
          <div className={testimonialStyles.scrollContainer} ref={scrollRefRight}>
            {scrollingRightTestimonials.map((testimonial, index) => (
              <TestimonialCard
                testimonial={testimonial}
                direction="right"
                key={`${testimonial.id}-patient-${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonial
