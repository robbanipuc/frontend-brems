export const ZONES = {
  center: 'Center (Headquarters)',
  east: 'East Zone',
  west: 'West Zone, Rajshahi',
};

export const ZONE_OPTIONS = [
  { value: 'center', label: 'Center (Headquarters)' },
  { value: 'east', label: 'East Zone' },
  { value: 'west', label: 'West Zone, Rajshahi' },
];

export const ZONE_COLORS = {
  center: 'info',
  east: 'success',
  west: 'purple',
};

export const getZoneLabel = (zone) => {
  return ZONES[zone] || zone || '-';
};

export const getZoneColor = (zone) => {
  return ZONE_COLORS[zone] || 'gray';
};