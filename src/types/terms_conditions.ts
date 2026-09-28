export interface CheckboxProps {
  name?: string;
  checked?: boolean;
  required?: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
}
