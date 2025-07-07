import { Navbar } from "../components/Navbar";
import App from "../content-folders/Home/HeroHomeSection";
import { UpcomingEvents } from "../content-folders/Home/UpcomingEvents";
import { VenueList } from "../content-folders/Home/Venue";

// Import the animation components you want to use
import { Fade, Slide } from "react-awesome-reveal"; // You can choose different effects here

export const Home = () => {
  return (
    <div>
      {/* Navbar usually doesn't need a scroll animation unless it's a special effect */}
      <Navbar />

      {/* Hero Section with a Fade-in animation */}
      <Fade triggerOnce={true} cascade damping={0.1}>
        <App />
      </Fade>

      {/* Upcoming Events section with a slide-up animation */}
      {/* triggerOnce={true} makes the animation play only once when it enters the viewport */}
      <Slide direction="up" triggerOnce={true}>
        <UpcomingEvents />
      </Slide>

      {/* Venue List section with another fade-in, perhaps with a slight delay */}
      <Fade triggerOnce={true} delay={300}>
        <VenueList />
      </Fade>
    </div>
  );
};