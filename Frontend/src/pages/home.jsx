import React from 'react'
import { Link } from 'react-router-dom'
import heroImage from '../assets/BannerImg.png'

const Home = () => {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-emerald-50 font-serif">
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-16">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Healthcare Solutions
          </p>
          <h1 className="text-4xl font-bold leading-tight text-emerald-950 sm:text-5xl lg:text-6xl">
            Book trusted care without the waiting room confusion.
          </h1>
          <p className="max-w-xl text-base leading-7 text-slate-700 sm:text-lg">
            Find doctors, explore hospital services, and manage appointments from one clear place.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/doctors"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Find Doctors
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center rounded-full border border-emerald-300 bg-white px-6 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              View Services
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl">
          <img
            src={heroImage}
            alt="Hospital care team"
            className="h-72 w-full object-cover sm:h-96 lg:h-[30rem]"
          />
        </div>
      </section>
    </main>
  )
}

export default Home
