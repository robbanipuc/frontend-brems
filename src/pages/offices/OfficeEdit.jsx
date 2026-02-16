import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { officeService } from '@/services';
import {
  PageHeader,
  Card,
  Button,
  Input,
  Select,
  Alert,
  LoadingScreen,
} from '@/components/common';
import { getZoneLabel, getZoneColor } from '@/constants/zones';
import { getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const OfficeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [office, setOffice] = useState(null);
  const [offices, setOffices] = useState([]);
  const [vacantData, setVacantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    zone: '',
    location: '',
    parent_id: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [savingOffice, setSavingOffice] = useState(false);

  const [postRows, setPostRows] = useState([]);
  const [savingPosts, setSavingPosts] = useState(false);

  useEffect(() => {
    fetchOffice();
    officeService.getManaged().then(setOffices).catch(console.error);
  }, [id]);

  useEffect(() => {
    if (office?.id) {
      fetchVacantPosts();
    }
  }, [office?.id]);

  const fetchOffice = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await officeService.getById(id);
      setOffice(data);
      setFormData({
        name: data.name || '',
        code: data.code || '',
        zone: data.zone || '',
        location: data.location || '',
        parent_id: data.parent_id ?? '',
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchVacantPosts = async () => {
    if (!id) return;
    try {
      const data = await officeService.getVacantPosts(id);
      setVacantData(data);
      setPostRows(
        (data.rows || []).map((r) => ({
          designation_id: r.designation_id,
          designation_name: r.designation_name,
          total_posts: r.total_posts,
          posted: r.posted,
          vacant: r.vacant,
        }))
      );
    } catch (err) {
      console.error('Failed to fetch vacant posts:', err);
      setVacantData(null);
      setPostRows([]);
    }
  };

  const handleOfficeChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSaveOffice = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.code.trim()) errors.code = 'Code is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      setSavingOffice(true);
      const payload = {
        ...formData,
        zone: formData.zone || null,
        parent_id: formData.parent_id || null,
      };
      await officeService.update(id, payload);
      toast.success('Office updated successfully');
      setOffice((prev) => (prev ? { ...prev, ...payload } : null));
    } catch (err) {
      toast.error(getErrorMessage(err));
      if (err.response?.data?.errors) setFormErrors(err.response.data.errors || {});
    } finally {
      setSavingOffice(false);
    }
  };

  const handlePostTotalChange = (designationId, value) => {
    const num = parseInt(value, 10);
    setPostRows((prev) =>
      prev.map((r) =>
        r.designation_id === designationId
          ? { ...r, total_posts: isNaN(num) ? 0 : Math.max(0, num) }
          : r
      )
    );
  };

  const handleSavePosts = async () => {
    try {
      setSavingPosts(true);
      await officeService.updateDesignationPosts(
        id,
        postRows.map((r) => ({ designation_id: r.designation_id, total_posts: r.total_posts }))
      );
      toast.success('Sanctioned posts updated');
      fetchVacantPosts();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingPosts(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading office..." />;
  }

  if (error || !office) {
    return (
      <div className="p-8">
        <Alert variant="error" title="Error">
          {error || 'Office not found'}
        </Alert>
        <Button className="mt-4" onClick={() => navigate('/offices')}>
          Back to Offices
        </Button>
      </div>
    );
  }

  const parentOptions = offices
    .filter((o) => String(o.id) !== String(id))
    .map((o) => ({
      value: o.id,
      label: `${o.name} (${o.code})${o.zone ? ` - ${getZoneLabel(o.zone)}` : ''}`,
    }));

  return (
    <div>
      <PageHeader
        title="Edit Office"
        subtitle={office.name}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Offices', href: '/offices' },
          { label: office.name, href: `/offices/${id}` },
          { label: 'Edit' },
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate(`/offices/${id}`)}>
            View Office
          </Button>
        }
      />

      <form onSubmit={handleSaveOffice} className="space-y-6">
        <Card>
          <Card.Header>
            <Card.Title>Office Information</Card.Title>
          </Card.Header>
          <Card.Body className="space-y-4">
            <Input
              label="Office Name"
              name="name"
              value={formData.name}
              onChange={handleOfficeChange}
              error={formErrors.name}
              required
              placeholder="e.g., Dhaka Division"
            />
            <Input
              label="Office Code"
              name="code"
              value={formData.code}
              onChange={handleOfficeChange}
              error={formErrors.code}
              required
              placeholder="e.g., DHK-DIV"
            />
            <Select
              label="Zone"
              name="zone"
              value={formData.zone}
              onChange={handleOfficeChange}
              options={[{ value: '', label: 'Select Zone' }, { value: 'center', label: 'Center (Headquarters)' }, { value: 'east', label: 'East Zone' }, { value: 'west', label: 'West Zone, Rajshahi' }]}
            />
            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleOfficeChange}
              error={formErrors.location}
              required
              placeholder="e.g., Dhaka, Bangladesh"
            />
            <Select
              label="Parent Office"
              name="parent_id"
              value={formData.parent_id}
              onChange={handleOfficeChange}
              options={[{ value: '', label: 'No Parent (Root Office)' }, ...parentOptions]}
            />
            <div className="flex justify-end pt-2">
              <Button type="submit" loading={savingOffice}>
                Save office details
              </Button>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header className="flex items-center justify-between">
            <Card.Title>Sanctioned posts (Total posts per designation)</Card.Title>
            {postRows.length > 0 && (
              <Button
                type="button"
                size="sm"
                onClick={handleSavePosts}
                loading={savingPosts}
              >
                Save posts
              </Button>
            )}
          </Card.Header>
          <Card.Body className="p-0">
            {postRows.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No designations found for this office. Add designations for this office (or global designations) first.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Designation Name
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Total Post
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Posted
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Vacant post
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {postRows.map((row) => (
                      <tr key={row.designation_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{row.designation_name}</td>
                        <td className="px-4 py-3 text-right">
                          <input
                            type="number"
                            min={0}
                            value={row.total_posts}
                            onChange={(e) =>
                              handlePostTotalChange(row.designation_id, e.target.value)
                            }
                            className="w-20 rounded border border-gray-300 px-2 py-1.5 text-sm text-right"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{row.posted}</td>
                        <td className="px-4 py-3 text-sm text-right">
                          <span className={row.vacant > 0 ? 'font-medium text-amber-600' : 'text-gray-500'}>
                            {Math.max(0, (row.total_posts || 0) - row.posted)}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {vacantData?.totals && (
                      <tr className="bg-gray-100 font-semibold">
                        <td className="px-4 py-3 text-sm text-gray-900">Total</td>
                        <td className="px-4 py-3 text-sm text-right">
                          {postRows.reduce((s, r) => s + (r.total_posts || 0), 0)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">{vacantData.totals.posted}</td>
                        <td className="px-4 py-3 text-sm text-right text-amber-600">
                          {Math.max(
                            0,
                            postRows.reduce((s, r) => s + (r.total_posts || 0), 0) - vacantData.totals.posted
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Card.Body>
        </Card>
      </form>
    </div>
  );
};

export default OfficeEdit;
