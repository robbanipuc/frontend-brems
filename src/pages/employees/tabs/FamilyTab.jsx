import { Badge, EmptyState } from '@/components/common';
import { UsersIcon } from '@heroicons/react/24/outline';
import { formatDate } from '@/utils/helpers';

const FamilyMemberCard = ({ member, relation }) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    <div className="flex items-start justify-between">
      <div>
        <h4 className="font-medium text-gray-900">{member.name}</h4>
        {member.name_bn && (
          <p className="text-sm text-gray-500 font-bangla">{member.name_bn}</p>
        )}
      </div>
      <Badge variant="info">{relation}</Badge>
    </div>
    <dl className="mt-3 space-y-1 text-sm">
      {member.nid && (
        <div className="flex justify-between">
          <dt className="text-gray-500">NID:</dt>
          <dd className="text-gray-900">{member.nid}</dd>
        </div>
      )}
      {member.dob && (
        <div className="flex justify-between">
          <dt className="text-gray-500">Date of Birth:</dt>
          <dd className="text-gray-900">{formatDate(member.dob)}</dd>
        </div>
      )}
      {member.occupation && (
        <div className="flex justify-between">
          <dt className="text-gray-500">Occupation:</dt>
          <dd className="text-gray-900">{member.occupation}</dd>
        </div>
      )}
      {member.gender && (
        <div className="flex justify-between">
          <dt className="text-gray-500">Gender:</dt>
          <dd className="text-gray-900 capitalize">{member.gender}</dd>
        </div>
      )}
      {relation === 'Spouse' && (
        <div className="flex justify-between">
          <dt className="text-gray-500">Marriage Status:</dt>
          <dd>
            <Badge variant={member.is_active_marriage ? 'success' : 'default'}>
              {member.is_active_marriage ? 'Active' : 'Inactive'}
            </Badge>
          </dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-gray-500">Status:</dt>
        <dd>
          <Badge variant={member.is_alive ? 'success' : 'default'}>
            {member.is_alive ? 'Alive' : 'Deceased'}
          </Badge>
        </dd>
      </div>
    </dl>
  </div>
);

const FamilyTab = ({ employee }) => {
  const { family = [] } = employee;

  const father = family.find(m => m.relation === 'father');
  const mother = family.find(m => m.relation === 'mother');
  const spouses = family.filter(m => m.relation === 'spouse');
  const children = family.filter(m => m.relation === 'child');

  const hasFamilyData = father || mother || spouses.length > 0 || children.length > 0;

  if (!hasFamilyData) {
    return (
      <div className="p-6">
        <EmptyState
          icon={UsersIcon}
          title="No family information"
          description="Family details have not been added yet"
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Parents */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Parents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {father ? (
            <FamilyMemberCard member={father} relation="Father" />
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
              Father information not provided
            </div>
          )}
          {mother ? (
            <FamilyMemberCard member={mother} relation="Mother" />
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
              Mother information not provided
            </div>
          )}
        </div>
      </div>

      {/* Spouse(s) */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Spouse(s)
          {employee.gender === 'male' && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({employee.active_spouse_count || 0} of {employee.max_spouses} active)
            </span>
          )}
        </h3>
        {spouses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spouses.map((spouse, index) => (
              <FamilyMemberCard key={index} member={spouse} relation="Spouse" />
            ))}
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
            No spouse information provided
          </div>
        )}
      </div>

      {/* Children */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Children
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({children.length})
          </span>
        </h3>
        {children.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children.map((child, index) => (
              <FamilyMemberCard key={index} member={child} relation="Child" />
            ))}
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
            No children information provided
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyTab;