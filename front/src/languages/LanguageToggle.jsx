// LanguageToggle.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from './redux/redux';

const LanguageToggle = () => {
  const dispatch = useDispatch();
  const language = useSelector(state => state.language);

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    dispatch(setLanguage(newLanguage));
  };

  return (
    <button onClick={toggleLanguage}>
      {language === 'en' ? 'عربي' : 'English'}
    </button>
  );
};

export default LanguageToggle;
