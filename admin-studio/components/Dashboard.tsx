import React from 'react';
import { Card } from '@sanity/ui';
import { useClient } from 'sanity';

export default function Dashboard() {
  const client = useClient({ apiVersion: '2024-01-01' });
  const [stats, setStats] = React.useState({
    apartments: 0,
    cities: 0,
    messages: 0,
    users: 0
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const [apartments, cities, messages, users] = await Promise.all([
          client.fetch('count(*[_type == "apartment"])'),
          client.fetch('count(*[_type == "city"])'),
          client.fetch('count(*[_type == "availabilityRequest"])'),
          client.fetch('count(*[_type == "user"])')
        ]);

        setStats({
          apartments,
          cities,
          messages,
          users
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [client]);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Apartments Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <Card padding={3}>
          <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Apartments
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
            {stats.apartments}
          </div>
        </Card>

        <Card padding={3}>
          <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Cities
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
            {stats.cities}
          </div>
        </Card>

        <Card padding={3}>
          <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Messages
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
            {stats.messages}
          </div>
        </Card>

        <Card padding={3}>
          <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Users
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>
            {stats.users}
          </div>
        </Card>
      </div>
    </div>
  );
}
