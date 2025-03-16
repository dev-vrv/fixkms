const SelectInput = ({ name, options, onChange, className, defaultValue, defaultText, disabled }) => {
  if (defaultValue) {
    defaultText = defaultValue.toString().replace(/_/g, ' ');
  }
  else {
    defaultValue = '';
  }

  options = [...new Set(options)].filter((option) => option !== null && option !== '' && option !== defaultValue);
  
  if (disabled) {
    console.log()
  }

  return (
    <select name={name} onChange={onChange} defaultValue={!disabled ? defaultValue : ''} className={`form-control ${className} ${disabled ? 'disabled' : ''}`} disabled={disabled}>
      <option value={defaultValue}>{defaultText}</option>
      {!disabled && options.map((option) => (
        <option key={`${option}-${name}`} value={option}>{option?.toString().replace(/_/g, ' ')}</option>
      ))}
    </select>
  );
};

export default SelectInput;
