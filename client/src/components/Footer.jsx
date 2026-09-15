const Footer = () => {
  return (
    <footer className="mt-20 bg-[#132238] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4 lg:px-8">

        <div>
          <h2 className="text-2xl font-black tracking-tight text-[#f6c453]">
            Job<span className="text-[#69d4cf]">Portal</span>
          </h2>
          <p className="mt-3 max-w-xs leading-7 text-slate-400">
            Find your dream job and connect with the best companies.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[#69d4cf]">For Job Seekers</h3>
          <p className="mb-2 text-slate-400 transition-colors hover:text-white">Find Jobs</p>
          <p className="mb-2 text-slate-400 transition-colors hover:text-white">Applications</p>
          <p className="text-slate-400 transition-colors hover:text-white">Saved Jobs</p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[#69d4cf]">For Employers</h3>
          <p className="mb-2 text-slate-400">Post Jobs</p>
          <p className="mb-2 text-slate-400">Find Candidates</p>
          <p className="text-slate-400">Manage Jobs</p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[#69d4cf]">Contact</h3>
          <p className="text-slate-400">support@jobportal.com</p>
          <p className="mt-2 text-slate-400">+91 98765 43210</p>
        </div>

      </div>

      <div className="border-t border-white/10 py-5 text-center text-sm text-slate-500">
        © 2026 JobPortal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;