import "./Certificates.css";

export default function Certificates({ data }) {
  const certs = data?.certificates || [];

  return (
    <section className="section certificates" id="certificates">
      <div className="container">
        <p className="section-label">Credentials</p>
        <h2 className="section-title">Certificates</h2>
        <div className="divider" />

        {certs.length === 0 || (certs.length === 1 && !certs[0].link && certs[0].title === "Certificate Title") ? (
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
