interface Props {
  id: string;
  label: string;
  name: string;
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const CheckboxInput = ({
  id,
  label,
  name,
  checked,
  onChange,
}: Props) => (
  <div className="checkbox">
    <input
      id={id}
      name={name}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="checkbox-input"
    />
    <label htmlFor={id} className="checkbox-label">
      {label}
    </label>
  </div>
);
