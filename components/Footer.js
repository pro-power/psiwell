import Link from "next/link";

export default function Footer({ id }) {
  return (
    <footer
      id={id}
      className="flex items-center justify-center bg-slate-400 border-t-8 w-[100%] border-slate-500"
    >
      <div className=" py-16 px-4">
        <div className="grid grid-cols-3 gap-16">
          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-2 text-slate-600">
              <p>100 S. Ashley Drive, Suite 600</p>
              <p>Tampa, FL 33602</p>
              <p>Phone: (217) 417-2073</p>
              <p>Email: jasonversace1969@gmail.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="#about" className="block text-slate-600 hover:text-slate-800">About</a>
              <a href="#calendar" className="block text-slate-600 hover:text-slate-800">Book Appointment</a>
              <a href="#hero" className="block text-slate-600 hover:text-slate-800">Contact</a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Office Hours</h3>
            <div className="space-y-2 text-slate-600">
              <p>Monday &amp; Tuesday</p>
              <p>9:00 AM – 5:00 PM</p>
              <p>Wednesday</p>
              <p>6:00 PM – 10:00 PM</p>
              <p>Thursday &amp; Friday</p>
              <p>9:00 AM – 5:00 PM</p>
              <p>Saturday &amp; Sunday</p>
              <p>Closed</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-600">
          <p>
            &copy; {new Date().getFullYear()} Jason Versace. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
