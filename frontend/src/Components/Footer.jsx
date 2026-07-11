import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
        
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            ZazBlog<span className="text-indigo-500">.</span>
          </h2>
          <p className="text-sm mt-4 text-zinc-500 leading-relaxed">
            Perspectives and tutorials on building modern digital products.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 mb-4">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/saved-posts" className="hover:text-white transition-colors">Saved Posts</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 mb-4">Connect</h3>
          <p className="text-sm mb-4 text-zinc-500">
            Follow our digital exploration and latest updates.
          </p>
          <div className="flex space-x-5 text-xl">
            <a href="https://github.com/aitezazdev" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-indigo-400 transition-colors">
              <FaGithub />
            </a>
            <a href="https://linkedin.com/in/aitezaz-sikandar" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-indigo-400 transition-colors">
              <FaLinkedin />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-indigo-400 transition-colors">
              <FaFacebook />
            </a>
          </div>
        </div>

      </div>

      <div className="text-center text-xs py-6 border-t border-zinc-900 text-zinc-650">
        &copy; {new Date().getFullYear()} ZazBlog. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
