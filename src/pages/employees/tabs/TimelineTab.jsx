import { useState, useEffect } from 'react';
import {
  ArrowsRightLeftIcon,
  ArrowTrendingUpIcon,
  BriefcaseIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';
import { employeeService } from '@/services';
import { Timeline, EmptyState, Spinner } from '@/components/common';
import { formatDate, getErrorMessage } from '@/utils/helpers';

const TimelineTab = ({ employee }) => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTimeline();
  }, [employee.id]);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getTimeline(employee.id);
      setTimeline(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <EmptyState
          title="Failed to load timeline"
          description={error}
        />
      </div>
    );
  }

  if (timeline.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon={BriefcaseIcon}
          title="No history yet"
          description="Career timeline will appear here as events occur"
        />
      </div>
    );
  }

  const timelineItems = timeline.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    date: item.date,
    icon: item.type === 'transfer' ? ArrowsRightLeftIcon : ArrowTrendingUpIcon,
    iconBackground: item.type === 'transfer' ? 'bg-blue-100' : 'bg-green-100',
    iconColor: item.type === 'transfer' ? 'text-blue-600' : 'text-green-600',
    metadata: [
      item.order_number && `Order: ${item.order_number}`,
      item.has_attachment && 'Has Attachment',
    ].filter(Boolean),
  }));

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Career Timeline</h3>
      <Timeline items={timelineItems} />
    </div>
  );
};

export default TimelineTab;