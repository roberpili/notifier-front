interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: { credential?: string; select_by?: string }) => void;
  }) => void;

  renderButton: (
    parent: HTMLElement,
    options: {
      theme: "outline" | "filled_black";
      size: "large";
      width: string;
      locale: string;
      text: "signin_with" | "signup_with";
    },
  ) => void;
}

interface Window {
  google: {
    accounts: {
      id: GoogleAccountsId;
    };
  };
}
