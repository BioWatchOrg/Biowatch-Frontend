import { type ComponentType, type SVGProps } from 'react';

export type FeatureCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  accent: string;
};

function FeatureCard({ icon: Icon, title, description, accent }: FeatureCardProps) {
  return (
    <article className="lp-card">
      <span className="lp-card-icon" style={{ color: accent, backgroundColor: `${accent}1f` }}>
        <Icon className="lp-card-icon-svg" />
      </span>
      <h3 className="lp-card-title">{title}</h3>
      <p className="lp-card-text">{description}</p>
    </article>
  );
}

export default FeatureCard;
