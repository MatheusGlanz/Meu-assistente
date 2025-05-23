function Cartao({ children }) {
  return (
    <div style={{
      backgroundColor: '#2a2a2a',
      padding: '1.5rem',
      borderRadius: '1rem',
      marginBottom: '1.5rem',
      boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    }}>
      {children}
    </div>
  );
}

export default Cartao;
