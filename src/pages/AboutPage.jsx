import { Link } from 'react-router-dom'
import './AboutPage.css'

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-content">
        <div className="about-hero">
          <span className="about-wave">🌊</span>
          <h1>About NJ Coast</h1>
          <p className="about-lead">
            A curated map of the most scenic, wild, and beautiful places along
            the Cape May County shoreline — New Jersey's southernmost tip.
          </p>
        </div>

        <section className="about-section">
          <h2>What is this?</h2>
          <p>
            NJ Coast is a scenic locations finder for Cape May County, New
            Jersey. From the famous hawk watch at Cape May Point to the quiet
            marshes of Stone Harbor, this tool helps you discover where to go,
            what to look for, and why it matters.
          </p>
        </section>

        <section className="about-section">
          <h2>Why Cape May County?</h2>
          <p>
            Cape May County sits at the convergence of the Delaware Bay and the
            Atlantic Ocean, creating one of the most ecologically significant
            migration corridors in North America. It is home to world-class
            birding, pristine barrier island beaches, historic Victorian
            architecture, and salt marsh ecosystems that support coastal
            resilience.
          </p>
        </section>

        <section className="about-section">
          <h2>Location Categories</h2>
          <ul className="category-list">
            <li>
              <strong>🏖 Beaches</strong> — Ocean and bay beaches from Cape May
              to Sea Isle City
            </li>
            <li>
              <strong>🐦 Wildlife</strong> — Refuges, heronries, shorebird
              nesting areas
            </li>
            <li>
              <strong>🌿 Parks</strong> — State parks, dune trails, nature
              boardwalks
            </li>
            <li>
              <strong>🏛 Landmarks</strong> — Lighthouses, historic villages,
              cultural sites
            </li>
            <li>
              <strong>🔭 Nature Centers</strong> — Research institutes and
              educational facilities
            </li>
          </ul>
        </section>

        <div className="about-cta">
          <Link to="/" className="cta-btn">
            Open the Map →
          </Link>
        </div>
      </div>
    </div>
  )
}
