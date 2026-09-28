type InputProps = React.ComponentPropsWithoutRef<"input">;

export const InputComponent = ({ ...props }: InputProps) => {
  return <input {...props} />;
};
