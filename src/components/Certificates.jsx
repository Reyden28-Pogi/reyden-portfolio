import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./Certificates.css";

export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    supabase.from("certificates").select("*").order("id", { ascending: false })
      .then(({ data }) => { setCerts(data || []); setLoading(false); });
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
              <CertCard key={cert.id} cert={cert} index={i} onView={setLightbox} />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="cert-lightbox" onClick={() => setLightbox(null)}>
          <div className="cert-lightbox__inner" onClick={(e) => e.stopPropagation()}>
            <button className="cert-lightbox__close" onClick={() => setLightbox(null)}>
              <i className="bx bx-x" />
            </button>
            {lightbox.image_url && (
              <img src={lightbox.image_url} alt={lightbox.title} className="cert-lightbox__img" />
            )}
            <div className="cert-lightbox__info">
              <p className="cert-lightbox__issuer">
                <i className="bx bx-buildings" /> {lightbox.issuer}
              </p>
              <h3 className="cert-lightbox__title">{lightbox.title}</h3>
              <p className="cert-lightbox__date">
                <i className="bx bx-calendar-check" /> {lightbox.date}
              </p>
              {lightbox.link && (
                <a href={lightbox.link} target="_blank" rel="noopener noreferrer" className="cert-lightbox__link">
                  <i className="bx bx-link-external" /> View Original
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function CertCard({ cert, index, onView }) {
  return (
    <div className="cert-card" style={{ animationDelay: `${index * 0.1}s` }} onClick={() => onView(cert)}>
      {/* Image or icon */}
      <div className="cert-card__image-wrap">
        {cert.image_url ? (
          <>
            <img src={cert.image_url} alt={cert.title} className="cert-card__image" />
            <div className="cert-card__overlay">
              <i className="bx bx-zoom-in" />
              <span>View Certificate</span>
            </div>
          </>
        ) : (
          <div className="cert-card__no-image">
            <i className="bx bxs-medal" />
          </div>
        )}
      </div>

      <div className="cert-card__body">
        <p className="cert-card__issuer">
          <i className="bx bx-buildings" /> {cert.issuer}
        </p>
        <h3 className="cert-card__title">{cert.title}</h3>
      </div>

      <div className="cert-card__footer">
        <span className="cert-card__date">
          <i className="bx bx-calendar-check" /> {cert.date}
        </span>
        <span className="cert-card__badge">
          <i className="bx bxs-check-shield" /> Verified
        </span>
      </div>
    </div>
  );
}