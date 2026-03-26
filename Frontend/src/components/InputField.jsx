import './InputField.css';

function InputField({ label, id, type = 'text', value, onChange, placeholder, disabled, name }) {
  return (
    <div className="input-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name || id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={type === 'password' ? 'current-password' : 'off'}
      />
    </div>
  );
}

export default InputField;
