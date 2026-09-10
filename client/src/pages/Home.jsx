import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />

      <section className="bg-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Find Your
            <span className="text-blue-600"> Dream Job</span>
          </h1>

          <p className="mt-6 text-gray-600 text-lg max-w-2xl mx-auto">
<<<<<<< HEAD
            Discover thousands of job opportunities from top companies
            and take the next step in your career.
=======
           Explore thousands of career opportunities from leading companies and move closer to your dream job.
>>>>>>> feature/dashboards
          </p>

          <div className="bg-white shadow-lg rounded-xl p-4 mt-10 max-w-4xl mx-auto flex flex-col md:flex-row gap-3">

            <input
              type="text"
              placeholder="Job title or keyword"
              className="flex-1 border rounded-lg px-4 py-3 outline-none"
            />

            <input
              type="text"
              placeholder="Location"
              className="flex-1 border rounded-lg px-4 py-3 outline-none"
            />

            <Link
              to="/jobs"
              className="bg-blue-600 text-white px-7 py-3 rounded-lg"
            >
              Search Jobs
            </Link>

          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">

        <h2 className="text-3xl font-bold text-center">
          Why Choose JobPortal?
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <div className="bg-white p-8 rounded-xl border">
            <h3 className="text-xl font-semibold">
              Thousands of Jobs
            </h3>
            <p className="text-gray-500 mt-3">
              Find opportunities from companies around the world.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border">
            <h3 className="text-xl font-semibold">
              Easy Application
            </h3>
            <p className="text-gray-500 mt-3">
              Apply for your favorite jobs with just a few clicks.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border">
            <h3 className="text-xl font-semibold">
              Top Companies
            </h3>
            <p className="text-gray-500 mt-3">
              Connect with leading companies and recruiters.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;