import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <h1 className="text-4xl font-black tracking-tight text-[#132238]">About JobPortal</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          JobPortal connects talented professionals with meaningful career opportunities across startups and top companies.
          Our mission is to make career discovery simpler, more human, and more rewarding.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ["Mission", "Help people discover opportunities that match their skills and goals."],
            ["Vision", "Build a more transparent and growth-focused hiring experience."],
            ["Values", "Accessibility, trust, opportunity, and continuous learning."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#132238]">{title}</h2>
              <p className="mt-3 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default About;
