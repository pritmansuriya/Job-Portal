import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Companies = () => {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <h1 className="text-4xl font-black tracking-tight text-[#132238]">Top Companies</h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Explore companies hiring across technology, design, marketing, finance, and operations.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            "Google",
            "Microsoft",
            "Amazon",
            "Meta",
            "Infosys",
            "TCS",
          ].map((company) => (
            <div key={company} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0d9f9a] font-black text-white">
                {company.charAt(0)}
              </div>
              <h2 className="mt-5 text-xl font-bold text-[#132238]">{company}</h2>
              <p className="mt-2 text-slate-500">Hiring across product, engineering, operations, and design roles.</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Companies;
