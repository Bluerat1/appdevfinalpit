import { Link } from "react-router-dom"

function HomePage() {
  return (
    <div className="home__wrapper">
      <div className="container home-page__container">
        <h1 className="main__title animate-fade-slide">Power Monitor</h1>
        <p className="main__subtitle animate-fade-slide" style={{ animationDelay: "0.2s" }}>
          Track your energy consumption in real-time. Save money. Save the planet.
        </p>
        <div className="home__buttons animate-fade-slide" style={{ animationDelay: "0.4s" }}>
        <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage