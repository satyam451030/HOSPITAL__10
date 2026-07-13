import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarCheck, Clock3, Stethoscope, UserCheck } from 'lucide-react'
import { homeDoctorsStyles } from '../assets/dummyStyles'
import hd1 from '../assets/HD1.png'
import hd2 from '../assets/HD2.png'
import hd3 from '../assets/HD3.png'
import hd4 from '../assets/HD4.png'

const fallbackDoctors = [
  {
    _id: 'fallback-1',
    name: 'Dr. Aisha Verma',
    specialization: 'Cardiologist',
    experience: '12 Years',
    availability: 'Available',
    imageUrl: hd1,
  },
  {
    _id: 'fallback-2',
    name: 'Dr. Rohit Mehra',
    specialization: 'Neurologist',
    experience: '10 Years',
    availability: 'Available',
    imageUrl: hd2,
  },
  {
    _id: 'fallback-3',
    name: 'Dr. Kavya Singh',
    specialization: 'Pediatrician',
    experience: '8 Years',
    availability: 'Available',
    imageUrl: hd3,
  },
  {
    _id: 'fallback-4',
    name: 'Dr. Arjun Kapoor',
    specialization: 'Orthopedic Surgeon',
    experience: '14 Years',
    availability: 'Unavailable',
    imageUrl: hd4,
  },
]

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://medi-b-backend.onrender.com'

const getDoctorsFromPayload = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.doctors)) return payload.doctors
  return []
}

const HomeDoctor = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const featuredDoctors = useMemo(() => {
    const source = doctors.length > 0 ? doctors : fallbackDoctors

    return source.slice(0, 4).map((doctor, index) => ({
      ...doctor,
      _id: doctor._id || doctor.id || `doctor-${index}`,
      imageUrl: doctor.imageUrl || fallbackDoctors[index % fallbackDoctors.length].imageUrl,
      specialization: doctor.specialization || 'General Physician',
      experience: doctor.experience || '5+ Years',
      availability: doctor.availability || 'Available',
    }))
  }, [doctors])

  const fetchDoctors = useCallback(async (signal) => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_BASE_URL}/api/doctors?limit=4`, {
        signal,
      })

      if (!response.ok) {
        throw new Error('Unable to load doctors right now.')
      }

      const payload = await response.json()
      setDoctors(getDoctorsFromPayload(payload))
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Showing featured doctors while live availability loads.')
        setDoctors([])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetchDoctors(controller.signal)

    return () => controller.abort()
  }, [fetchDoctors])

  return (
    <section className={homeDoctorsStyles.section}>
      <style>{homeDoctorsStyles.customCSS}</style>

      <div className={homeDoctorsStyles.container}>
        <div className={homeDoctorsStyles.header}>
          <h2 className={homeDoctorsStyles.title}>
            Meet Our <span className={homeDoctorsStyles.titleSpan}>Specialist Doctors</span>
          </h2>
          <p className={homeDoctorsStyles.subtitle}>
            Choose from trusted doctors with verified experience, clear availability, and simple appointment booking.
          </p>
        </div>

        {error && (
          <div className={homeDoctorsStyles.errorContainer}>
            <p className={homeDoctorsStyles.errorText}>{error}</p>
            <button type="button" onClick={() => fetchDoctors()} className={homeDoctorsStyles.retryButton}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className={homeDoctorsStyles.skeletonGrid}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div className={homeDoctorsStyles.skeletonCard} key={index}>
                <div className={homeDoctorsStyles.skeletonImage}></div>
                <div className={homeDoctorsStyles.skeletonText1}></div>
                <div className={homeDoctorsStyles.skeletonText2}></div>
                <div className={homeDoctorsStyles.skeletonButton}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className={homeDoctorsStyles.doctorsGrid}>
            {featuredDoctors.map((doctor) => {
              const isAvailable = doctor.availability === 'Available'

              return (
                <article className={homeDoctorsStyles.article} key={doctor._id}>
                  <div
                    className={
                      isAvailable
                        ? homeDoctorsStyles.imageContainerAvailable
                        : homeDoctorsStyles.imageContainerUnavailable
                    }
                  >
                    <img
                      src={doctor.imageUrl}
                      alt={doctor.name}
                      className={`${homeDoctorsStyles.image} ${isAvailable ? 'group-hover:scale-105' : ''}`}
                      loading="lazy"
                    />
                    {!isAvailable && <span className={homeDoctorsStyles.unavailableBadge}>Unavailable</span>}
                  </div>

                  <div className={homeDoctorsStyles.cardBody}>
                    <h3 className={homeDoctorsStyles.doctorName}>{doctor.name}</h3>
                    <p className={homeDoctorsStyles.specialization}>{doctor.specialization}</p>

                    <div className={homeDoctorsStyles.experienceContainer}>
                      <span className={homeDoctorsStyles.experienceBadge}>
                        <Clock3 className="h-4 w-4 text-orange-700" />
                        {doctor.experience}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700">
                        <UserCheck className="h-4 w-4" />
                        Verified
                      </span>
                    </div>

                    <div className={homeDoctorsStyles.buttonContainer}>
                      <button
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => navigate(`/doctors/${doctor._id}`)}
                        className={
                          isAvailable ? homeDoctorsStyles.buttonAvailable : homeDoctorsStyles.buttonUnavailable
                        }
                      >
                        {isAvailable ? (
                          <>
                            <CalendarCheck className="h-5 w-5" />
                            Book Appointment
                          </>
                        ) : (
                          <>
                            <Stethoscope className="h-5 w-5" />
                            Not Available
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default HomeDoctor
