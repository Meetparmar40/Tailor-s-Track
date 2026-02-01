import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const defaultSettings = {
    theme: 'light',
    font_size: 'medium',
    sidebar_collapsed: false,
    notifications_enabled: true,
    compact_mode: false,
};

export const useSettingsStore = create(
    persist(
        (set, get) => ({
            settings: defaultSettings,
            loading: false,
            error: null,

            // Fetch settings from backend
            fetchSettings: async (userId) => {
                if (!userId) return;
                
                set({ loading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE}/getSettings/${userId}`);
                    if (!response.ok) throw new Error('Failed to fetch settings');
                    
                    const data = await response.json();
                    set({ settings: { ...defaultSettings, ...data }, loading: false });
                    
                    // Apply settings immediately
                    get().applySettings();
                } catch (error) {
                    console.error('Error fetching settings:', error);
                    set({ error: error.message, loading: false });
                }
            },

            // Update settings in backend and local state
            updateSettings: async (userId, newSettings) => {
                if (!userId) return;
                
                set({ loading: true, error: null });
                try {
                    const response = await fetch(`${API_BASE}/updateSettings/${userId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newSettings),
                    });
                    
                    if (!response.ok) throw new Error('Failed to update settings');
                    
                    const data = await response.json();
                    set({ settings: { ...defaultSettings, ...data }, loading: false });
                    
                    // Apply settings immediately
                    get().applySettings();
                } catch (error) {
                    console.error('Error updating settings:', error);
                    set({ error: error.message, loading: false });
                }
            },

            // Update local settings only (for real-time preview)
            setLocalSettings: (newSettings) => {
                set((state) => ({ 
                    settings: { ...state.settings, ...newSettings } 
                }));
                get().applySettings();
            },

            // Apply settings to DOM
            applySettings: () => {
                const { settings } = get();
                const root = document.documentElement;
                
                // Apply theme
                if (settings.theme === 'dark') {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }

                // Apply font size
                const fontSizes = {
                    small: '12px',
                    medium: '14px',
                    large: '16px',
                    'extra-large': '18px',
                };
                root.style.setProperty('--base-font-size', fontSizes[settings.font_size] || '14px');
                
                // Apply compact mode
                if (settings.compact_mode) {
                    root.classList.add('compact-mode');
                } else {
                    root.classList.remove('compact-mode');
                }
            },

            // Reset to default settings
            resetSettings: async (userId) => {
                if (!userId) return;
                await get().updateSettings(userId, defaultSettings);
            },
        }),
        {
            name: 'tailor-track-settings',
            partialize: (state) => ({ settings: state.settings }),
        }
    )
);
