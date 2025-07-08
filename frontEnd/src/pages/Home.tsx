import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { EventCard } from "../content-folders/Home/EventsCard";
import App from "../content-folders/Home/HeroHomeSection";
import { PopularEvents } from "../content-folders/Home/PopularEvents";
import { VenueList } from "../content-folders/Home/Venue";


import { Fade } from "react-awesome-reveal"; // You can choose different effects here

export const Home = () => {
  return (
    <div>
      {/* Navbar usually doesn't need a scroll animation unless it's a special effect */}
      <Navbar />

      <Fade triggerOnce={true} cascade damping={0.1}>
        <App />
      </Fade>

      <EventCard/>

      {/* Venue List section with another fade-in, perhaps with a slight delay */}
      <Fade triggerOnce={true} delay={300}>
        <VenueList />
      </Fade>
      <PopularEvents/>
       <Footer/>
    </div>
   
  );
};