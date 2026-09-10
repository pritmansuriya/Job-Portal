const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">

        <div>
          <h2 className="text-2xl font-bold text-blue-400">
            JobPortal
          </h2>
          <p className="text-gray-400 mt-3">
            Find your dream job and connect with the best companies.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">For Job Seekers</h3>
          <p className="text-gray-400">Find Jobs</p>
          <p className="text-gray-400">Applications</p>
          <p className="text-gray-400">Saved Jobs</p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">For Employers</h3>
          <p className="text-gray-400">Post Jobs</p>
          <p className="text-gray-400">Find Candidates</p>
          <p className="text-gray-400">Manage Jobs</p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <p className="text-gray-400">support@jobportal.com</p>
          <p className="text-gray-400">+91 98765 43210</p>
        </div>

      </div>

      <div className="border-t border-gray-700 text-center py-5 text-gray-400">
        © 2026 JobPortal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;