import React from "react";
import Image from "next/image";

export default function Rating({ id }) {
  // Sample review data
  const reviews = [
    {
      name: "David Lephilia",
      location: "Arlington, VA",
      rating: 5,
      review: "Nothing, nothing helps you sleep better than this mattress.",
      longReview:
        "From the start I was a little skeptical, but a very good friend recommended Casper. So my wife and I talked and decided to give it a chance. After all, with the 100-night trial, we had nothing to lose...",
      model: "The Casper Mattress",
      image: "/man.png",
    },
    {
      name: "Paul",
      location: "Dubuque, IA",
      rating: 4,
      review: "The best mattress I've ever slept on, no kidding!",
      longReview:
        "From the delivery of the box to the magical unfolding of the king size mattress to the first time laying on the bed, all smiles from start to finish. Unpacked quickly and easily...",
      model: "The Casper Mattress",
      image: "/man.png",
    },
    {
      name: "Colleen Barnes",
      location: "Salt Lake City, UT",
      rating: 5,
      review: "My sleep is like WHOA.",
      longReview:
        "As a skeptic, I am surprised to say that the advertisements were correct for me - the mattress provides support and blog back where we all need it, for! This mattress is a high quality, and I'm kind of...",
      model: "The Casper Mattress",
      image: "/woman.png",
    },
  ];

  return (
    <div id={id} className="mt-20 py-16 bg-slate-50">
      <div className="w-[70%] mx-auto">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">
          Client Reviews & Testimonials
        </h2>
        <p className="text-gray-600 text-center mb-12">
          Read what our clients have to say about their experiences and the
          positive impact of our therapeutic approaches.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 mr-3 relative rounded-full overflow-hidden">
                  <Image
                    src={review.image}
                    alt={`${review.name} profile picture`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {review.name}{" "}
                    {review.name === "David Lephilia" ||
                    review.name === "Colleen Barnes" ? (
                      <span className="inline-block ml-1 text-blue-500">✓</span>
                    ) : null}
                  </h3>
                  <p className="text-sm text-gray-600">{review.location}</p>
                </div>
              </div>

              <div className="flex mb-3">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
              </div>

              <p className="text-gray-800 mb-4">{review.longReview}</p>

              <div className="mt-4 border-t pt-3">
                <p className="text-xs text-gray-500">
                  Review of your model | {review.model}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
