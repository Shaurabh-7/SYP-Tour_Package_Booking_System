import { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/Navbar';
import PackageCard from '../../components/PackageCard';
import { getPackages } from '../../api/packages';
import './PackagesPage.css';

function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadPackages() {
      try {
        const data = await getPackages();
        if (!ignore) {
          setPackages(data.data || []);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadPackages();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredPackages = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return packages;

    return packages.filter((packageItem) => {
      const haystack = `${packageItem.name} ${packageItem.destination} ${packageItem.description || ''}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [packages, search]);

  return (
    <div className="page-shell">
      <Navbar />

      <main className="packages-page">
        <section className="packages-hero">
          <p className="section-kicker">Destinations</p>
          <h1>Find Your Next Adventure</h1>
          <p>Explore our curated list of breathtaking destinations and expertly tailored itineraries across Nepal.</p>
        </section>

        <section className="packages-toolbar">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by package name, destination, or keyword"
          />
        </section>

        <section className="packages-grid-wrap">
          {loading ? <div className="page-status">Loading packages...</div> : null}
          {error ? <div className="page-status error">{error}</div> : null}

          {!loading && !error ? (
            <div className="package-grid">
              {filteredPackages.length ? (
                filteredPackages.map((packageItem) => <PackageCard key={packageItem.id} packageItem={packageItem} showAgency />)
              ) : (
                <div className="page-status">No packages matched your search.</div>
              )}
            </div>
          ) : null}
        </section>

        {/* Custom Itinerary Banner */}
        <section className="custom-itinerary-banner">
          <div className="custom-banner-content">
            <h2>Looking for something specific?</h2>
            <p>Our travel experts can help you design a custom itinerary tailored exactly to your needs and schedule.</p>
            <a href="/contact" className="btn-custom-plan">Request Custom Plan</a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PackagesPage;
