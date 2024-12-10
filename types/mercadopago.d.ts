declare global {
  interface Window {
    MercadoPago: new (
      publicKey: string,
      options?: { locale: string }
    ) => {
      checkout: (options: {
        preference: {
          id: string;
        };
        render: {
          container: string;
          label: string;
          type?: 'wallet' | 'modal';
        };
      }) => void;
    };
  }
}

export {};