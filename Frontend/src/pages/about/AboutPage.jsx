import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="page-shell">
      <Navbar />

      <main className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-content">
            <span className="section-kicker">Our Story</span>
            <h1>Connecting You to the Heart of the Himalayas</h1>
            <p>
              NepalYatra was founded with a single mission: to make authentic, breathtaking Nepalese adventures accessible to everyone while supporting local communities.
            </p>
          </div>
        </section>

        {/* Vision Section */}
        <section className="about-vision flex-split">
          <div className="vision-text">
            <h2>Our Vision</h2>
            <p>We believe that travel is more than just visiting places; it's about the connections you make and the perspectives you gain. Our platform brings together highly vetted local agencies to offer you transparent, stunning itineraries without the hassle.</p>
            <p>Whether you're looking for a peaceful spiritual retreat in Kathmandu or a thrilling trek to Everest Base Camp, we are here to ensure your journey is seamless, safe, and unforgettable.</p>
          </div>
          <div className="vision-image">
            <img src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80" alt="Himalayan landscape" />
          </div>
        </section>

        {/* Values Grid */}
        <section className="about-values">
          <div className="section-heading-centered">
            <h2>What Drives Us</h2>
          </div>
          <div className="values-grid">
            <article className="value-card">
              <h3>Authenticity</h3>
              <p>We partner with pure local experts so you experience the true culture, food, and spirit of Nepal.</p>
            </article>
            <article className="value-card">
              <h3>Safety & Trust</h3>
              <p>Every itinerary and agency is rigorously checked to ensure your adventure is breathtaking, yet entirely secure.</p>
            </article>
            <article className="value-card">
              <h3>Sustainability</h3>
              <p>We are deeply committed to promoting eco-friendly travel practices that preserve these sacred mountains for generations to come.</p>
            </article>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <h2>Ready to pack your bags?</h2>
          <p>Join thousands of travelers who have already discovered the magic of Nepal.</p>
          <Link to="/packages" className="btn-cta">Explore Packages</Link>
        </section>
      </main>
    </div>
  );
}

export default AboutPage;
