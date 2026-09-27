interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export const InputComponent = ({ ...props }: Props) => {
  return <input {...props} />;
};
