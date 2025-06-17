import React from "react";
import Image from "next/image";

export default function InsuranceInfo({ id }) {
  const assessments = [
    {
      name: "PHQ-9",
      fullName: "Patient Health Questionnaire-9",
      description:
        "A nine-item depression scale that helps clinicians assess the severity of depression and monitor treatment response.",
      icon: "/psi.png",
      details:
        "Commonly used by healthcare providers to screen for clinical depression and determine the need for treatment. Insurance companies often require PHQ-9 scores to approve coverage for certain mental health services.",
    },
    {
      name: "GAD-7",
      fullName: "Generalized Anxiety Disorder-7",
      description:
        "A seven-item anxiety scale used to screen for and measure the severity of generalized anxiety disorder.",
      icon: "/psi.png",
      details:
        "This assessment helps identify anxiety disorders and determine appropriate treatment options. Many insurance providers request GAD-7 results to authorize anxiety-related treatment services.",
    },
    {
      name: "MDQ",
      fullName: "Mood Disorder Questionnaire",
      description:
        "A screening instrument for bipolar disorder that helps identify individuals who may need a more thorough diagnostic evaluation.",
      icon: "/psi.png",
      details:
        "The MDQ assists in identifying bipolar symptoms that might otherwise be misdiagnosed. Insurance plans often require this assessment before approving specialized treatments for mood disorders.",
    },
  ];

  return (
    <div id={id} className="py-16 bg-gray-50 mt-16">
      <div className="w-[80%] md:w-[70%] mx-auto">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-center">
          Insurance &amp; Assessments
        </h2>
        <p className="text-lg lg:text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          I work with various insurance providers and use standardized
          assessments to ensure you receive the appropriate care and coverage.
          These assessments help document the medical necessity of treatment for
          insurance purposes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {assessments.map((assessment, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 mr-4 relative">
                  <Image
                    src={assessment.icon}
                    alt={`${assessment.name} icon`}
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {assessment.name}
                  </h3>
                  <p className="text-sm text-gray-500">{assessment.fullName}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">
                {assessment.description}
              </p>

              <div className="mt-4 text-sm text-gray-600">
                <p className="leading-relaxed">{assessment.details}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white p-8 rounded-2xl border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Insurance Coverage
          </h3>
          <p className="text-gray-600 mb-4 text-lg leading-relaxed">
            I accept most major insurance plans, including Blue Cross Blue
            Shield, Aetna, Cigna, and United Healthcare. Prior to your first
            appointment, I recommend verifying your coverage for mental health
            services with your insurance provider.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            If you have questions about whether your insurance will cover our
            sessions or if you need assistance navigating the insurance process,
            please don&apos;t hesitate to contact me.
          </p>
        </div>
      </div>
    </div>
  );
}
