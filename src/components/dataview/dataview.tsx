import { useEffect, useState } from 'react';

interface Group {
  id: string;
  name: string;
  members: string[];
  created: string | null; // Allow null for created
}

const GroupsPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/datatwo/datatwo');
        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }
        const data = await response.json();
        setGroups(data);
        setFilteredGroups(data);
        setLoading(false);
      } catch (err) {
        const errMsg = (err instanceof Error) ? err.message : 'An unknown error occurred';
        setError(errMsg);
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredGroups(groups.filter(group => group.name.toLowerCase().includes(query)));
  };

  const handleButtonClick = (group: Group) => {
    setSelectedGroup(group);
    setShowPopup(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleConfirm = () => {
    setShowPopup(false);
    setSuccessMessage(`Success! Input for group ${selectedGroup?.name}: ${inputValue}`);
    setInputValue('');
  };

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
      <input
        type="text"
        placeholder="Search groups..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      {successMessage && <div className="success-message">{successMessage}</div>}
      <ul>
        {filteredGroups.map(group => (
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
            <button onClick={() => handleButtonClick(group)}>Add Input</button>
          </li>
        ))}
      </ul>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Input for {selectedGroup?.name}</h2>
            <input type="text" value={inputValue} onChange={handleInputChange} />
            <button onClick={handleConfirm}>Confirm</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .group-list {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        input[type="text"] {
          padding: 10px;
          margin-bottom: 20px;
          width: 80%;
          max-width: 400px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          width: 100%; /* Ensure the list takes full width */
        }
        .group-box {
          border: 1px solid #ccc;
          border-radius: 5px;
          margin: 10px;
          padding: 20px;
          width: 80%; /* Adjust the width as needed */
          max-width: 800px; /* Optional: Limit the maximum width */
          text-align: left; /* Ensure text is left-aligned */
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          color: #1E90FF; /* Use a medium blue color for text */
          font-weight: bold; /* Make the text bold */
        }
        .group-box p {
          margin: 0 0 10px 0;
          font-weight: bold;
        }
        .group-box ul {
          list-style: none;
          padding-left: 20px;
          margin: 0;
        }
        .group-box ul li {
          font-weight: normal;
          color: #1E90FF; /* Use a medium blue color for list items */
        }
        .group-box button {
          margin-top: 10px;
          padding: 10px 15px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .group-box button:hover {
          background-color: #005bb5;
        }
        .popup {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .popup-content {
          background-color: white;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .popup-content h2 {
          margin: 0 0 10px 0;
        }
        .popup-content input {
          margin: 10px 0;
          padding: 10px;
          width: 80%;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .popup-content button {
          padding: 10px 15px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .popup-content button:hover {
          background-color: #005bb5;
        }
        .success-message {
          margin: 20px 0;
          padding: 10px 20px;
          background-color: #e0ffe0;
          border: 1px solid #a0ffa0;
          border-radius: 5px;
          color: #007000;
        }
      `}</style>
    </div>
  );
};

export default GroupsPage;
