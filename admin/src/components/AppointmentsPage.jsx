import React, { useState, useEffect, useMemo } from 'react';
import { pageStyles, statusClasses, keyframesStyles } from '../assets/dummyStyles'
import {
  Users,
  Search,
  Calendar,
  Clock
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function formatDateISO(iso) {
  try {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return iso;
  }
}

function dateTimeFromSlot(slot) {
  try {
    const [y, m, d] = slot.date.split("-");
    const base = new Date(Number(y), Number(m) - 1, Number(d), 0, 0, 0, 0);

    const [time, ampm] = slot.time.split(" ");
    let [hh, mm] = time.split(":").map(Number);
    if (ampm === "PM" && hh !== 12) hh += 12;
    if (ampm === "AM" && hh === 12) hh = 0;
    base.setHours(hh, mm, 0, 0);
    return base;
  } catch (e) {
    return new Date(slot.date + "T00:00:00");
  }
}

const AppointmentPage = () => {
  const isAdmin = true;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterSpeciality, setFilterSpeciality] = useState("all");
  const [showAll, setShowAll] = useState(false);


  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const q = query.trim();
        const url = `${API_BASE}/api/appointments?limit=200${q ? `&search=${encodeURIComponent(q)}` : ""
          }`;
        const res = await fetch(url);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.message || `Failed to fetch (${res.status})`);
        }
        const data = await res.json();
        const items = (data?.appointments || []).map((a) => {
          const doctorName =
            (a.doctorId && a.doctorId.name) || a.doctorName || "";
          const speciality =
            (a.doctorId && a.doctorId.specialization) ||
            a.speciality ||
            a.specialization ||
            "General";
          const fee = typeof a.fees === "number" ? a.fees : a.fee || 0;
          return {
            id: a._id || a.id,
            patientName: a.patientName || "",
            age: a.age || "",
            gender: a.gender || "",
            mobile: a.mobile || "",
            doctorName,
            speciality,
            fee,
            slot: {
              date: a.date || (a.slot && a.slot.date) || "",
              time: a.time || (a.slot && a.slot.time) || "00:00 AM",
            },
            status: a.status || (a.payment && a.payment.status) || "Pending",
            raw: a, // keep original in case we need it
          };
        });
        setAppointments(items);
      } catch (err) {
        console.error("Load appointments error:", err);
        setError(err.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const specialities = useMemo(() => {
    const set = new Set(appointments.map((a) => a.speciality || "General"));
    return ["all", ...Array.from(set)];
  }, [appointments]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return appointments.filter((a) => {
      if (
        filterSpeciality !== "all" &&
        (a.speciality || "").toLowerCase() !== filterSpeciality.toLowerCase()
      )
        return false;
      if (filterDate && a.slot?.date !== filterDate) return false;
      if (!q) return true;
      return (
        (a.doctorName || "").toLowerCase().includes(q) ||
        (a.speciality || "").toLowerCase().includes(q) ||
        (a.patientName || "").toLowerCase().includes(q) ||
        (a.mobile || "").toLowerCase().includes(q)
      );
    });
  }, [appointments, query, filterDate, filterSpeciality]);

  const sortedFiltered = useMemo(() => {
    return filtered.slice().sort((a, b) => {
      const da = dateTimeFromSlot(a.slot).getTime();
      const db = dateTimeFromSlot(b.slot).getTime();
      return db - da;
    });
  }, [filtered]);

  const displayed = useMemo(
    () => (showAll ? sortedFiltered : sortedFiltered.slice(0, 8)),
    [sortedFiltered, showAll]
  );

  async function adminCancelAppointment(id) {
    const appt = appointments.find((x) => x.id === id);
    if (!appt) return;

    const statusLower = (appt.status || "").toLowerCase();
    const isCancelled =
      statusLower === "canceled" || statusLower === "cancelled";
    const isCompleted = statusLower === "completed";

    if (isCancelled || isCompleted) return;

    const ok = window.confirm(
      `As admin, mark appointment for ${appt.patientName} with ${appt.doctorName
      } on ${formatDateISO(appt.slot.date)} at ${appt.slot.time} as CANCELLED?`
    );
    if (!ok) return;

    try {
      setAppointments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "Canceled" } : p))
      );
      setShowAll(true);

      const res = await fetch(`${API_BASE}/api/appointments/${id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || `Cancel failed (${res.status})`);
      }
      const data = await res.json();
      const updated = data?.appointment || data?.appointments || null;
      if (updated) {
        setAppointments((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                ...p,
                status: updated.status || "Canceled",
                slot: {
                  date: updated.date || p.slot.date,
                  time: updated.time || p.slot.time,
                },
                raw: updated,
              }
              : p
          )
        );
      }
    } catch (err) {
      console.error("Cancel error:", err);
      setError(err.message || "Failed to cancel appointment");
      try {
        const reload = await fetch(`${API_BASE}/api/appointments?limit=200`);
        if (reload.ok) {
          const body = await reload.json();
          const items = (body?.appointments || []).map((a) => ({
            id: a._id || a.id,
            patientName: a.patientName || "",
            age: a.age || "",
            gender: a.gender || "",
            mobile: a.mobile || "",
            doctorName: (a.doctorId && a.doctorId.name) || a.doctorName || "",
            speciality:
              (a.doctorId && a.doctorId.specialization) ||
              a.speciality ||
              a.specialization ||
              "General",
            fee: typeof a.fees === "number" ? a.fees : a.fee || 0,
            slot: {
              date: a.date || (a.slot && a.slot.date) || "",
              time: a.time || (a.slot && a.slot.time) || "00:00 AM",
            },
            status: a.status || (a.payment && a.payment.status) || "Pending",
            raw: a,
          }));
          setAppointments(items);
        }
      } catch (e) {
      }
    }
  }

  return (
    <div className={pageStyles.container}>
      <style>{keyframesStyles}</style>

      <div className={pageStyles.maxWidthContainer}>
        <header className={pageStyles.headerContainer}>
          <div className={pageStyles.headerTitleSection}>
            <h1 className={pageStyles.headerTitle}>
              Appointments
            </h1>

            <p className={pageStyles.headerSubtitle}>
              Manage and search upcoming patient appointments
            </p>
          </div>

          <div className={pageStyles.headerControlsSection}>
            <div className="flex flex-col md:flex-row items-center gap-3 w-full sm:w-auto">
              <div className={pageStyles.searchContainer}>
                <Search size={16} className={pageStyles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search by doctor, patient, speciality, or mobile"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={pageStyles.searchInput}
                />
              </div>
              <div className={pageStyles.filterContainer}>
                <div className={pageStyles.dateFilter}>
                  <Calendar size={14} className={pageStyles.dateFilterIcon} />
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className={pageStyles.dateInput}
                  />
                </div>
                <select
                  value={filterSpeciality}
                  onChange={(e) => setFilterSpeciality(e.target.value)}
                  className={pageStyles.selectFilter}
                >
                  {specialities.map((s) => (
                    <option key={s} value={s}>
                      {s === "all" ? "All Specialities" : s}
                    </option>
                  ))}
                </select>
                {(query || filterDate || filterSpeciality !== "all") && (
                  <button
                    onClick={() => {
                      setQuery("");
                      setFilterDate("");
                      setFilterSpeciality("all");
                      setShowAll(false);
                      setError(null);
                    }}
                    className={pageStyles.clearButton}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

        </header>

        {loading ? (
          <div className={pageStyles.loadingErrorContainer}>
            <p className="animate-pulse">Loading appointments...</p>
          </div> 
        )
        : error ? (
          <div className={pageStyles.errorContainer}>{error}</div>
        ):sortedFiltered.length === 0 ? (
          <div className={pageStyles.noResultsContainer}>
            <p>No appointments found.</p>
          </div>
        ) :(       
          <main className={pageStyles.gridContainer}>
            {
             displayed.map((a, idx) => {
  const statusLower = (a.status || "").toLowerCase();
  const isCancelled =
    statusLower === "canceled" ||
    statusLower === "cancelled";

  const isCompleted =
    statusLower === "completed";

  const isDisabled =
    isCancelled || isCompleted;
              })}
              </main>
  )
        }

        {!loading && !error && displayed.length > 0 && (
          <div className={pageStyles.gridContainer}>
            {displayed.map((appt) => {
              const statusLower = (appt.status || "").toLowerCase();
              const isCancelled = statusLower === "canceled" || statusLower === "cancelled";
              const isCompleted = statusLower === "completed";
              const isDisabled = isCancelled || isCompleted;

              return (
                <div key={appt.id} className={pageStyles.card}>
                  <div className={pageStyles.cardHeader}>
                    <div>
                      <h3 className={pageStyles.cardTitle}>{appt.patientName}</h3>
                      <p className={pageStyles.patientInfo}>
                        {appt.age && <span>{appt.age} Yrs</span>}
                        {appt.gender && <span>• {appt.gender}</span>}
                      </p>
                      {appt.mobile && (
                        <p className={pageStyles.patientInfo + " mt-1"}>
                          <span>📞 {appt.mobile}</span>
                        </p>
                      )}
                    </div>
                    <span className={`${pageStyles.statusBadge} ${statusClasses(appt.status)}`}>
                      {appt.status}
                    </span>
                  </div>

                  <div className="border-t border-emerald-50 pt-2">
                    <p className={pageStyles.doctorInfo}>
                      Dr. <span className="font-semibold text-emerald-800">{appt.doctorName}</span>
                    </p>
                    <p className={`${pageStyles.doctorInfo} ${pageStyles.doctorSpeciality}`}>
                      {appt.speciality}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <div className={pageStyles.slotContainer}>
                      <Calendar size={14} className={pageStyles.slotIcon} />
                      <span>{formatDateISO(appt.slot.date)}</span>
                    </div>
                    <div className={pageStyles.slotContainer}>
                      <Clock size={14} className={pageStyles.slotIcon} />
                      <span>{appt.slot.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-emerald-50 pt-3 mt-auto">
                    <div>
                      <span className={pageStyles.feeLabel}>Fee</span>
                      <span className={pageStyles.feeAmount}>₹ {appt.fee}</span>
                    </div>

                    <button
                      onClick={() => adminCancelAppointment(appt.id)}
                      disabled={isDisabled}
                      className={pageStyles.cancelButton(isDisabled, isCompleted)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && sortedFiltered.length > displayed.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAll(true)}
              className={pageStyles.showMoreButton}
            >
              Show More ({sortedFiltered.length - displayed.length})
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentPage
