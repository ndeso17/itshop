import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Globe, Check } from "lucide-react";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "id", label: "Indonesia", flag: "🇮🇩" },
  { code: "kr", label: "한국어", flag: "🇰🇷" },
];

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentLang =
    languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        className="lang-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
      >
        <Globe size={18} />
        <span className="current-flag">{currentLang.flag}</span>
        <span className="current-code">{currentLang.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="lang-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`lang-option ${
                language === lang.code ? "active" : ""
              }`}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
            >
              <span className="lang-flag">{lang.flag}</span>
              <span className="lang-label">{lang.label}</span>
              {language === lang.code && (
                <Check size={14} className="check-icon" />
              )}
            </button>
          ))}
        </div>
      )}

      <style>{`
        .language-switcher {
          position: relative;
        }
        .lang-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid transparent;
          padding: 6px 10px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: var(--dark-gray, #333);
          transition: all 0.2s;
        }
        .lang-btn:hover {
          background: rgba(0,0,0,0.05);
        }
        .current-flag {
          font-size: 16px;
        }
        
        .lang-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          width: 160px;
          z-index: 1000;
          overflow: hidden;
          padding: 4px 0;
          border: 1px solid #efefef;
        }
        
        .lang-option {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 10px 16px;
          border: none;
          background: transparent;
          cursor: pointer;
          text-align: left;
          font-size: 14px;
          color: #333;
          transition: background 0.2s;
        }
        .lang-option:hover {
          background: #f5f5f5;
        }
        .lang-option.active {
          background: #f0f7ff;
          color: #0066cc;
          font-weight: 500;
        }
        .lang-flag {
          margin-right: 10px;
          font-size: 16px;
        }
        .lang-label {
          flex: 1;
        }
        .check-icon {
          color: #0066cc;
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;
