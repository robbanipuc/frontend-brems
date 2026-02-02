import { useState } from 'react';
import {
  DocumentIcon,
  PhotoIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline';
import { fileService } from '@/services';
import { Button, Card, EmptyState, FileUpload, ConfirmModal } from '@/components/common';
import { getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const DocumentCard = ({ title, path, type, onDelete, canManage }) => {
  const [deleting, setDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onDelete();
      toast.success('Document deleted');
      setDeleteModal(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  if (!path) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
        <DocumentIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">{title} not uploaded</p>
      </div>
    );
  }

  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(path);
  const fileUrl = `/storage/${path}`;

  return (
    <>
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">{title}</h4>
          <div className="flex items-center gap-2">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              <Button variant="ghost" size="sm" iconOnly icon={ArrowDownTrayIcon} />
            </a>
            {canManage && (
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                icon={TrashIcon}
                onClick={() => setDeleteModal(true)}
              />
            )}
          </div>
        </div>
        
        {isImage ? (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={fileUrl}
              alt={title}
              className="w-full h-40 object-cover rounded-lg"
            />
          </a>
        ) : (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <DocumentIcon className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-600">View Document</span>
          </a>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </>
  );
};

const DocumentsTab = ({ employee, onUpdate, canManage }) => {
  const [uploading, setUploading] = useState({});

  const handleUpload = async (type, file) => {
    try {
      setUploading({ ...uploading, [type]: true });
      
      if (type === 'photo') {
        await fileService.uploadProfilePicture(employee.id, file);
      } else if (type === 'nid') {
        await fileService.uploadNidDocument(employee.id, file);
      } else if (type === 'birth') {
        await fileService.uploadBirthCertificate(employee.id, file);
      }
      
      toast.success('Document uploaded successfully');
      onUpdate?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
  };

  const handleDelete = async (type) => {
    if (type === 'photo') {
      await fileService.deleteProfilePicture(employee.id);
    } else {
      await fileService.deleteDocument(employee.id, type);
    }
    onUpdate?.();
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Documents</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Photo */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Profile Photo</h4>
          {employee.profile_picture ? (
            <DocumentCard
              title="Profile Photo"
              path={employee.profile_picture}
              type="photo"
              onDelete={() => handleDelete('photo')}
              canManage={canManage}
            />
          ) : canManage ? (
            <FileUpload
              accept="image/jpeg,image/jpg,image/png"
              maxSize={2 * 1024 * 1024}
              onChange={(file) => handleUpload('photo', file)}
              uploading={uploading.photo}
              hint="JPG, PNG up to 2MB"
            />
          ) : (
            <DocumentCard title="Profile Photo" path={null} />
          )}
        </div>

        {/* NID Document */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">NID Document</h4>
          {employee.nid_file_path ? (
            <DocumentCard
              title="NID Document"
              path={employee.nid_file_path}
              type="nid"
              onDelete={() => handleDelete('nid')}
              canManage={canManage}
            />
          ) : canManage ? (
            <FileUpload
              accept="application/pdf,image/jpeg,image/jpg,image/png"
              maxSize={5 * 1024 * 1024}
              onChange={(file) => handleUpload('nid', file)}
              uploading={uploading.nid}
              hint="PDF, JPG, PNG up to 5MB"
            />
          ) : (
            <DocumentCard title="NID Document" path={null} />
          )}
        </div>

        {/* Birth Certificate */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Birth Certificate</h4>
          {employee.birth_file_path ? (
            <DocumentCard
              title="Birth Certificate"
              path={employee.birth_file_path}
              type="birth"
              onDelete={() => handleDelete('birth')}
              canManage={canManage}
            />
          ) : canManage ? (
            <FileUpload
              accept="application/pdf,image/jpeg,image/jpg,image/png"
              maxSize={5 * 1024 * 1024}
              onChange={(file) => handleUpload('birth', file)}
              uploading={uploading.birth}
              hint="PDF, JPG, PNG up to 5MB"
            />
          ) : (
            <DocumentCard title="Birth Certificate" path={null} />
          )}
        </div>
      </div>

      {/* Academic Certificates */}
      {employee.academics?.length > 0 && (
        <div className="mt-8">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Academic Certificates</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employee.academics.map((academic, index) => (
              <DocumentCard
                key={index}
                title={`${academic.exam_name} Certificate`}
                path={academic.certificate_path}
                type={`academic_${academic.id}`}
                onDelete={() => fileService.deleteAcademicCertificate(employee.id, academic.id).then(onUpdate)}
                canManage={canManage}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsTab;