export default function About({ id }) {
  return (
    <div id={id} className="min-h-screen bg-slate-400 py-20">
      <div className="w-[80%] md:w-[50%] mx-auto">
        <h2 className="text-7xl my-14 text-white">About me</h2>

        <div className="space-y-8 text-lg text-white ">
          <p>
            Jason Versace earned his Master&apos;s degree in Mental Health
            Counseling from Argosy University. After completing his graduate
            program, he worked as an addiction counselor and behavior specialist
            in various in-patient and out-patient settings. He later developed
            and implemented daily parenting seminars for a University of
            Illinois program focused on supporting teenage mothers. The
            initiative aimed to help young women continue their education while
            gaining practical, career-oriented skills.
          </p>

          <p>
            He specializes in addictions and sex therapy and is highly
            experienced in Cognitive Behavioral Therapy (CBT). Jason is a
            solution-focused, compassionate, and empathetic professional with a
            strong commitment to developing effective treatment plans for
            children, adolescents, and adults. He brings a natural ability to
            advocate for clients, navigate complex personalities, de-escalate
            challenging situations, and address issues with proactive solutions.
            His expertise extends across individual, couples, family, and group
            therapy.
          </p>

          <p>
            Jason is a licensed psychotherapist and is currently pursuing his
            Ph.D. in Psychology. He has worked in the mental health field since
            2015.
          </p>
        </div>
      </div>
    </div>
  );
}
