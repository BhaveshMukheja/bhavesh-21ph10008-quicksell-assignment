import React, { useEffect, useState } from 'react';
import Dashboard from './pages/dashboard/page';

const App = () => {

  const [tickets, setTickets] = useState(() => {
    const savedTickets = localStorage.getItem('tickets');
    return savedTickets ? JSON.parse(savedTickets) : [];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tickets.length === 0) {
      setLoading(true);
      fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
        .then((response) => {
          if (!response.ok) throw new Error('Failed to fetch data');
          return response.json();
        })
        .then((data) => {
          setTickets(data);
          localStorage.setItem('tickets', JSON.stringify(data));
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }, [tickets]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="App">
     <div><Dashboard tickets={tickets} setTickets={setTickets}/></div>
     <div>
     <h2>Kanban Board</h2>
      {tickets.length > 0 ? (
        tickets.map((ticket) => (
          <div key={ticket.id} className="kanban-card">
            <h3>{ticket.title}</h3>
            <p>Priority: {ticket.priority}</p>
            <p>Status: {ticket.status}</p>
            <p>User: {ticket.user}</p>
          </div>
        ))
      ) : (
        <p>No tickets available</p>
      )}
     </div>
    </div>
  );
}

export default App;
