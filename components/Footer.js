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
              <p>123 Main Street</p>
              <p>Houston, TX 77001</p>
              <p>Phone: (555) 123-4567</p>
              <p>Email: jason@versace.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/about"
                className="block text-slate-600 hover:text-slate-800"
              >
                About
              </Link>
              <Link
                href="/services"
                className="block text-slate-600 hover:text-slate-800"
              >
                Services
              </Link>
              <Link
                href="/appointments"
                className="block text-slate-600 hover:text-slate-800"
              >
                Book Appointment
              </Link>
              <Link
                href="/contact"
                className="block text-slate-600 hover:text-slate-800"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Office Hours</h3>
            <div className="space-y-2 text-slate-600">
              <p>Monday - Friday</p>
              <p>9:00 AM - 5:00 PM</p>
              <p>Saturday - Sunday</p>
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
