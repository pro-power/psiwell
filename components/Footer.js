import Link from "next/link";

export default function Footer({ id }) {
  return (
    <footer
      id={id}
      className="flex items-center justify-center bg-gray-800 border-t border-gray-700 w-full"
    >
      <div className="py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-xl mb-6 text-white">Contact</h3>
            <div className="space-y-3 text-gray-300 text-lg leading-relaxed">
              <p>100 S. Ashley Drive, Suite 600</p>
              <p>Tampa, FL 33602</p>
              <p>Phone: (217) 417-2073</p>
              <p>Email: jasonversace1969@gmail.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-xl mb-6 text-white">Quick Links</h3>
            <div className="space-y-3">
              <a
                href="#about"
                className="block text-gray-300 hover:text-white text-lg transition-colors"
              >
                About
              </a>
              <a
                href="#calendar"
                className="block text-gray-300 hover:text-white text-lg transition-colors"
              >
                Book Appointment
              </a>
              <a
                href="#hero"
                className="block text-gray-300 hover:text-white text-lg transition-colors"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-bold text-xl mb-6 text-white">Office Hours</h3>
            <div className="space-y-3 text-gray-300 text-lg leading-relaxed">
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
        <div className="mt-16 pt-8 border-t border-gray-700 text-center text-gray-300 text-lg">
          <p>
            &copy; {new Date().getFullYear()} Jason Versace. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
