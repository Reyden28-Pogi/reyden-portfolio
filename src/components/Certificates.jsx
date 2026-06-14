import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./Certificates.css";

export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("id", { ascending: false });
      if (!error) setCerts(data || []);
      setLoading(false);
    };
    fetchCerts();
  }, []);

  return (
    <section className="section certificates" id="certificates">
      <div className="container">
        <p className="section-label">Credentials</p>
        <h2 className="section-title">Certificates</h2>
        <div className="divider" />

        {loading ? (
          <div className="certificates__loading">
            <i className="bx bx-loader-alt bx-spin" />
            <p>Loading certificates...</p>
          </div>
        ) : certs.length === 0 ? (
          <div className="certificates__empty">
            <i className="bx bx-certification" />
            <p>Certificates coming soon.</p>
          </div>
        ) : (
          <div className="certificates__grid">
            {certs.map((cert, i) => (
              <CertCard key={cert.id} cert={cert} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CertCard({ cert, index }) {
  return (
    <div className="cert-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="cert-card__header">
        <div className="cert-card__icon-wrap">
          <i className="bx bxs-medal" />
        </div>
        {cert.link && (
          <a
            href={cert.link}
            target="_blank"
            rel="noopener noreferrer"
            className="cert-card__view-btn"
            title="View Certificate"
          >
            <i className="bx bx-link-external" />
            View
          </a>
        )}
      </div>

      <div className="cert-card__body">
        <p className="cert-card__issuer">
          <i className="bx bx-buildings" />
          {cert.issuer}
        </p>
        <h3 className="cert-card__title">{cert.title}</h3>
      </div>

      <div className="cert-card__footer">
        <span className="cert-card__date">
          <i className="bx bx-calendar-check" />
          {cert.date}
        </span>
        <span className="cert-card__badge">
          <i className="bx bxs-check-shield" />
          Verified
        </span>
      </div>
    </div>
  );
}