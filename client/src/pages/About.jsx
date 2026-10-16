import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiAward, FiCompass, FiTarget } from "react-icons/fi";

const About = ({ showLayout = true }) => {
  const values = [
    {
      title: "Mission",
      description: "Help people discover opportunities that match their skills and ambitious career goals.",
      icon: FiTarget,
    },
    {
      title: "Vision",
      description: "Build a more transparent, efficient, and growth-focused hiring experience for all.",
      icon: FiCompass,
    },
    {
      title: "Values",
      description: "Accessibility, trust, opportunity, and continuous learning across every interaction.",
      icon: FiAward,
    },
  ];

  return (
    <>
      {showLayout && <Navbar />}
      <section id="about" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <h2 className="text-4xl font-black tracking-tight text-[#132238]">About </h2>
        <p className="mt-4 max-w-4xl text-slate-600">
          JobPortal connects talented professionals with meaningful career opportunities across startups and top companies.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {values.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0d9f9a] text-xl font-black text-white">
                  <Icon />
                </div>
                <h3 className="mt-5 text-xl font-bold text-[#132238]">{item.title}</h3>
                <p className="mt-2 text-slate-500">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>
      {showLayout && <Footer />}
    </>
  );
};

export default About;
