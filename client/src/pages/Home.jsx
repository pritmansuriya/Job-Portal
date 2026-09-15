import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiArrowUpRight, FiBriefcase, FiMapPin, FiSearch, FiTrendingUp } from "react-icons/fi";
import heroImage from "../assets/jobs.jpg";

const Home = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (keyword.trim()) params.set("search", keyword.trim());
    if (location.trim()) params.set("location", location.trim());

    navigate(`/jobs${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <>
      <Navbar />

      <section className="relative isolate overflow-hidden bg-[#132238]">
        <img
          src={heroImage}
          alt="Technology team working in a digital workspace"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 -z-10 bg-[#132238]/80" />
        <div className="absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(rgba(105,212,207,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(105,212,207,.18)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="absolute -right-24 top-16 -z-10 h-80 w-80 rounded-full bg-[#0d9f9a]/30 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:py-28">

          <div>
            <p className="mb-6 text-sm font-black uppercase tracking-[0.3em] text-[#f6c453]">The next chapter starts here</p>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-white md:text-7xl">
              Find work that
              <span className="block text-[#69d4cf]">moves you forward.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              Explore thoughtful opportunities from ambitious companies and build a career with momentum.
            </p>

            <form onSubmit={handleSearch} className="mt-10 flex max-w-5xl flex-col gap-3 rounded-[1.75rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur-xl md:flex-row">

              <label className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white px-5 py-4">
                <FiSearch className="text-[#0d9f9a]" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Job title or keyword"
                  className="w-full bg-transparent text-[#132238] outline-none placeholder:text-slate-400"
                />
              </label>

              <label className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white px-5 py-4">
                <FiMapPin className="text-[#0d9f9a]" />
                <input
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Location"
                  className="w-full bg-transparent text-[#132238] outline-none placeholder:text-slate-400"
                />
              </label>

              <button type="submit" className="rounded-2xl bg-[#f6c453] px-8 py-4 font-black text-[#132238] transition-all hover:-translate-y-1 hover:bg-[#ffd975] hover:shadow-[5px_5px_0_#0d9f9a]">
                Search Jobs
              </button>

            </form>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-5 rounded-[3rem] border border-[#69d4cf]/20 bg-[#0d9f9a]/10 blur-sm" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/10 p-8 backdrop-blur-xl">
              <div className="flex items-center justify-between text-sm font-bold text-slate-300">
                <span>Career momentum</span>
                <FiTrendingUp className="text-[#f6c453]" />
              </div>
              <div className="relative my-6 flex h-64 flex-col justify-end overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#132238]/35 p-6">
                <img
                  src={heroImage}
                  alt="People collaborating in a technology workspace"
                  className="absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#132238]/55" />
                <div className="relative">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#69d4cf]">Your next opportunity</p>
                <p className="mt-3 max-w-xs text-2xl font-black leading-tight text-white">Make the move that changes your trajectory.</p>
                </div>
              </div>
              <div className="flex items-end justify-between border-t border-white/10 pt-5">
                <div>
                  <p className="text-3xl font-black text-white">7+</p>
                  <p className="text-sm text-slate-400">fresh roles live now</p>
                </div>
                <FiBriefcase className="text-3xl text-[#69d4cf]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

        <h2 className="text-center text-3xl font-black tracking-tight text-[#132238] md:text-4xl">
          Built for the bold next move.
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">

          <div className="group rounded-[1.5rem] border border-slate-200 bg-white p-8 transition-all hover:-translate-y-2 hover:border-[#f6c453] hover:shadow-[8px_8px_0_#f6c453]">
            <span className="text-4xl font-black text-[#0d9f9a]">01</span>
            <h3 className="mt-8 text-xl font-black text-[#132238]">
              Thousands of Jobs
            </h3>
            <p className="mt-3 leading-7 text-slate-500">
              Find opportunities from companies around the world.
            </p>
          </div>

          <div className="group rounded-[1.5rem] border border-slate-200 bg-white p-8 transition-all hover:-translate-y-2 hover:border-[#69d4cf] hover:shadow-[8px_8px_0_#69d4cf]">
            <span className="text-4xl font-black text-[#0d9f9a]">02</span>
            <h3 className="mt-8 text-xl font-black text-[#132238]">
              Easy Application
            </h3>
            <p className="mt-3 leading-7 text-slate-500">
              Apply for your favorite jobs with just a few clicks.
            </p>
          </div>

          <div className="group rounded-[1.5rem] border border-slate-200 bg-white p-8 transition-all hover:-translate-y-2 hover:border-[#f6c453] hover:shadow-[8px_8px_0_#f6c453]">
            <span className="text-4xl font-black text-[#0d9f9a]">03</span>
            <h3 className="mt-8 text-xl font-black text-[#132238]">
              Top Companies
            </h3>
            <p className="mt-3 leading-7 text-slate-500">
              Connect with leading companies and recruiters.
            </p>
          </div>

        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-[#0d9f9a] p-8 text-white shadow-[8px_8px_0_#f6c453] md:flex-row md:items-center md:p-10">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#d8fffb]">For ambitious teams</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">Ready to find your next great hire?</h2>
          </div>
          <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-[#132238] px-6 py-3 font-black text-white transition hover:bg-[#f6c453] hover:text-[#132238]">
            Post a role <FiArrowUpRight />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;