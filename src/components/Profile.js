import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Profile.css";

/**
 * Profile component displays the user's profile information and allows deleting the user account.
 * @param {Object} props - The component props.
 * @param {Object} props.loggedInUser - The logged-in user object.
 * @param {function} props.handleLogout - Function to handle user logout.
 * @param {function} props.updateLoggedInUser - Function to update the logged-in user state.
 */
const Profile = ({ loggedInUser, handleLogout, updateLoggedInUser }) => {
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  /**
   * Fetches the user profile data from the API based on the logged-in user's ID.
   * This effect runs whenever the logged-in user changes.
   */
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token && loggedInUser) {
          const response = await axios.get(`/api/users/${loggedInUser.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserProfile(response.data);
        }
      } catch (error) {
        alert("Error fetching user profile. Please try again later.");
      }
    };

    fetchUserProfile();
  }, [loggedInUser]);

  /**
   * Handles the deletion of the user account.
   * Deletes the user from the API, logs out the user, updates the logged-in user state, removes the auth token, and navigates to the home page.
   */
  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token && loggedInUser) {
        await axios.delete(`/api/users/${loggedInUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        handleLogout();
        updateLoggedInUser(null);
        localStorage.removeItem("authToken");
        navigate("/");
      }
    } catch (error) {
      alert("Error deleting user account. Please try again later.");
    }
  };

  if (!loggedInUser) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {userProfile ? (
        <>
          <p>Email: {userProfile.email}</p>
          <p>Username: {userProfile.username}</p>
          <button onClick={handleDeleteUser}>Delete User</button>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Profile;
