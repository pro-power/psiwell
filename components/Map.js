export default function Map({ id }) {
  return (
    <div className="w-full px-4 flex justify-center">
      <div
        id={id}
        className="w-full md:w-[50%] mb-16 bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden"
      >
        {/* Map Section - Fills Top */}
        <div className="w-full relative">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps?q=100+South+Ashley+Drive,+Suite+600,+Tampa,+FL+33602&output=embed"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full rounded-t-2xl"
          />
        </div>

        {/* Content Section - With Padding */}
        <div className="p-8 pt-8">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
            Office Location
          </h2>

          {/* Address and Business Hours - Left Aligned */}
          <p className="mb-6 text-gray-600 text-lg lg:text-xl leading-relaxed">
            <span className="font-semibold">Office address:</span> 100 South
            Ashley Drive, Suite 600, Tampa, FL 33602
          </p>

          <div className="text-gray-700 text-lg leading-relaxed mb-6">
            <span className="font-semibold text-gray-900">Business hours:</span>{" "}
            <div className="text-sm text-grey-700 space-y-1">
              <div>Monday: Closed</div>
              <div>Tuesday: 9:00 AM - 5:30 PM</div>
              <div>Wednesday: 6:00 PM - 10:00 PM</div>
              <div>Thursday: 9:00 AM - 5:30 PM</div>
              <div>Friday: 9:00 PM - 5:30 PM</div>
              <div>Saturday: 10:00 AM - 4:00 PM</div>
              <div>Sunday: Closed</div>
            </div>
          </div>

          {/* Get Directions Button - Bottom Right */}
          <div className="flex justify-end">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=100+South+Ashley+Drive,+Suite+600,+Tampa,+FL+33602"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
