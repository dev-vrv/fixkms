const SelectInput = ({ name, options, onChange, className, defaultValue, defaultText }) => {
  if (defaultValue) {
    defaultText = defaultValue.toString().replace(/_/g, ' ');
  }
  else {
    defaultValue = '';
  }

  options = [...new Set(options)].filter((option) => option !== null && option !== '' && option !== defaultValue);

  return (
    <select name={name} onChange={onChange} defaultValue={defaultValue} className={`form-control ${className}`}>
      <option value={defaultValue}>{defaultText}</option>
      {options.map((option) => (
        <option key={`${option}-${name}`} value={option}>{option?.toString().replace(/_/g, ' ')}</option>
      ))}
    </select>
  );
};

export default SelectInput;
