interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, type = "submit", ...props }: Props) => {
  return (
    <button type={type} {...props}>
      {children}
    </button>
  );
};
