type Option = {
  label: string;
  value: string;
};

interface Props {
  id: string;
  label: string;
  name: string;
  value: string;
  options: Option[];
  required?: boolean;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}

export const SelectInput = ({
  id,
  label,
  name,
  value,
  options,
  required,
  onChange,
}: Props) => (
  <div className="select-input">
    <label htmlFor={id}>{label}</label>

    <select
      id={id}
      name={name}
      value={value}
      required={required}
      onChange={onChange}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
