import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const flags = {
    en: "🇺🇸",
    id: "🇮🇩",
    ko: "🇰🇷",
  };

  const labels = {
    en: "English",
    id: "Indonesia",
    ko: "한국어",
  };

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

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        className="lang-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
      >
        <span className="lang-flag">{flags[i18n.language] || "🌐"}</span>
        <ChevronDown size={14} className={`chevron ${isOpen ? "open" : ""}`} />
      </button>

      {isOpen && (
        <div className="lang-dropdown fade-in">
          {Object.keys(flags).map((langKey) => (
            <button
              key={langKey}
              className={`lang-option ${
                i18n.language === langKey ? "active" : ""
              }`}
              onClick={() => changeLanguage(langKey)}
            >
              <span className="option-flag">{flags[langKey]}</span>{" "}
              {labels[langKey]}
            </button>
          ))}
        </div>
      )}

      <style>{`
        .language-switcher {
          position: relative;
          margin-left: 10px;
        }
        .lang-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 20px;
          background: #f5f5f5;
          border: 1px solid #e0e0e0;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 16px;
          line-height: 1;
        }
        .lang-btn:hover {
          background: #fff;
          border-color: #d0d0d0;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .chevron {
          color: #666;
          transition: transform 0.2s;
        }
        .chevron.open {
          transform: rotate(180deg);
        }
        
        .lang-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          border: 1px solid #eee;
          min-width: 140px;
          z-index: 1001; /* Ensure above header items */
          padding: 5px;
          display: flex;
          flex-direction: column;
        }
        .lang-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
          color: #333;
          border-radius: 4px;
          transition: background 0.2s;
        }
        .lang-option:hover {
          background: #f5f5f5;
        }
        .lang-option.active {
          background: #f0f7ff;
          color: var(--darker, #000);
          font-weight: 500;
        }
        .option-flag {
          font-size: 16px;
        }
        .fade-in {
          animation: fadeIn 0.2s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;
