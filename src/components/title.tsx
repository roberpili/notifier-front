interface Props {
  title?: string;
  className?: string;
}

export const TitleComponent = ({ title, className }: Props) => {
  return <h1 className={className}>{title}</h1>;
};
