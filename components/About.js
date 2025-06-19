"use client";

export default function About({ id }) {
  return (
    <section id={id} className="w-full min-h-screen bg-slate-400 flex items-center justify-center mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            About Me
          </h2>
          <p className="text-xl text-slate-100 max-w-3xl mx-auto leading-relaxed">
            A compassionate, solution-focused therapist dedicated to helping individuals, 
            couples, and families achieve lasting wellness and positive change.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Professional Story */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              
              Professional Journey
            </h3>
            
            <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
              <p>
                Jason Versace earned his Master&rsquo;s degree in Mental Health Counseling from Argosy University. 
                Following his graduate studies, he gained extensive experience as an addiction counselor and 
                behavior specialist across various in-patient and out-patient settings.
              </p>
              
              <p>
                He later developed and implemented innovative daily parenting seminars for a University of 
                Illinois program, supporting teenage mothers in continuing their education while developing 
                practical, career-oriented skills. This initiative demonstrated his commitment to creating 
                comprehensive support systems for vulnerable populations.
              </p>
              
              <p>
                Jason is a solution-focused, compassionate, and empathetic professional with a proven track 
                record of developing effective treatment plans for clients across all age groups. He brings 
                natural advocacy skills, expertise in navigating complex personalities, and the ability to 
                de-escalate challenging situations with proactive, evidence-based solutions.
              </p>
              
              <p className="font-semibold text-gray-900 text-xl">
                Jason has dedicated nearly a decade to advancing mental health care 
                and continues his education through doctoral studies in Psychology.
              </p>
            </div>
          </div>

          {/* Experience Highlights */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white border border-white/20">
            <h3 className="text-2xl font-bold mb-8 text-center">Experience Highlights</h3>
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">9+</div>
                <div className="text-slate-200 text-sm">Years in Mental Health</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-slate-200 text-sm">Clients Served</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">All Ages</div>
                <div className="text-slate-200 text-sm">Children to Adults</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}