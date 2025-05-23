function Botao({ children, onClick, tipo = "padrao" }) {
  const cores = {
    padrao: '#444',
    perigo: '#c0392b',
  };

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: cores[tipo],
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        marginTop: '0.5rem',
        marginRight: '0.5rem',
        borderRadius: '0.5rem',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

export default Botao;
