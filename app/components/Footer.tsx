import Image from "next/image";
import { FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#2C2C2C] to-[#F28C28] text-white py-6 px-6 flex flex-col md:flex-row justify-between items-center text-sm">
      <div className="flex items-center space-x-4">
        <Image src="/logo-pizzas-mibuen.png" alt="Pizzas Mi Buen Logo" width={60} height={60} className="rounded-full shadow-md" />
        <p className="text-center md:text-left">
          Ubicación: Av. Reforma 123, CDMX <br />
          Horario: Lunes a Sábado 9:00 AM - 8:00 PM
        </p>
      </div>
      <div className="flex space-x-4 mt-4 md:mt-0">
        {[FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaClock].map((Icon, index) => (
          <Icon key={index} className="text-white text-xl cursor-pointer transition-transform transform hover:scale-125 hover:text-[#FDEEDC]" />
        ))}
      </div>
      <p className="text-gray-300 mt-4 md:mt-0 text-center">Página creada por DATAtouille | © 2025 Todos los derechos reservados</p>
    </footer>
  );
};

export default Footer;

