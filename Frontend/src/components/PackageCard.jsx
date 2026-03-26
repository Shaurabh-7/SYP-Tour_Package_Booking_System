import { Link } from 'react-router-dom';
import './PackageCard.css';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80';

function PackageCard({ packageItem, showAgency = false }) {
  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(packageItem.destination)}&z=13`;

  return (
    <article className="package-card">
      <img
        className="package-card-image"
        src={packageItem.imageUrl || FALLBACK_IMAGE}
        alt={packageItem.name}
        onError={(event) => {
          event.currentTarget.src = FALLBACK_IMAGE;
        }}
      />

      <div className="package-card-content">
        <div className="package-card-header">
          <p className="package-card-destination">{packageItem.destination}</p>
          <span className={`package-card-status ${packageItem.isActive === false ? 'is-muted' : ''}`}>
            {packageItem.isActive === false ? 'Inactive' : 'Available'}
          </span>
        </div>

        <h3>{packageItem.name}</h3>
        <p className="package-card-description">
          {packageItem.description || 'A curated Nepal travel package ready to personalize around your next trip.'}
        </p>

        <div className="package-card-meta">
          <span>NPR {Number(packageItem.price || 0).toLocaleString()}</span>
          <span>{packageItem.durationDays ? `${packageItem.durationDays} days` : 'Flexible plan'}</span>
        </div>

        {showAgency && packageItem.agency?.name ? <p className="package-card-agency">Hosted by {packageItem.agency.name}</p> : null}

        <div className="package-card-actions">
          <Link to={`/packages/${packageItem.id}`} className="package-card-link primary">
            Read More
          </Link>
          <a className="package-card-link secondary" href={mapUrl} target="_blank" rel="noreferrer">
            Show on Map
          </a>
        </div>
      </div>
    </article>
  );
}

export default PackageCard;
