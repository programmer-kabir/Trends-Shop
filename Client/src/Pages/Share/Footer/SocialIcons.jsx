import React from "react";
import { FaFacebook, FaLinkedin, FaWhatsapp, FaTwitter } from "react-icons/fa";

const SocialIcons = () => (
  <div className="flex items-center gap-4">
    <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
      <FaFacebook size={22} className="text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors" />
    </a>
    <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
      <FaLinkedin size={22} className="text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors" />
    </a>
    <a href="https://whatsapp.com" target="_blank" rel="noreferrer" aria-label="WhatsApp">
      <FaWhatsapp size={22} className="text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors" />
    </a>
    <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
      <FaTwitter size={22} className="text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors" />
    </a>
  </div>
);

export default SocialIcons;