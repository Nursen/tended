import { useFriendStore } from '../../core/stores/friendStore';
import { PlantCard } from '../components/PlantCard';
import './HomePage.css';

export function HomePage() {
  const friends = useFriendStore((state) => state.friends);
  const getAllFriendsHealth = useFriendStore((state) => state.getAllFriendsHealth);
  const getUpcomingBirthdays = useFriendStore((state) => state.getUpcomingBirthdays);
  const loadDemoData = useFriendStore((state) => state.loadDemoData);
  const clearAllData = useFriendStore((state) => state.clearAllData);

  const healthMetrics = getAllFriendsHealth();
  const upcomingBirthdays = getUpcomingBirthdays(14);

  const needsAttention = healthMetrics.filter(
    (h) => h.healthStatus === 'at_risk' || h.healthStatus === 'cooling'
  );

  return (
    <div className="home-page">
      <section className="welcome-section">
        <h1>Welcome back</h1>
        <p className="subtitle">
          {friends.length === 0
            ? 'Start growing your garden by adding your first friend.'
            : `You're tending to ${friends.length} friendship${friends.length === 1 ? '' : 's'}.`}
        </p>
      </section>

      {upcomingBirthdays.length > 0 && (
        <section className="section">
          <h2>Upcoming birthdays</h2>
          <div className="birthday-list">
            {upcomingBirthdays.map((friend) => (
              <div key={friend.id} className="birthday-item card">
                <span className="birthday-name">{friend.name}</span>
                <span className="birthday-date">
                  {new Date(friend.birthday!).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {needsAttention.length > 0 && (
        <section className="section">
          <h2>Could use some care</h2>
          <p className="section-subtitle">These friends might appreciate hearing from you.</p>
          <div className="plant-grid">
            {needsAttention.slice(0, 4).map((health) => {
              const friend = friends.find((f) => f.id === health.friendId);
              if (!friend) return null;
              return <PlantCard key={friend.id} friend={friend} health={health} />;
            })}
          </div>
        </section>
      )}

      {friends.length > 0 && (
        <section className="section">
          <h2>Your garden</h2>
          <div className="plant-grid">
            {friends.slice(0, 8).map((friend) => {
              const health = healthMetrics.find((h) => h.friendId === friend.id);
              return <PlantCard key={friend.id} friend={friend} health={health || null} />;
            })}
          </div>
        </section>
      )}

      {friends.length === 0 && (
        <section className="empty-state">
          <div className="empty-illustration">🌱</div>
          <h3>Your garden is empty</h3>
          <p>Add your first friend to start tending your relationships.</p>
          <div className="empty-actions">
            <a href="/friends" className="btn btn-primary">
              Plant your first friend
            </a>
            <button className="btn btn-secondary" onClick={loadDemoData}>
              Load demo garden
            </button>
          </div>
        </section>
      )}

      {friends.length > 0 && (
        <div className="demo-controls">
          <button className="btn-text" onClick={clearAllData}>
            Reset garden
          </button>
        </div>
      )}
    </div>
  );
}
