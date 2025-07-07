import '../../animations/TrueFocus.css';
import TrueFocus from '../../animations/TextFocus';
import SplashCursor from '../../animations/SplashCursor';
import background from "../../assets/drum-drums-musical-instrument-stage-wallpaper-preview.jpg"
import "./Home.scss"

function App() {
  return (
   <>
     <SplashCursor />

  
    {/* <CircularText
        text="Gakenye*Event*And*Ticketting*ManageMent*System*"
        onHover="speedUp"
        spinDuration={20}
        className="custom-class"
        /> */
    }
     
    <div
  className="hero min-h-screen"
  style={{
    backgroundImage: `url(${background})`,
  }}
>
  <div className="hero-overlay"><TrueFocus 
       sentence="TicketStream 🎫 Events And Ticketing Management System"
       manualMode={false}
       blurAmount={2}
       borderColor="lightgray"
       animationDuration={2}
       pauseBetweenAnimations={2}
    />
    </div>
  <div className="flex hero-content text-neutral-content text-center mt-50 ">
    <div className="max-w-md">
      <h1 className="mb-5 text-5xl font-bold">Hello there Gakenye</h1>
      <p className="mb-5">
        Welcome to TicketStream 🎫, your ultimate solution for seamless event and ticketing management!

        Whether you're organizing a small community gathering or a large-scale festival, TicketWise empowers you to effortlessly create, promote, and manage your events from start to finish. Our intuitive platform makes selling tickets a breeze, giving your attendees a smooth and secure purchasing experience.
      </p>
      <button className="btn btn-accent">Get Started</button>
    </div>
  </div>
</div>

   </>


  );
}

export default App;