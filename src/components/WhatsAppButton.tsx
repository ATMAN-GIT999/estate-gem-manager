import { useLocation } from "react-router-dom";
import whatsappIcon from "@/assets/whatsapp-icon.webp";

const WhatsAppButton = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href="https://api.whatsapp.com/send?phone=34649429678"
      rel="noopener"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 block h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
    >
      <img src={whatsappIcon} alt="WhatsApp" className="h-full w-full rounded-full" />
    </a>
  );
};

export default WhatsAppButton;