
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto pt-8 pb-6 w-full animate-fade-in">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-6">
          <div className="mb-4 md:mb-0">
            <a 
              href="https://www.tradepulsetoken.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white font-semibold hover:text-white/80 transition-colors"
            >
              TraderPulse Token
            </a>
            <p className="text-white/50 text-sm mt-1">
              Claim 100 TPT daily with World ID verification
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
            <a 
              href="#" 
              className="text-white/70 hover:text-white transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="text-white/70 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="https://worldcoin.org" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white/70 hover:text-white transition-colors"
            >
              Worldcoin
            </a>
          </div>
        </div>
        
        <div className="text-center text-white/50 text-xs mt-6">
          &copy; {new Date().getFullYear()} TraderPulse Token. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
