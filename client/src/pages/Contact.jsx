import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <h1 className="text-4xl font-black tracking-tight text-[#132238]">Contact Us</h1>
        <p className="mt-4 text-slate-600">We’d love to hear from you.</p>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-4 text-slate-700">
            <p><strong>Email:</strong> prit@jobportal.com</p>
            <p><strong>Phone:</strong> +91 6352415263</p>
            <p><strong>Address:</strong> 24 Career Avenue, Bengaluru, India</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
