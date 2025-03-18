const SelectInput = ({ name, options, onChange, className, defaultValue, disabled }) => {
  if (defaultValue) {
    defaultValue = defaultValue.toString().replace(/_/g, ' ');
  }
  else {
    defaultValue = '';
  }

  options = [...new Set(options)].filter((option) => option !== null && option !== '' && option !== defaultValue);
  
  return (
    <select name={name} onChange={onChange} defaultValue={!disabled ? defaultValue : ''} className={`form-control ${className} ${disabled ? 'disabled' : ''}`} disabled={disabled}>
      <option value="">Выберите значение</option>
      {defaultValue && !disabled ? <option value={defaultValue}>{defaultValue}</option> : null}

      {!disabled && options.map((option) => (
        <option key={`${option}-${name}`} value={option}>{option?.toString().replace(/_/g, ' ')}</option>
      ))}
    </select>
  );
};

export default SelectInput;
