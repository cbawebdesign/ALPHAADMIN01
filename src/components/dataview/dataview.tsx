import { useEffect, useState } from 'react';

interface Group {
  id: string;
  name: string;
  members: string[];
  created: string | null; // Allow null for created
}

const GroupsPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/datatwo/datatwo');
        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }
        const data = await response.json();
        setGroups(data);
        setLoading(false);
      } catch (err) {
        const errMsg = (err instanceof Error) ? err.message : 'An unknown error occurred';
        setError(errMsg);
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const formatDate = (isoString: string | null) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString(); // Format the date as needed
  };

  return (
    <div className="group-list">
      <h1>Group List</h1>
      <ul>
        {groups.map(group => (
          <li key={group.id} className="group-box">
            <p><strong>Name:</strong> {group.name}</p>
            <p><strong>Created:</strong> {formatDate(group.created)}</p>
            <p><strong>Members:</strong></p>
            <ul>
              {group.members && group.members.length > 0 ? (
                group.members.map((member, index) => (
                  <li key={index}>{member}</li>
                ))
              ) : (
                <li>No members</li>
              )}
            </ul>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .group-list {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        .group-box {
          background-color: #f0f0f0;
          border: 1px solid #ccc;
          border-radius: 5px;
          margin: 10px;
          padding: 20px;
          width: 300px;
          text-align: left;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .group-box p {
          margin: 0;
          font-weight: bold;
        }
        .group-box ul {
          list-style: none;
          padding-left: 20px;
        }
        .group-box ul li {
          font-weight: normal;
        }
      `}</style>
    </div>
  );
};

export default GroupsPage;
