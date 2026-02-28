import styles from './TaxChart.module.css';

interface ResultRowProps {
  label: string;
  value: string;
  highlighted?: boolean;
}

export function ResultRow({
  label,
  value,
  highlighted = false,
}: ResultRowProps): React.JSX.Element {
  return (
    <li className={highlighted ? styles.highlighted : undefined}>
      <span>{label}</span>
      <span>{value}</span>
    </li>
  );
}
