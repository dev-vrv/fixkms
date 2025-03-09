const SelectField = ({ name, options, onChange, value }) => {
  return (
    <select name={name} onChange={onChange} value={value} className="form-control">
      <option value="">Выберите значение</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default SelectField;
