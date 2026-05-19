import { useLocation } from "react-router-dom";

const WhatsAppButton = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href="https://wa.me/34649429678"
      rel="noopener"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
    >
      <svg
        viewBox="0 0 32 32"
        className="h-8 w-8"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.493-.42 2.722-1.318.13-.546.13-1.018.072-1.118-.058-.158-.301-.244-.659-.402-.36-.158-2.058-1.018-2.395-1.118-.103-.043-.215-.072-.314-.072m-3.137 7.066c-2.522 0-4.957-.74-7.07-2.13L4.46 23.65l1.49-4.418a12.59 12.59 0 0 1-2.45-7.46c0-6.96 5.69-12.61 12.69-12.61s12.69 5.65 12.69 12.61c0 6.99-5.69 12.61-12.69 12.61M16.04 0C7.7 0 .92 6.74.92 15.02c0 2.83.79 5.6 2.29 8L0 32l9.21-2.95a15.07 15.07 0 0 0 6.83 1.63c8.34 0 15.12-6.74 15.12-15.02C31.16 6.74 24.38 0 16.04 0" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;