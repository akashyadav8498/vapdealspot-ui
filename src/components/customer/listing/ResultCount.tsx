export const ResultCount = ({ count }: { count: number }) => {
  return (
    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
      {count === 1 ? '1 result' : `${count} results`}
    </div>
  );
};
