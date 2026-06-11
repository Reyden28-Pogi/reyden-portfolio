import "./Pricing.css";

export default function Pricing({ data }) {
  const plans = data?.pricing || [];
  const contact = data?.contact || {};

  return (
    <section className="section pricing" id="pricing">
      <div className="container">
        <p className="section-label">Investment</p>
        <h2 className="section-title">Pricing & Services</h2>
        <div className="divider" />
        <p className="pricing__sub">
          Transparent, flexible rates for every stage of your project. All plans include direct communication and regular updates.
        </p>

        <div className="pricing__grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card ${plan.highlighted ? "pricing-card--highlight" : ""}`}
            >
              {plan.highlighted && (
                <div className="pricing-card__badge">Most Popular</div>
              )}
              <p className="pricing-card__tier">{plan.tier}</p>
              <div className="pricing-card__rate">
                <span className="pricing-card__amount">{plan.rate}</span>
                <span className="pricing-card__period">{plan.period}</span>
              </div>
              <p className="pricing-card__focus">{plan.focus}</p>
              <p className="pricing-card__desc">{plan.description}</p>

              <ul className="pricing-card__list">
                {plan.deliverables.map((item, i) => (
                  <li key={i}>
                    <span className="pricing-card__check">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href={contact.calendly
                  ? `https://calendly.com/${contact.calendly}`
                  : `mailto:${contact.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn ${plan.highlighted ? "btn-primary" : "btn-outline"} pricing-card__cta`}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>

        <div className="pricing__note">
          <p>💡 Rates are negotiable based on project scope and duration. <a href={`mailto:${contact.email}`}>Let's talk</a> about your specific needs.</p>
        </div>
      </div>
    </section>
  );
}
