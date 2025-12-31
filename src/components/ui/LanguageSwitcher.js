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
    kr: "🇰🇷", // Keeping internal key as 'kr' to match existing config
  };

  const labels = {
    en: "English",
    id: "Indonesia",
    kr: "한국어",
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
          background: var(--gray-100);
          border: 1px solid var(--gray-300);
          cursor: pointer;
          transition: all 0.2s;
          font-size: 16px;
          line-height: 1;
        }
        .lang-btn:hover {
          background: var(--white);
          border-color: var(--gray-400);
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .chevron {
          color: var(--gray-600);
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
          background: var(--white);
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          border: 1px solid var(--gray-200);
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
          color: var(--text-dark);
          border-radius: 4px;
          transition: background 0.2s;
        }
        .lang-option:hover {
          background: var(--gray-100);
        }
        .lang-option.active {
          background: var(--gray-200);
          color: var(--darker);
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
