type Stat = {
  id: string;
  value: string;
  label: string;
};

const STATS: readonly Stat[] = [
  { id: 'communities', value: '140+', label: 'Collectivites' },
  { id: 'zones', value: '12k', label: 'Zones analysees' },
  { id: 'frequency', value: '48h', label: 'Frequence de mise a jour' },
  { id: 'accuracy', value: '94%', label: 'Precision detection' },
];

function StatsSection() {
  return (
    <section className="lp-section lp-stats" aria-label="Chiffres cles">
      <div className="lp-container">
        <dl className="lp-stats-band">
          {STATS.map((stat) => (
            <div key={stat.id} className="lp-stat">
              <dt className="lp-stat-value">{stat.value}</dt>
              <dd className="lp-stat-label">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default StatsSection;
