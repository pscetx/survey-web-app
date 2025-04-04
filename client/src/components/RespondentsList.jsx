import React, { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RespondentsList = () => {
  const [respondents, setRespondents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRespondents() {
      try {
        const response = await fetch(`${API_BASE_URL}/respondent`);
        if (!response.ok) {
          throw new Error(`Error fetching respondents: ${response.statusText}`);
        }
        const data = await response.json();
        setRespondents(data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching respondents.");
        setLoading(false);
        console.error(error);
      }
    }

    fetchRespondents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Respondents List</h2>
      <ul>
        {respondents.map((respondent) => (
          <li key={respondent._id}>
            <h3>{respondent.respondent_name}</h3>
            <p>Email: {respondent.respondent_email}</p>
            <p>Role: {respondent.respondent_role}</p>
            <p>Organization: {respondent.org_name}</p>
            <p>Field: {respondent.field}</p>
            <p>Staff Size: {respondent.staff_size}</p>
            <p>Date: {new Date(respondent.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RespondentsList;
