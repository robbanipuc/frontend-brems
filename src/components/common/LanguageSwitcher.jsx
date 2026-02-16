import { useLanguage } from '@/context/LanguageContext';
import clsx from 'clsx';

/**
 * Simple language switcher: click "English" or "বাংলা" to switch.
 * User-friendly for non-technical users; choice is saved automatically.
 */
const LanguageSwitcher = ({ className, size = 'md' }) => {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      className={clsx(
        'inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5',
        className
      )}
      role="group"
      aria-label="Choose language"
    >
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={clsx(
          'rounded-md font-medium transition-colors',
          size === 'sm' && 'px-2 py-1 text-xs',
          size === 'md' && 'px-3 py-1.5 text-sm',
          size === 'lg' && 'px-4 py-2 text-base',
          locale === 'en'
            ? 'bg-white text-primary-700 shadow-sm ring-1 ring-gray-200'
            : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
        )}
        aria-pressed={locale === 'en'}
      >
        {t('common.English')}
      </button>
      <button
        type="button"
        onClick={() => setLocale('bn')}
        className={clsx(
          'rounded-md font-bangla font-medium transition-colors',
          size === 'sm' && 'px-2 py-1 text-xs',
          size === 'md' && 'px-3 py-1.5 text-sm',
          size === 'lg' && 'px-4 py-2 text-base',
          locale === 'bn'
            ? 'bg-white text-primary-700 shadow-sm ring-1 ring-gray-200'
            : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
        )}
        aria-pressed={locale === 'bn'}
      >
        {t('common.Bangla')}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
