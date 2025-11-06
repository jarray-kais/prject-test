import React from 'react';

const InputField = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
}) => {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        className="form-control"
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;


