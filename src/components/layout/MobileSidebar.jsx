import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/context/LanguageContext';
import Sidebar from './Sidebar';

const MobileSidebar = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50 lg:hidden' onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter='transition-opacity ease-linear duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='transition-opacity ease-linear duration-300'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-900/80' />
        </Transition.Child>

        <div className='fixed inset-0 flex'>
          <Transition.Child
            as={Fragment}
            enter='transition ease-in-out duration-300 transform'
            enterFrom='-translate-x-full'
            enterTo='translate-x-0'
            leave='transition ease-in-out duration-300 transform'
            leaveFrom='translate-x-0'
            leaveTo='-translate-x-full'
          >
            <Dialog.Panel className='relative flex w-full max-w-xs flex-1 flex-col bg-white'>
              {/* Close button inside panel */}
              <div className='flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-4'>
                <span className='text-sm font-medium text-gray-700'>{t('nav.Menu')}</span>
                <button
                  type='button'
                  className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  onClick={onClose}
                >
                  <span className='sr-only'>{t('nav.Close sidebar')}</span>
                  <XMarkIcon className='h-6 w-6' />
                </button>
              </div>
              {/* Sidebar content - closes on nav click; overflow hidden so Sidebar nav scrolls internally */}
              <div className='flex min-h-0 flex-1 flex-col overflow-hidden'>
                <Sidebar onNavigateClick={onClose} />
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default MobileSidebar;
