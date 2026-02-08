import { useState, useEffect, useCallback } from 'react';
import { Input, Select, Checkbox } from '@/components/common';
import bdApiService from '@/services/bdApiService';

const AddressFields = ({
  type,
  label,
  disabled,
  data,
  divisionOptions,
  districtOptions,
  upazilaOptions,
  geoLoading,
  loadingDivisions,
  onDivisionChange,
  onDistrictChange,
  handleAddressChange,
}) => {
  return (
    <div>
      <h4 className='font-medium text-gray-900 mb-4'>{label}</h4>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <Select
          label='Division'
          value={data[type].division}
          onChange={(e) => onDivisionChange(type, e.target.value)}
          options={divisionOptions}
          placeholder={loadingDivisions ? 'Loading…' : 'Select division'}
          disabled={disabled}
        />
        <Select
          label='District'
          value={data[type].district}
          onChange={(e) => onDistrictChange(type, e.target.value)}
          options={districtOptions}
          placeholder={
            geoLoading
              ? 'Loading…'
              : data[type].division
              ? 'Select district'
              : 'Select division first'
          }
          disabled={disabled || !data[type].division}
        />
        <Select
          label='Upazila/Thana'
          value={data[type].upazila}
          onChange={(e) =>
            handleAddressChange(type, 'upazila', e.target.value)
          }
          options={upazilaOptions}
          placeholder={
            geoLoading
              ? 'Loading…'
              : data[type].district
              ? 'Select upazila'
              : 'Select district first'
          }
          disabled={disabled || !data[type].district}
        />
        <Input
          label='Post Office'
          value={data[type].post_office}
          onChange={(e) =>
            handleAddressChange(type, 'post_office', e.target.value)
          }
          placeholder='e.g., Dhanmondi'
          disabled={disabled}
        />
        <Input
          label='House No / Road'
          value={data[type].house_no}
          onChange={(e) =>
            handleAddressChange(type, 'house_no', e.target.value)
          }
          placeholder='e.g., House 10, Road 5'
          disabled={disabled}
        />
        <Input
          label='Village / Area'
          value={data[type].village_road}
          onChange={(e) =>
            handleAddressChange(type, 'village_road', e.target.value)
          }
          placeholder='e.g., Mirpur DOHS'
          disabled={disabled}
        />
      </div>
    </div>
  );
};

const AddressSection = ({ data, onChange }) => {
  const [sameAsPermanent, setSameAsPermanent] = useState(false);

  // BD API options: shared divisions; per-address districts & upazilas
  const [divisions, setDivisions] = useState([]);
  const [permDistricts, setPermDistricts] = useState([]);
  const [permUpazilas, setPermUpazilas] = useState([]);
  const [presDistricts, setPresDistricts] = useState([]);
  const [presUpazilas, setPresUpazilas] = useState([]);
  const [loadingDivisions, setLoadingDivisions] = useState(true);
  const [loadingPermGeo, setLoadingPermGeo] = useState(false);
  const [loadingPresGeo, setLoadingPresGeo] = useState(false);

  const handleAddressChange = (type, field, value) => {
    const newAddresses = {
      ...data,
      [type]: { ...data[type], [field]: value },
    };
    if (sameAsPermanent && type === 'permanent') {
      newAddresses.present = { ...newAddresses.permanent };
    }
    onChange(newAddresses);
  };

  const handleSameAsPermanent = (checked) => {
    setSameAsPermanent(checked);
    if (checked) {
      onChange({ ...data, present: { ...data.permanent } });
    }
  };

  // Get division id by name
  const getDivisionId = useCallback(
    (name) => {
      if (!name || !divisions.length) return null;
      const d = divisions.find((x) => x.name === name);
      return d ? d.id : null;
    },
    [divisions]
  );

  // Get district id by name from a list
  const getDistrictIdFromList = (name, list) => {
    if (!name || !list?.length) return null;
    const d = list.find((x) => x.name === name);
    return d ? d.id : null;
  };

  // Fetch divisions on mount
  useEffect(() => {
    let cancelled = false;
    setLoadingDivisions(true);
    bdApiService
      .getDivisions()
      .then((list) => {
        if (!cancelled) {
          setDivisions(list);
          setLoadingDivisions(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadingDivisions(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Hydrate permanent: when divisions load and permanent.division is set, fetch districts
  useEffect(() => {
    if (!divisions.length || !data.permanent?.division) return;
    const divId = getDivisionId(data.permanent.division);
    if (!divId) return;
    setLoadingPermGeo(true);
    bdApiService
      .getDistricts(divId)
      .then((list) => {
        setPermDistricts(list);
        setLoadingPermGeo(false);
      })
      .catch(() => setLoadingPermGeo(false));
  }, [divisions, data.permanent?.division, getDivisionId]);

  // Hydrate permanent upazilas: when perm districts load and permanent.district is set
  useEffect(() => {
    if (!permDistricts.length || !data.permanent?.district) return;
    const distId = getDistrictIdFromList(
      data.permanent.district,
      permDistricts
    );
    if (!distId) return;
    setLoadingPermGeo(true);
    bdApiService
      .getUpazilas(distId)
      .then((list) => {
        setPermUpazilas(list);
        setLoadingPermGeo(false);
      })
      .catch(() => setLoadingPermGeo(false));
  }, [permDistricts, data.permanent?.district]);

  // Hydrate present: when divisions load and present.division is set
  useEffect(() => {
    if (!divisions.length || !data.present?.division) return;
    const divId = getDivisionId(data.present.division);
    if (!divId) return;
    setLoadingPresGeo(true);
    bdApiService
      .getDistricts(divId)
      .then((list) => {
        setPresDistricts(list);
        setLoadingPresGeo(false);
      })
      .catch(() => setLoadingPresGeo(false));
  }, [divisions, data.present?.division, getDivisionId]);

  // Hydrate present upazilas
  useEffect(() => {
    if (!presDistricts.length || !data.present?.district) return;
    const distId = getDistrictIdFromList(data.present.district, presDistricts);
    if (!distId) return;
    setLoadingPresGeo(true);
    bdApiService
      .getUpazilas(distId)
      .then((list) => {
        setPresUpazilas(list);
        setLoadingPresGeo(false);
      })
      .catch(() => setLoadingPresGeo(false));
  }, [presDistricts, data.present?.district]);

  const divisionOptions = divisions.map((d) => ({
    value: d.name,
    label: d.name,
  }));

  const onDivisionChange = (type, value) => {
    const newAddresses = {
      ...data,
      [type]: { ...data[type], division: value, district: '', upazila: '' },
    };
    if (sameAsPermanent && type === 'permanent') {
      newAddresses.present = { ...newAddresses.permanent };
    }
    onChange(newAddresses);
    if (type === 'permanent') {
      setPermDistricts([]);
      setPermUpazilas([]);
      if (value) {
        const divId = divisions.find((d) => d.name === value)?.id;
        if (divId) {
          setLoadingPermGeo(true);
          bdApiService
            .getDistricts(divId)
            .then(setPermDistricts)
            .finally(() => setLoadingPermGeo(false));
        }
      }
    } else {
      setPresDistricts([]);
      setPresUpazilas([]);
      if (value) {
        const divId = divisions.find((d) => d.name === value)?.id;
        if (divId) {
          setLoadingPresGeo(true);
          bdApiService
            .getDistricts(divId)
            .then(setPresDistricts)
            .finally(() => setLoadingPresGeo(false));
        }
      }
    }
  };

  const onDistrictChange = (type, value) => {
    const newAddresses = {
      ...data,
      [type]: { ...data[type], district: value, upazila: '' },
    };
    if (sameAsPermanent && type === 'permanent') {
      newAddresses.present = { ...newAddresses.permanent };
    }
    onChange(newAddresses);
    const list = type === 'permanent' ? permDistricts : presDistricts;
    const setUpazilas =
      type === 'permanent' ? setPermUpazilas : setPresUpazilas;
    const setLoading =
      type === 'permanent' ? setLoadingPermGeo : setLoadingPresGeo;
    setUpazilas([]);
    if (value && list?.length) {
      const distId = list.find((d) => d.name === value)?.id;
      if (distId) {
        setLoading(true);
        bdApiService
          .getUpazilas(distId)
          .then(setUpazilas)
          .finally(() => setLoading(false));
      }
    }
  };

  const districtOptionsPerm = permDistricts.map((d) => ({
    value: d.name,
    label: d.name,
  }));
  const upazilaOptionsPerm = permUpazilas.map((u) => ({
    value: u.name,
    label: u.name,
  }));
  const districtOptionsPres = presDistricts.map((d) => ({
    value: d.name,
    label: d.name,
  }));
  const upazilaOptionsPres = presUpazilas.map((u) => ({
    value: u.name,
    label: u.name,
  }));

  return (
    <div className='p-6 space-y-8'>
      <h3 className='text-lg font-semibold text-gray-900'>
        Address Information
      </h3>

      <div className='p-4 bg-gray-50 rounded-lg'>
        <AddressFields
          type='permanent'
          label='Permanent Address'
          data={data}
          divisionOptions={divisionOptions}
          districtOptions={districtOptionsPerm}
          upazilaOptions={upazilaOptionsPerm}
          geoLoading={loadingPermGeo}
          loadingDivisions={loadingDivisions}
          onDivisionChange={onDivisionChange}
          onDistrictChange={onDistrictChange}
          handleAddressChange={handleAddressChange}
        />
      </div>

      <div className='flex items-center'>
        <Checkbox
          label='Present address is same as permanent address'
          checked={sameAsPermanent}
          onChange={(e) => handleSameAsPermanent(e.target.checked)}
        />
      </div>

      <div className='p-4 bg-gray-50 rounded-lg'>
        <AddressFields
          type='present'
          label='Present Address'
          disabled={sameAsPermanent}
          data={data}
          divisionOptions={divisionOptions}
          districtOptions={districtOptionsPres}
          upazilaOptions={upazilaOptionsPres}
          geoLoading={loadingPresGeo}
          loadingDivisions={loadingDivisions}
          onDivisionChange={onDivisionChange}
          onDistrictChange={onDistrictChange}
          handleAddressChange={handleAddressChange}
        />
      </div>
    </div>
  );
};

export default AddressSection;
