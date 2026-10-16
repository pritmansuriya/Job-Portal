import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";

const Contact = ({ showLayout = true }) => {
  const contactMethods = [
    {
      title: "Email Us",
      value: "prit@jobportal.com",
      description: "Our support and recruiting teams are here to assist you.",
      icon: FiMail,
    },
    {
      title: "Call Us",
      value: "+91 6352415263",
      description: "Mon-Fri from 9:00 AM to 6:00 PM IST.",
      icon: FiPhone,
    },
    {
      title: "Visit Our Office",
      value: "24 Career Avenue, Bengaluru, India",
      description: "Come visit our main headquarters in the tech hub.",
      icon: FiMapPin,
    },
  ];

  return (
    <>
      {showLayout && <Navbar />}
      <section id="contact" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <h2 className="text-4xl font-black tracking-tight text-[#132238]">Contact Us</h2>
        <p className="mt-4 max-w-2xl text-slate-600">
          We’d love to hear from you. Have questions or want to partner with us? Reach out anytime.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0d9f9a] text-xl font-black text-white">
                  <Icon />
                </div>
                <h3 className="mt-5 text-xl font-bold text-[#132238]">{method.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{method.description}</p>
                <p className="mt-4 font-bold text-[#0d9f9a]">{method.value}</p>
              </div>
            );
          })}
        </div>
      </section>
      {showLayout && <Footer />}
    </>
  );
};

export default Contact;
