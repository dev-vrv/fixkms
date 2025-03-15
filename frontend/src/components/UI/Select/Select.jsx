const SelectField = ({ name, options, onChange, value, className, labelText='Выберите значение' }) => {
  return (
    <select name={name} onChange={onChange} value={value} className={`form-control ${className}`}>
      <option value="">{labelText}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default SelectField;
