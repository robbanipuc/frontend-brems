import { useState, useRef, useCallback } from 'react';
import clsx from 'clsx';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { formatFileSize, isValidFileType, isValidFileSize } from '@/utils/helpers';
import Button from './Button';
import Spinner from './Spinner';

const FileUpload = ({
  label,
  accept,
  maxSize = 5 * 1024 * 1024, // 5MB default
  multiple = false,
  value,
  onChange,
  onRemove,
  error,
  hint,
  required = false,
  disabled = false,
  uploading = false,
  uploadProgress = 0,
  preview = true,
  className,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const acceptedTypes = accept?.split(',').map((t) => t.trim()) || [];

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file) => {
    if (acceptedTypes.length > 0 && !isValidFileType(file, acceptedTypes)) {
      return `Invalid file type. Accepted: ${accept}`;
    }
    if (!isValidFileSize(file, maxSize)) {
      return `File too large. Maximum size: ${formatFileSize(maxSize)}`;
    }
    return null;
  };

  const handleFiles = (files) => {
    if (disabled || uploading) return;

    const fileList = Array.from(files);
    const validFiles = [];
    const errors = [];

    fileList.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      console.error('File validation errors:', errors);
    }

    if (validFiles.length > 0) {
      onChange?.(multiple ? validFiles : validFiles[0]);
    }
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [disabled, uploading, multiple, onChange]
  );

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const isImage = (file) => {
    if (typeof file === 'string') {
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
    }
    return file?.type?.startsWith('image/');
  };

  const getPreviewUrl = (file) => {
    if (typeof file === 'string') return file;
    return URL.createObjectURL(file);
  };

  const renderPreview = () => {
    if (!value || !preview) return null;

    const rawFiles = Array.isArray(value) ? value : [value];
    const files = rawFiles.filter((f) => f != null);

    if (files.length === 0) return null;

    return (
      <div className="mt-4 space-y-2">
        {files.map((file, index) => {
          const fileName = typeof file === 'string' ? file.split('/').pop() : file?.name ?? 'File';
          const fileSize = typeof file === 'string' ? null : file?.size;

          return (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              {isImage(file) && file ? (
                <img
                  src={getPreviewUrl(file)}
                  alt={fileName}
                  className="h-12 w-12 object-cover rounded"
                />
              ) : (
                <div className="h-12 w-12 flex items-center justify-center bg-gray-200 rounded">
                  <DocumentIcon className="h-6 w-6 text-gray-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {fileName}
                </p>
                {fileSize && (
                  <p className="text-xs text-gray-500">{formatFileSize(fileSize)}</p>
                )}
              </div>
              {uploading ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-sm text-gray-500">{uploadProgress}%</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onRemove?.(index)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={clsx(
          'relative border-2 border-dashed rounded-lg p-6 transition-colors',
          dragActive && 'border-primary-500 bg-primary-50',
          !dragActive && !error && 'border-gray-300 hover:border-gray-400',
          error && 'border-red-500 bg-red-50',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled || uploading}
          className="hidden"
        />

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
            {accept?.includes('image') ? (
              <PhotoIcon className="h-6 w-6 text-gray-400" />
            ) : (
              <CloudArrowUpIcon className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900">
              <span className="text-primary-600">Click to upload</span> or drag and
              drop
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {accept || 'Any file type'} up to {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {hint && !error && <p className="mt-2 text-sm text-gray-500">{hint}</p>}

      {renderPreview()}
    </div>
  );
};

export default FileUpload;