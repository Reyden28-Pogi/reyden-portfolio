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
          <div className="certificates__empty">
            <p>Loading certificates...</p>
          </div>
        ) : certs.length === 0 ? (
          <div className="certificates__empty">
            <p>Certificates coming soon.</p>
          </div>
        ) : (
          <div className="certificates__grid">
            {certs.map((cert) => (
              <CertCard key={cert.id} cert={cert} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CertCard({ cert }) {
  return (
    <div className="cert-card">
      <div className="cert-card__icon">🏆</div>
      <div className="cert-card__body">
        <p className="cert-card__issuer">{cert.issuer}</p>
        <h3 className="cert-card__title">{cert.title}</h3>
        <p className="cert-card__date">{cert.date}</p>
      </div>
      {cert.link && (
        <a
          href={cert.link}
          target="_blank"
          rel="noopener noreferrer"
          className="cert-card__link"
        >
          View ↗
        </a>
      )}
    </div>
  );
}