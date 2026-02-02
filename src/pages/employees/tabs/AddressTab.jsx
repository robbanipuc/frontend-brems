import { MapPinIcon } from '@heroicons/react/24/outline';
import { EmptyState } from '@/components/common';

const AddressCard = ({ address, type }) => {
  if (!address) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
        {type} address not provided
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
        <MapPinIcon className="w-5 h-5 text-gray-400" />
        {type} Address
      </h4>
      <dl className="space-y-2 text-sm">
        {address.house_no && (
          <div className="flex">
            <dt className="w-28 text-gray-500">House No:</dt>
            <dd className="text-gray-900">{address.house_no}</dd>
          </div>
        )}
        {address.village_road && (
          <div className="flex">
            <dt className="w-28 text-gray-500">Village/Road:</dt>
            <dd className="text-gray-900">{address.village_road}</dd>
          </div>
        )}
        {address.post_office && (
          <div className="flex">
            <dt className="w-28 text-gray-500">Post Office:</dt>
            <dd className="text-gray-900">{address.post_office}</dd>
          </div>
        )}
        {address.upazila && (
          <div className="flex">
            <dt className="w-28 text-gray-500">Upazila:</dt>
            <dd className="text-gray-900">{address.upazila}</dd>
          </div>
        )}
        {address.district && (
          <div className="flex">
            <dt className="w-28 text-gray-500">District:</dt>
            <dd className="text-gray-900">{address.district}</dd>
          </div>
        )}
        {address.division && (
          <div className="flex">
            <dt className="w-28 text-gray-500">Division:</dt>
            <dd className="text-gray-900">{address.division}</dd>
          </div>
        )}
      </dl>
    </div>
  );
};

const AddressTab = ({ employee }) => {
  const { addresses = [] } = employee;
  const presentAddress = addresses.find(a => a.type === 'present');
  const permanentAddress = addresses.find(a => a.type === 'permanent');

  if (!presentAddress && !permanentAddress) {
    return (
      <div className="p-6">
        <EmptyState
          icon={MapPinIcon}
          title="No address information"
          description="Address details have not been added yet"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Address Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddressCard address={presentAddress} type="Present" />
        <AddressCard address={permanentAddress} type="Permanent" />
      </div>
    </div>
  );
};

export default AddressTab;