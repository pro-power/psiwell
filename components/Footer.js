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
              <p>Phone: (813) 647-4654</p>
              <p>Email: jason@psiwellnessinc.com</p>
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
                Monday: Closed
                <br />
                Tuesday: 9:00 AM – 5:30 PM
                <br />
                Wednesday: 6:00 PM – 10:00 PM
                <br />
                Thursday: 9:00 PM – 5:30 PM
                <br />
                Friday: 9:00 PM – 5:30 PM
                <br />
                Saturday: 10:00 PM – 4:00 PM
                <br />
                Sunday: Closed
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
