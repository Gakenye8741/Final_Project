import '../../animations/TrueFocus.css';
import TrueFocus from '../../animations/TextFocus';
// import SplashCursor from '../../animations/SplashCursor';
import { useSelector } from 'react-redux';
import type { RootState } from '../../App/store';

const backgroundImage = "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1920&q=80";

function App() {
  const firstName = useSelector(
    (state: RootState) => state.auth.user?.firstName || 'UnKnown User'
  );

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 10) return "Good Morning";
    if (hour < 14) return "Good Afternoon";
    if (hour < 18) return "Good Evening";
    return "Hey";
  };

  const greeting = getTimeGreeting();

  return (
    <>
      {/* <SplashCursor /> */}

      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] overflow-hidden">
        
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />

        {/* Glass Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-10" />

        {/* Text and Animation Content */}
        <div className="relative z-20 text-center px-6">
          <TrueFocus
            sentence="TicketStream 🎫 Events And Ticketing Management System"
            manualMode={false}
            blurAmount={2}
            borderColor="cyan"
            animationDuration={2}
            pauseBetweenAnimations={2}
          />

          <div className="mt-12 bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20 max-w-xl mx-auto">
            <h1 className="text-5xl font-extrabold text-cyan-300 mb-6 drop-shadow">
              {greeting}, {firstName}
            </h1>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Welcome to <span className="text-accent font-semibold">TicketStream 🎫</span> — your ultimate platform for effortless event and ticketing management.
              <br /><br />
              Whether it’s a festival or a meetup, our tools help you sell tickets and promote your events like a pro.
            </p>
            <button className="btn bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-2 px-6 rounded-xl shadow-lg transition">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
