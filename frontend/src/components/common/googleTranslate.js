"use client";
import { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    const addScript = document.createElement("script");
    addScript.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    addScript.async = true;
    document.body.appendChild(addScript);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "hi,ta,te,ml,kn",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );

      // Hide unnecessary elements
      setTimeout(() => {
        const frame = document.querySelector(".goog-te-banner-frame");
        const branding = document.querySelector(".goog-logo-link");
        const poweredBy = document.querySelector(".goog-te-gadget span");

        if (frame) frame.style.display = "none"; // Hide top banner
        if (branding) branding.style.display = "none"; // Remove Google branding
        if (poweredBy) poweredBy.style.display = "none"; // Remove "Powered by Google"
      }, 1000);
    };

    // Restore language preference
    const storedLang = localStorage.getItem("selectedLanguage");
    if (storedLang) {
      setTimeout(() => {
        const select = document.querySelector(".goog-te-combo");
        if (select) {
          select.value = storedLang;
          select.dispatchEvent(new Event("change"));
        }
      }, 2000);
    }
  }, []);

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;
