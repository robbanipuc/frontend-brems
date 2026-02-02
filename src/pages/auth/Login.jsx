import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Alert } from '@/components/common';

const Login = () => {
  const { login } = useAuth();
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
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    const result = await login(formData.email, formData.password);

    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className='text-center mb-8'>
        <h2 className='text-3xl font-bold text-gray-900'>Welcome back</h2>
        <p className='mt-2 text-gray-600'>
          Sign in to your account to continue
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
          label='Email address'
          type='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          placeholder='Enter your email'
          leftIcon={EnvelopeIcon}
          required
          autoComplete='email'
          disabled={loading}
        />

        <Input
          label='Password'
          type={showPassword ? 'text' : 'password'}
          name='password'
          value={formData.password}
          onChange={handleChange}
          placeholder='Enter your password'
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
            <span className='ml-2 text-sm text-gray-600'>Remember me</span>
          </label>
          <Link
            to='/forgot-password'
            className='text-sm font-medium text-primary-600 hover:text-primary-500'
          >
            Forgot password?
          </Link>
        </div>

        <Button type='submit' fullWidth loading={loading} size='lg'>
          Sign in
        </Button>
      </form>

      <div className='mt-8 text-center text-sm text-gray-500'>
        <p>
          Having trouble signing in?{' '}
          <a
            href='mailto:support@railway.gov.bd'
            className='font-medium text-primary-600 hover:text-primary-500'
          >
            Contact support
          </a>
        </p>
      </div>

      {/* Demo credentials hint */}
      <div className='mt-8 p-4 bg-gray-100 rounded-lg'>
        <p className='text-xs text-gray-500 text-center'>
          <strong>Demo Credentials:</strong>
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
