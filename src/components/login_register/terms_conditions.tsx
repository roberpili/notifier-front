import Link from "next/link";
import "@/app/styles/terms.css";

interface CheckboxProps {
  name?: string;
  checked?: boolean;
  required?: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
}

export const TermsAndConditionsComponent = ({
  name,
  checked,
  required,
  onChange,
  className,
}: CheckboxProps) => {
  return (
    <label className="terms-checkbox">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        required={required}
        className={className}
        onChange={(e) => onChange?.(e.target.checked)}
      />

      <span>
        I accept the <Link href="/terms">Terms of Use</Link> and{" "}
        <Link href="/conditions">Privacy Policy</Link>
      </span>
    </label>
  );
};
