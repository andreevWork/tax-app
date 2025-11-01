export const TaxChart = () => {
  return (
    <section
      className="tax-chart-container"
      style={{
        padding: '20px',
        borderRadius: '8px',
        background: '#cccccc',

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: '#aaaaaa',
          width: '200px',
          height: '200px',
          borderRadius: '100%',
        }}
      />
    </section>
  );
};
