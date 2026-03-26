function Alert({ type, message }) {
  if (!message) return null;

  const styles = {
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '16px',
    backgroundColor: type === 'error' ? '#fdecea' : '#edf7ed',
    color: type === 'error' ? '#c0392b' : '#276221',
    border: `1px solid ${type === 'error' ? '#f5c6c6' : '#b2dfdb'}`,
  };

  return <div style={styles}>{message}</div>;
}

export default Alert;
