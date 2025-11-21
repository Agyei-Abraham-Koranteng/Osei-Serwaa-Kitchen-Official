import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[hsl(var(--footer-dark))] text-white border-t border-white/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="space-y-5">
            <h3 className="text-2xl font-bold gradient-text">Osei Serwaa Kitchen</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              Authentic Ghanaian cuisine prepared with love and traditional recipes passed down through generations.
            </p>
            <div className="flex items-center">
              <a
                href="https://www.tiktok.com/@osei.serwaa.kitch?_r=1&_t=ZM-917FbgHeYI4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 group"
                aria-label="Follow Osei Serwaa Kitchen on TikTok"
              >
                {/* Icon container: white circle so colored SVG is visible on dark footer */}
                <span className="inline-flex items-center justify-center bg-white rounded-full w-10 h-10 p-1 shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <img src="/tiktok.svg" alt="" aria-hidden="true" className="w-full h-full object-cover" />
                </span>

                {/* Visible accessible text */}
                <span className="text-sm font-medium text-white/90 group-hover:text-white">Follow us on TikTok</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-primary-foreground">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Menu', path: '/menu' },
                { name: 'About Us', path: '/about' },
                { name: 'Reservations', path: '/reservations' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm opacity-90 hover:opacity-100 hover:text-primary hover:translate-x-1 transition-all inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-foreground">Opening Hours</h3>
            <div className="space-y-2 text-sm opacity-90">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Monday - Friday</p>
                  <p>11:00 AM - 10:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Saturday - Sunday</p>
                  <p>10:00 AM - 11:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-foreground">Contact Us</h3>
            <div className="space-y-3 text-sm opacity-90">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>123 Liberation Road, Accra, Ghana</p>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>+233 24 750 5196</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>hello@oseiserwaa.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - modernized */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm opacity-90">
            <div className="text-white/90 text-center sm:text-left">
              <span className="font-medium">&copy; {new Date().getFullYear()} Osei Serwaa Kitchen.</span>
              <span className="hidden sm:inline ml-2">All rights reserved.</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-white/80 text-sm hidden sm:inline">Made with <span aria-hidden="true">♥</span> BY</span>
              <a
                href="https://www.facebook.com/profile.php?id=100082206290703"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md transition-colors"
              >
                <img src="/logo%20main.png" alt="AKA-TECH" className="h-5 w-5 rounded-sm object-cover" />
                <span className="text-sm font-semibold text-white/90">AKA-TECH</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
