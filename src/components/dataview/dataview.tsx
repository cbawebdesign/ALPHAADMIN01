import { useEffect, useState } from 'react';

interface Group {
  id: string;
  name: string;
  users: string[];
  members: string[];
  created: string | null; // Allow null for created
}

interface Post {
  id: string;
  categories: string; // Assuming posts have a categories field
  // Add other fields as necessary
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
  const [showPermissionPopup, setShowPermissionPopup] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [userToDelete, setUserToDelete] = useState<string>('');
  const [memberToDelete, setMemberToDelete] = useState<string>('');
  const [groupIdToDelete, setGroupIdToDelete] = useState<string>('');
  const [memberPosts, setMemberPosts] = useState<{ [key: string]: Post[] }>({});

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/datatwo/datatwo');
        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }
        const data = await response.json();
        const normalizedData = data.map((group: any) => ({
          ...group,
          users: Array.isArray(group.users) ? group.users : [], // Ensure users is an array
          members: Array.isArray(group.members) ? group.members : [],
        }));
        setGroups(normalizedData);
        setFilteredGroups(normalizedData);
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

  const handlePermissionButtonClick = (group: Group) => {
    setSelectedGroup(group);
    setShowPermissionPopup(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleConfirm = async () => {
    if (selectedGroup) {
      try {
        const response = await fetch('/api/addmember/addmember', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ groupId: selectedGroup.id, newMember: inputValue }),
        });
        if (!response.ok) {
          throw new Error('Failed to add member');
        }
        // Update the local state to reflect the change
        setGroups(groups.map(group =>
          group.id === selectedGroup.id
            ? { ...group, users: [...group.users, inputValue] }
            : group
        ));
        setFilteredGroups(filteredGroups.map(group =>
          group.id === selectedGroup.id
            ? { ...group, users: [...group.users, inputValue] }
            : group
        ));
        setSuccessMessage(`Success! Added ${inputValue} to group ${selectedGroup.name}`);
        setInputValue('');
        setShowPopup(false);
      } catch (error) {
        const errMsg = (error instanceof Error) ? error.message : 'An unknown error occurred';
        setError(errMsg);
      }
    }
  };

  const handlePermissionConfirm = async () => {
    if (selectedGroup) {
      try {
        const response = await fetch('/api/permcloud/permcloud', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ groupId: selectedGroup.id, member: inputValue }),
        });
        if (!response.ok) {
          throw new Error('Failed to add member');
        }
        // Update the local state to reflect the change
        setGroups(groups.map(group =>
          group.id === selectedGroup.id
            ? { ...group, members: [...group.members, inputValue] }
            : group
        ));
        setFilteredGroups(filteredGroups.map(group =>
          group.id === selectedGroup.id
            ? { ...group, members: [...group.members, inputValue] }
            : group
        ));
        setSuccessMessage(`Success! Added member ${inputValue} to group ${selectedGroup.name}`);
        setInputValue('');
        setShowPermissionPopup(false);
      } catch (error) {
        const errMsg = (error instanceof Error) ? error.message : 'An unknown error occurred';
        setError(errMsg);
      }
    }
  };

  const handleDelete = (groupId: string, user: string) => {
    setGroupIdToDelete(groupId);
    setUserToDelete(user);
    setShowConfirm(true);
  };

  const handleMemberDelete = (groupId: string, member: string) => {
    setGroupIdToDelete(groupId);
    setMemberToDelete(member);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch('/api/deletemember/deletemember', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId: groupIdToDelete, user: userToDelete }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete member');
      }
      // Update the local state to reflect the change
      setGroups(groups.map(group =>
        group.id === groupIdToDelete
          ? { ...group, users: group.users.filter(u => u !== userToDelete) }
          : group
      ));
      setFilteredGroups(filteredGroups.map(group =>
        group.id === groupIdToDelete
          ? { ...group, users: group.users.filter(u => u !== userToDelete) }
          : group
      ));
      setSuccessMessage(`Success! Deleted ${userToDelete} from group.`);
      setShowConfirm(false);
      setUserToDelete('');
      setGroupIdToDelete('');
    } catch (error) {
      const errMsg = (error instanceof Error) ? error.message : 'An unknown error occurred';
      setError(errMsg);
    }
  };

  const confirmMemberDelete = async () => {
    try {
      const response = await fetch('/api/deletemember2/deletemember2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId: groupIdToDelete, member: memberToDelete }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete member');
      }
      // Update the local state to reflect the change
      setGroups(groups.map(group =>
        group.id === groupIdToDelete
          ? { ...group, members: group.members.filter(m => m !== memberToDelete) }
          : group
      ));
      setFilteredGroups(filteredGroups.map(group =>
        group.id === groupIdToDelete
          ? { ...group, members: group.members.filter(m => m !== memberToDelete) }
          : group
      ));
      setSuccessMessage(`Success! Deleted ${memberToDelete} from group.`);
      setShowConfirm(false);
      setMemberToDelete('');
      setGroupIdToDelete('');
    } catch (error) {
      const errMsg = (error instanceof Error) ? error.message : 'An unknown error occurred';
      setError(errMsg);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setUserToDelete('');
    setGroupIdToDelete('');
    setMemberToDelete('');
  };

  const handleMemberClick = async (member: string) => {
    try {
      const response = await fetch(`/api/getmemberposts/getmemberposts?member=${member}`);
      if (!response.ok) {
        throw new Error('Failed to fetch member posts');
      }
      const posts = await response.json();
      setMemberPosts(prevPosts => ({ ...prevPosts, [member]: posts }));
    } catch (error) {
      const errMsg = (error instanceof Error) ? error.message : 'An unknown error occurred';
      setError(errMsg);
    }
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
            <p><strong>Users:</strong></p>
            <ul>
              {group.users && group.users.length > 0 ? (
                group.users.map((user, index) => (
                  <li key={index}>
                    {user}
                    <button className="delete-button" onClick={() => handleDelete(group.id, user)}>Delete</button>
                  </li>
                ))
              ) : (
                <li>No users</li>
              )}
            </ul>
            <p><strong>Members:</strong></p>
            <ul>
              {group.members && group.members.length > 0 ? (
                group.members.map((member, index) => (
                  <li key={index}>
                    <span onClick={() => handleMemberClick(member)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                      {member}
                    </span>
                    <button className="delete-button" onClick={() => handleMemberDelete(group.id, member)}>Delete</button>
                    {memberPosts[member] && (
                      <ul className="posts-list">
                        {memberPosts[member].map(post => (
                          <li key={post.id}>{post.categories}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))
              ) : (
                <li>No members</li>
              )}
            </ul>
            <div className="button-container">
              <button onClick={() => handleButtonClick(group)}>Add Member</button>
              <button onClick={() => handlePermissionButtonClick(group)}>Add Permission</button>
            </div>
          </li>
        ))}
      </ul>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add Member to {selectedGroup?.name}</h2>
            <input type="text" value={inputValue} onChange={handleInputChange} />
            <button onClick={handleConfirm}>Confirm</button>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showPermissionPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add Permission to {selectedGroup?.name}</h2>
            <input type="text" value={inputValue} onChange={handleInputChange} />
            <button onClick={handlePermissionConfirm}>Confirm</button>
            <button onClick={() => setShowPermissionPopup(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="popup">
          <div className="popup-content">
            <h2>Are you sure you want to delete {userToDelete || memberToDelete}?</h2>
            <button onClick={userToDelete ? confirmDelete : confirmMemberDelete}>Yes</button>
            <button onClick={cancelDelete}>No</button>
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
          display: flex;
          justify-content: space-between; /* Ensure text and button are spaced correctly */
        }
        .group-box ul.posts-list {
          padding-left: 40px; /* Add indentation for the nested list */
          margin-top: 5px; /* Add space between member and posts */
        }
        .button-container {
          display: flex;
          gap: 10px; /* Add some space between buttons */
          margin-top: 10px; /* Add some space above the button container */
        }
        .group-box .delete-button {
          margin-left: 10px; /* Ensure some space between text and button */
          background-color: #ff6347;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .group-box .delete-button:hover {
          background-color: #ff4500;
        }
        .group-box button {
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
          margin-right: 10px;
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
