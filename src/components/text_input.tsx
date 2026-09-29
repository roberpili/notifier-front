import type React from "react";
import "@/app/styles/text-input.css";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const TextInput = ({ label, id, ...props }: Props) => {
  return (
    <div className="text-input">
      <label htmlFor={id}>{label}</label>

      <input id={id} {...props} />
    </div>
  );
};
