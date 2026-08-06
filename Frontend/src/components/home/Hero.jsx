import heroImage from "../../assets/images/church.jpg";

const Hero = () => {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#081B33]/75"></div>

      <div className="relative max-w-7xl mx-auto px-5 py-24 lg:py-0 min-h-screen flex items-center">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center w-full">

          {/* LEFT */}
          <div className="text-center lg:text-left">

            <span className="inline-block bg-blue-700/30 text-blue-200 px-3 py-2 rounded-full text-xs sm:text-sm">
              Welcome to Sauiti Nyikani Church
            </span>

            <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white leading-tight">
              Growing Together
              <br />
              In Christ
            </h1>

            <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-200 leading-7 max-w-xl mx-auto lg:mx-0">
              Join us as we worship God, strengthen our faith,
              and impact our community through the love of Jesus Christ.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

              <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold transition">
                Join Us
              </button>

              <button className="w-full sm:w-auto border border-blue-400 text-blue-200 hover:bg-blue-800 px-8 py-3 rounded-xl transition">
                Watch Sermons
              </button>

            </div>

          </div>

          {/* RIGHT CARD */}

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/20 max-w-md mx-auto w-full">

            <h2 className="text-xl lg:text-2xl font-bold text-white text-center">
              Weekly Services
            </h2>

            <div className="mt-6 space-y-5 text-center">

              <div>
                <h3 className="font-semibold text-white">
                  Sunday Worship
                </h3>

                <p className="text-slate-300 text-sm">
                  09:00 AM
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Wednesday Prayer
                </h3>

                <p className="text-slate-300 text-sm">
                  06:00 PM
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Friday Youth Fellowship
                </h3>

                <p className="text-slate-300 text-sm">
                  05:30 PM
                </p>
              </div>

            </div>

            <div className="mt-8 border-t border-white/20 pt-5">

              <p className="italic text-sm text-slate-300 text-center">
                "For where two or three gather in my name,
                there am I with them."
              </p>

              <p className="text-blue-300 text-center mt-3">
                Matthew 18:20
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;