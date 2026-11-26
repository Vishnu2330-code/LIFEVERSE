import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Smartphone, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#080B14] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-cyan-400 flex items-center justify-center text-slate-900 font-bold">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white font-heading">
            LIFE<span className="text-cyan-400">VERSE</span>
          </span>
          <span className="text-xs text-slate-400 ml-2">Turn Your Real Life Into an Adventure.</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          <Link to="/about" className="hover:text-slate-200 transition-colors">
            About
          </Link>
          <Link to="/features" className="hover:text-slate-200 transition-colors">
            Features
          </Link>
          <Link to="/challenges" className="hover:text-slate-200 transition-colors">
            Challenges
          </Link>
          <a
            href="http://localhost:5000/api/docs"
            target="_blank"
            rel="noreferrer"
            className="hover:text-cyan-400 transition-colors"
          >
            API Docs
          </a>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Smartphone className="w-3.5 h-3.5" />
            Android Ready
          </span>
        </div>

        <p className="text-xs text-slate-500">
          &copy; 2026 LIFEVERSE. Crafted with precision for high achievers.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
