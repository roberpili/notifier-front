type StatusType = "success" | "error";

interface Props {
  message: string | null;
  type?: StatusType;
}

export const StatusMessageComponent = ({
  message,
  type = "success",
}: Props) => {
  if (!message) return null;

  return (
    <p
      className={`status-message status-message--${type}`}
      role={type === "error" ? "alert" : "status"}
    >
      {message}
    </p>
  );
};
