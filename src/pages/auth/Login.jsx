import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button, Input, Alert } from '@/components/common';

const Login = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError(t('auth.pleaseEnterBoth'));
      return;
    }

    setLoading(true);
    const result = await login(formData.email, formData.password);

    if (!result.success) {
      setError(result.error || t('auth.loginFailed'));
    }
    setLoading(false);
  };

  return (
    <div>
      <div className='text-center mb-8'>
        <h2 className='text-3xl font-bold text-gray-900'>{t('auth.welcomeBack')}</h2>
        <p className='mt-2 text-gray-600'>
          {t('auth.signInToContinue')}
        </p>
      </div>

      {error && (
        <Alert
          variant='error'
          className='mb-6'
          dismissible
          onDismiss={() => setError('')}
        >
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        <Input
          label={t('auth.emailAddress')}
          type='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          placeholder={t('auth.enterEmail')}
          leftIcon={EnvelopeIcon}
          required
          autoComplete='email'
          disabled={loading}
        />

        <Input
          label={t('auth.password')}
          type={showPassword ? 'text' : 'password'}
          name='password'
          value={formData.password}
          onChange={handleChange}
          placeholder={t('auth.enterPassword')}
          leftIcon={LockClosedIcon}
          rightIcon={showPassword ? EyeSlashIcon : EyeIcon}
          onRightIconClick={() => setShowPassword(!showPassword)}
          required
          autoComplete='current-password'
          disabled={loading}
        />

        <div className='flex items-center justify-between'>
          <label className='flex items-center'>
            <input
              type='checkbox'
              className='h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500'
            />
            <span className='ml-2 text-sm text-gray-600'>{t('auth.rememberMe')}</span>
          </label>
          <Link
            to='/forgot-password'
            className='text-sm font-medium text-primary-600 hover:text-primary-500'
          >
            {t('auth.forgotPassword')}
          </Link>
        </div>

        <Button type='submit' fullWidth loading={loading} size='lg'>
          {t('auth.signIn')}
        </Button>
      </form>

      <div className='mt-8 text-center text-sm text-gray-500'>
        <p>
          {t('auth.havingTrouble')}{' '}
          <a
            href='mailto:support@railway.gov.bd'
            className='font-medium text-primary-600 hover:text-primary-500'
          >
            {t('auth.contactSupport')}
          </a>
        </p>
      </div>

      {/* Demo credentials hint */}
      <div className='mt-8 p-4 bg-gray-100 rounded-lg'>
        <p className='text-xs text-gray-500 text-center'>
          <strong>{t('auth.demoCredentials')}</strong>
          <br />
          Super Admin: admin@railway.gov.bd / password
          <br />
          Office Admin: office@railway.gov.bd / password
        </p>
      </div>
    </div>
  );
};

export default Login;
