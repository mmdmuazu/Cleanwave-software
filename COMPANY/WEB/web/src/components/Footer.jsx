import React from "react";
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-background border-t border-brand-primary/10 mt-12">
      <div className="container mx-auto px-4 py-10 grid md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-semibold text-brand-text">Cleanwave SIH</h4>
          <p className="text-sm text-brand-text/70 mt-2">
            Cleanwave Sustainability & Innovation Hub (SIH) is a pioneering
            climate-focused hub based in Northern Nigeria.
          </p>
        </div>
        <div>
          <h5 className="font-semibold text-brand-text">Contact</h5>
          <p className="text-sm text-brand-text/70 mt-2">
            Email: cleanwavenigltd@gmail.com
          </p>
          <p className="text-sm text-brand-text/70">Phone: 09032279037</p>
          <p className="text-sm text-brand-text/70">Location: Kano, Nigeria</p>
        </div>
        <div>
          <h5 className="font-semibold text-brand-text">Follow</h5>
          <div className="flex gap-3 mt-2 text-brand-text/70 hover:text-brand-primary transition-colors">
            <a
              href="#"
              aria-label="facebook"
              className="hover:text-brand-primary transition-colors"
            >
              <Facebook />
            </a>
            <a
              href="#"
              aria-label="twitter"
              className="hover:text-brand-primary transition-colors"
            >
              <Twitter />
            </a>
            <a
              href="#"
              aria-label="linkedin"
              className="hover:text-brand-primary transition-colors"
            >
              <Linkedin />
            </a>
            <a
              href="#"
              aria-label="email"
              className="hover:text-brand-primary transition-colors"
            >
              <Mail />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-brand-primary/10 bg-white py-4">
        <div className="container mx-auto px-4 text-sm text-brand-text/60">
          © {new Date().getFullYear()} Cleanwave Sustainability & Innovation Hub
          (SIH). All rights reserved.
        </div>
      </div>
    </footer>
  );
}
