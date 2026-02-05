import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFriendStore } from '../../core/stores/friendStore';
import './BulletinBoard.css';

export function BulletinBoard() {
  const getUpcomingBirthdays = useFriendStore((state) => state.getUpcomingBirthdays);
  const upcomingBirthdays = getUpcomingBirthdays(60); // Next 60 days

  const [hoveredFriend, setHoveredFriend] = useState<string | null>(null);
  const [showSecretNote, setShowSecretNote] = useState(false);

  // Get current month info
  const now = new Date();
  const currentMonth = now.toLocaleDateString('en-US', { month: 'long' });
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getDay();

  // Map birthdays to days
  const birthdayDays = upcomingBirthdays.reduce((acc, friend) => {
    if (!friend.birthday) return acc;
    const [, month, day] = friend.birthday.split('-').map(Number);
    const birthdayDate = new Date(now.getFullYear(), month - 1, day);

    // Only show this month's birthdays on the calendar
    if (birthdayDate.getMonth() === now.getMonth()) {
      if (!acc[day]) acc[day] = [];
      acc[day].push(friend);
    }
    return acc;
  }, {} as Record<number, typeof upcomingBirthdays>);

  const getDaysUntilBirthday = (birthday: string) => {
    const [, month, day] = birthday.split('-').map(Number);
    const thisYear = now.getFullYear();
    let birthdayDate = new Date(thisYear, month - 1, day);
    if (birthdayDate < now) {
      birthdayDate = new Date(thisYear + 1, month - 1, day);
    }
    return Math.ceil((birthdayDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <motion.div
      className="bulletin-board"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {/* Cork texture background */}
      <div className="cork-texture" />

      {/* Decorative pins */}
      <div className="pin pin-red" style={{ top: '8px', left: '20px' }} />
      <div className="pin pin-blue" style={{ top: '12px', right: '30px' }} />
      <div className="pin pin-yellow" style={{ bottom: '15px', left: '40px' }} />
      <div className="pin pin-green" style={{ bottom: '10px', right: '25px' }} />

      {/* Calendar */}
      <motion.div
        className="mini-calendar"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="calendar-header">
          <span className="calendar-month">{currentMonth}</span>
          <span className="calendar-year">{now.getFullYear()}</span>
        </div>

        <div className="calendar-weekdays">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <span key={i} className="weekday">{day}</span>
          ))}
        </div>

        <div className="calendar-days">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <span key={`empty-${i}`} className="day empty" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const hasBirthday = birthdayDays[day];
            const isToday = day === now.getDate();

            return (
              <motion.span
                key={day}
                className={`day ${hasBirthday ? 'has-birthday' : ''} ${isToday ? 'today' : ''}`}
                onHoverStart={() => hasBirthday && setHoveredFriend(birthdayDays[day][0].id)}
                onHoverEnd={() => setHoveredFriend(null)}
                whileHover={hasBirthday ? { scale: 1.3 } : {}}
                animate={hasBirthday ? {
                  rotate: [0, -3, 3, -3, 0],
                } : {}}
                transition={hasBirthday ? {
                  rotate: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
                } : {}}
              >
                {day}
                {hasBirthday && <span className="birthday-circle" />}
              </motion.span>
            );
          })}
        </div>
      </motion.div>

      {/* Birthday tooltip */}
      <AnimatePresence>
        {hoveredFriend && (
          <motion.div
            className="birthday-tooltip"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {(() => {
              const friend = upcomingBirthdays.find(f => f.id === hoveredFriend);
              if (!friend?.birthday) return null;
              const daysUntil = getDaysUntilBirthday(friend.birthday);
              return (
                <>
                  <span className="tooltip-emoji">🎂</span>
                  <span className="tooltip-name">{friend.name}</span>
                  <span className="tooltip-days">
                    {daysUntil === 0 ? "Today!" : `in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`}
                  </span>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pinned notes */}
      <motion.div
        className="pinned-note note-1"
        whileHover={{ rotate: -2, scale: 1.05 }}
        style={{ rotate: 3 }}
      >
        <div className="note-pin" />
        <span>Water the plants! 💧</span>
      </motion.div>

      {/* Secret note - easter egg */}
      <motion.div
        className="pinned-note note-secret"
        onClick={() => setShowSecretNote(!showSecretNote)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{ rotate: -5 }}
      >
        <div className="note-pin" />
        <span>{showSecretNote ? "You're doing great! 🌟" : "???"}</span>
      </motion.div>

      {/* Upcoming birthdays list */}
      {upcomingBirthdays.length > 0 && (
        <div className="upcoming-list">
          <span className="upcoming-title">Soon:</span>
          {upcomingBirthdays.slice(0, 3).map((friend, i) => (
            <motion.div
              key={friend.id}
              className="upcoming-item"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <span className="upcoming-dot" />
              <span className="upcoming-name">{friend.name.split(' ')[0]}</span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
