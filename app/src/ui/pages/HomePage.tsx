import { useFriendStore } from '../../core/stores/friendStore';
import { PlantCard } from '../components/PlantCard';
import './HomePage.css';

export function HomePage() {
  const getCurrentGardenFriends = useFriendStore((state) => state.getCurrentGardenFriends);
  const getAllFriendsHealth = useFriendStore((state) => state.getAllFriendsHealth);
  const getUpcomingBirthdays = useFriendStore((state) => state.getUpcomingBirthdays);
  const loadDemoData = useFriendStore((state) => state.loadDemoData);
  const clearAllData = useFriendStore((state) => state.clearAllData);
  const currentGarden = useFriendStore((state) => state.getCurrentGarden());

  const friends = getCurrentGardenFriends();

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

      {friends.length > 0 && (
        <div className="dashboard-grid">
          {upcomingBirthdays.length > 0 && (
            <section className="dashboard-card birthdays-card">
              <h2>Upcoming birthdays</h2>
              <div className="birthday-list">
                {upcomingBirthdays.map((friend) => (
                  <div key={friend.id} className="birthday-item">
                    <span className="birthday-emoji">🎂</span>
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
            <section className="dashboard-card attention-card">
              <h2>Could use some care</h2>
              <p className="card-subtitle">These friends might appreciate hearing from you</p>
              <div className="attention-plants">
                {needsAttention.slice(0, 3).map((health) => {
                  const friend = friends.find((f) => f.id === health.friendId);
                  if (!friend) return null;
                  return <PlantCard key={friend.id} friend={friend} health={health} size="md" />;
                })}
              </div>
            </section>
          )}
        </div>
      )}

      {friends.length > 0 && (
        <section className="garden-preview">
          <div className="section-header">
            <h2>Your garden</h2>
            <a href="/friends" className="view-all">View all →</a>
          </div>
          <div className="plant-row">
            {friends.slice(0, 6).map((friend) => {
              const health = healthMetrics.find((h) => h.friendId === friend.id);
              return <PlantCard key={friend.id} friend={friend} health={health || null} size="lg" />;
            })}
          </div>
        </section>
      )}

      {!currentGarden && (
        <section className="empty-state">
          <div className="empty-illustration">
            <span className="big-plant">🏠</span>
          </div>
          <h3>Create your first garden</h3>
          <p>Gardens help you organize friends by context - local, long-distance, work, etc.</p>
          <div className="empty-actions">
            <button className="btn btn-primary" onClick={loadDemoData}>
              Try the demo garden
            </button>
          </div>
        </section>
      )}

      {currentGarden && friends.length === 0 && (
        <section className="empty-state">
          <div className="empty-illustration">
            <span className="big-plant">🌱</span>
          </div>
          <h3>Your garden is empty</h3>
          <p>Add your first friend to start tending your relationships.</p>
          <div className="empty-actions">
            <a href="/friends" className="btn btn-primary">
              Plant your first friend
            </a>
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
