import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, CalendarCheck, ChevronDown, ChevronUp, Search, UserRoundX, X } from 'lucide-react'
import { doctorsPageStyles } from '../assets/dummyStyles'
import hd1 from '../assets/HD1.png'
import hd2 from '../assets/HD2.png'
import hd3 from '../assets/HD3.png'
import hd4 from '../assets/HD4.png'
import hd5 from '../assets/HD5.png'
import hd6 from '../assets/HD6.png'
import hd7 from '../assets/HD7.png'
import hd8 from '../assets/HD8.png'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const fallbackImages = [hd1, hd2, hd3, hd4, hd5, hd6, hd7, hd8]

const getItemsFromPayload = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.doctors)) return payload.doctors
  return []
}

const isDoctorAvailable = (doctor) => {
  if (typeof doctor.availability === 'string') {
    return doctor.availability.toLowerCase() === 'available'
  }

  if (typeof doctor.available === 'boolean') return doctor.available
  if (typeof doctor.availability === 'boolean') return doctor.availability

  return true
}

const normalizeDoctor = (doctor, index) => ({
  id: doctor._id || doctor.id || `doctor-${index}`,
  name: doctor.name || 'Unknown Doctor',
  specialization: doctor.specialization || 'General Physician',
  image: doctor.imageUrl || doctor.image || doctor.imageSmall || doctor.imageSrc || fallbackImages[index % fallbackImages.length],
  experience:
    doctor.experience || doctor.yearsOfExperience || doctor.experienceYears
      ? String(doctor.experience || doctor.yearsOfExperience || doctor.experienceYears)
      : '5+ Years',
  fee: doctor.fee ?? doctor.price ?? 0,
  available: isDoctorAvailable(doctor),
  raw: doctor,
})

const DoctorsPage = () => {
  const [allDoctors, setAllDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAll, setShowAll] = useState(false)

  const loadDoctors = useCallback(async (signal) => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_BASE}/api/doctors`, { signal })
      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(payload?.message || `Failed to load doctors (${response.status})`)
      }

      const normalized = getItemsFromPayload(payload).map(normalizeDoctor)
      setAllDoctors(normalized)
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Network error while loading doctors.')
        setAllDoctors([])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    loadDoctors(controller.signal)

    return () => controller.abort()
  }, [loadDoctors])

  const filteredDoctors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return allDoctors

    return allDoctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(query) || doctor.specialization.toLowerCase().includes(query),
    )
  }, [allDoctors, searchTerm])

  const displayedDoctors = showAll ? filteredDoctors : filteredDoctors.slice(0, 8)

  const handleRetry = () => {
    loadDoctors()
  }

  return (
    <main className={doctorsPageStyles.mainContainer}>
      <div className={doctorsPageStyles.backgroundShape1} aria-hidden="true"></div>
      <div className={doctorsPageStyles.backgroundShape2} aria-hidden="true"></div>

      <div className={doctorsPageStyles.wrapper}>
        <header className={doctorsPageStyles.headerContainer}>
          <h1 className={doctorsPageStyles.headerTitle}>Find Your Doctor</h1>
          <p className={doctorsPageStyles.headerSubtitle}>
            Search verified specialists, check availability, and book the right appointment for your care.
          </p>
        </header>

        <div className={doctorsPageStyles.searchContainer}>
          <div className={doctorsPageStyles.searchWrapper}>
            <Search className={doctorsPageStyles.searchIcon} />
            <input
              aria-label="Search doctors"
              className={doctorsPageStyles.searchInput}
              onChange={(event) => {
                setSearchTerm(event.target.value)
                setShowAll(false)
              }}
              placeholder="Search by doctor name or specialization"
              type="search"
              value={searchTerm}
            />
            {searchTerm && (
              <button
                aria-label="Clear search"
                className={doctorsPageStyles.clearButton}
                onClick={() => setSearchTerm('')}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className={doctorsPageStyles.errorContainer}>
            <p className={doctorsPageStyles.errorText}>{error}</p>
            <button className={doctorsPageStyles.retryButton} onClick={handleRetry} type="button">
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className={doctorsPageStyles.skeletonGrid}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div className={doctorsPageStyles.skeletonCard} key={index}>
                <div className={doctorsPageStyles.skeletonImage}></div>
                <div className={doctorsPageStyles.skeletonName}></div>
                <div className={doctorsPageStyles.skeletonSpecialization}></div>
                <div className={doctorsPageStyles.skeletonButton}></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <section className={doctorsPageStyles.doctorsGrid}>
              {displayedDoctors.map((doctor) => (
                <article
                  className={`${doctorsPageStyles.doctorCard} ${
                    doctor.available ? '' : doctorsPageStyles.doctorCardUnavailable
                  }`}
                  key={doctor.id}
                >
                  {doctor.available ? (
                    <Link
                      className={doctorsPageStyles.focusRing}
                      state={{ doctor: doctor.raw || doctor }}
                      to={`/doctors/${doctor.id}`}
                    >
                      <div className={doctorsPageStyles.imageContainer}>
                        <img
                          alt={doctor.name}
                          className={doctorsPageStyles.doctorImage}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.onerror = null
                            event.currentTarget.src = fallbackImages[0]
                          }}
                          src={doctor.image}
                        />
                      </div>
                    </Link>
                  ) : (
                    <div
                      className={`${doctorsPageStyles.imageContainer} ${doctorsPageStyles.imageContainerUnavailable}`}
                    >
                      <img
                        alt={doctor.name}
                        className={doctorsPageStyles.doctorImageUnavailable}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.onerror = null
                          event.currentTarget.src = fallbackImages[0]
                        }}
                        src={doctor.image}
                      />
                    </div>
                  )}

                  <h2 className={doctorsPageStyles.doctorName}>{doctor.name}</h2>
                  <p className={doctorsPageStyles.doctorSpecialization}>{doctor.specialization}</p>

                  <div className={doctorsPageStyles.experienceBadge}>
                    <BadgeCheck className={doctorsPageStyles.experienceIcon} />
                    {doctor.experience}
                  </div>

                  {doctor.available ? (
                    <Link
                      className={`${doctorsPageStyles.bookButton} ${doctorsPageStyles.focusRing}`}
                      state={{ doctor: doctor.raw || doctor }}
                      to={`/doctors/${doctor.id}`}
                    >
                      <CalendarCheck className={doctorsPageStyles.bookButtonIcon} />
                      Book Appointment
                    </Link>
                  ) : (
                    <button className={doctorsPageStyles.notAvailableButton} disabled type="button">
                      <UserRoundX className={doctorsPageStyles.notAvailableIcon} />
                      Not Available
                    </button>
                  )}
                </article>
              ))}

              {displayedDoctors.length === 0 && (
                <p className={doctorsPageStyles.noResults}>No doctors found for your search.</p>
              )}
            </section>

            {filteredDoctors.length > 8 && (
              <div className={doctorsPageStyles.showMoreContainer}>
                <button
                  className={doctorsPageStyles.showMoreButton}
                  onClick={() => setShowAll((value) => !value)}
                  type="button"
                >
                  {showAll ? (
                    <>
                      <ChevronUp className={doctorsPageStyles.showMoreIcon} />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className={doctorsPageStyles.showMoreIcon} />
                      Show More
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.9s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.9s ease-out both; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }

        @media (max-width: 420px) {
          .max-w-7xl { padding-left: 10px; padding-right: 10px; }
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </main>
  )
}

export default DoctorsPage
