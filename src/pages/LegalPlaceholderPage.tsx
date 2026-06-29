import { Link } from 'react-router-dom';

type LegalPlaceholderPageProps = {
  title: string;
};

function LegalPlaceholderPage({ title }: LegalPlaceholderPageProps) {
  return (
    <main className="lp-legal" aria-labelledby="lp-legal-title">
      <section className="lp-legal-card" aria-labelledby="lp-legal-title">
        <p className="lp-eyebrow">BioWatch</p>
        <h1 id="lp-legal-title">{title}</h1>
        <p className="lp-legal-text">
          Cette page sera disponible prochainement. Le contenu legal est en cours de redaction.
        </p>
        <Link to="/" className="lp-btn lp-btn-ghost">
          Retour a l'accueil
        </Link>
      </section>
    </main>
  );
}

export default LegalPlaceholderPage;
