/**
 * RoomScene - The main immersive room container
 * This is the "app" - everything happens within this scene
 */

import { AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../core/stores/uiStore';
import { useFriendStore } from '../../core/stores/friendStore';
import { CozyBackground } from './CozyBackground';
import { BulletinBoard } from './BulletinBoard';
import { GardenShelves } from './GardenShelves';
import { NeedsLoveShelf } from './NeedsLoveShelf';
import { SeedlingNursery } from './SeedlingNursery';
import { FloatingToolbar } from './FloatingToolbar';
import { SidePanel } from './SidePanel';
import { PlantCloseup } from './PlantCloseup';
import { AddFriendPanel } from './AddFriendPanel';
import { GardenSwitcherPanel } from './GardenSwitcherPanel';
import { SettingsPanel } from './SettingsPanel';
import './RoomScene.css';

export function RoomScene() {
  const selectedFriendId = useUIStore((state) => state.selectedFriendId);
  const activePanel = useUIStore((state) => state.activePanel);
  const closePanel = useUIStore((state) => state.closePanel);
  const closePlantCloseup = useUIStore((state) => state.closePlantCloseup);

  const getAllFriendsHealth = useFriendStore((state) => state.getAllFriendsHealth);
  const healthMetrics = getAllFriendsHealth();

  // Check if any plants need attention
  const hasNeedsLove = healthMetrics.some(
    (h) => h.healthStatus === 'at_risk' || h.healthStatus === 'cooling'
  );

  const hasOverlay = selectedFriendId !== null || activePanel !== null;

  return (
    <div className="room-scene">
      {/* Background layer - always visible */}
      <CozyBackground />

      {/* Room content */}
      <div className="room-content">
        {/* Left side - Bulletin board and Nursery */}
        <aside className="room-left">
          <BulletinBoard />
          <SeedlingNursery />
        </aside>

        {/* Center - Garden shelves */}
        <main className="room-center">
          <GardenShelves />

          {/* Needs Love shelf at bottom */}
          {hasNeedsLove && <NeedsLoveShelf />}
        </main>

        {/* Right side - Window area (visual only, handled by CozyBackground) */}
        <aside className="room-right" />
      </div>

      {/* Floating toolbar at bottom */}
      <FloatingToolbar />

      {/* Overlay backdrop - dims room when something is open */}
      <AnimatePresence>
        {hasOverlay && (
          <div
            className="room-overlay-backdrop"
            onClick={() => {
              if (selectedFriendId) closePlantCloseup();
              if (activePanel) closePanel();
            }}
          />
        )}
      </AnimatePresence>

      {/* Plant closeup overlay */}
      <AnimatePresence>
        {selectedFriendId && <PlantCloseup friendId={selectedFriendId} />}
      </AnimatePresence>

      {/* Side panels */}
      <AnimatePresence>
        {activePanel === 'add' && (
          <SidePanel onClose={closePanel}>
            <AddFriendPanel />
          </SidePanel>
        )}
        {activePanel === 'gardens' && (
          <SidePanel onClose={closePanel}>
            <GardenSwitcherPanel />
          </SidePanel>
        )}
        {activePanel === 'settings' && (
          <SidePanel onClose={closePanel}>
            <SettingsPanel />
          </SidePanel>
        )}
      </AnimatePresence>
    </div>
  );
}
