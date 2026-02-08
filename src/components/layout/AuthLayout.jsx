import { Outlet } from 'react-router-dom';
import Logo from './Logo';
import loginBg from '@/assets/images/login-bg.jpg';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between bg-cover bg-center relative"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <div className="absolute inset-0 bg-primary-900/70" aria-hidden="true" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h8m-8 4h8m-6 4h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">BREMS</h1>
              <p className="text-primary-200 text-sm">Bangladesh Railway</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Employee Management System
          </h2>
          <p className="text-lg text-primary-100">
            Streamline employee records, transfers, promotions, and administrative
            tasks for Bangladesh Railway with our comprehensive management solution.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold text-white">10,000+</div>
              <div className="text-primary-200 text-sm">Employees Managed</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold text-white">100+</div>
              <div className="text-primary-200 text-sm">Offices Connected</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-primary-200 text-sm">
          © {new Date().getFullYear()} Bangladesh Railway. All rights reserved.
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Logo className="justify-center" />
          </div>

          {/* Auth form outlet */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;