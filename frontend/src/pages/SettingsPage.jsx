import React, { useEffect, useState } from "react";
import {
  Sun,
  Moon,
  Type,
  Bell,
  Layout,
  RotateCcw,
  Check,
  Monitor,
} from "lucide-react";
import Header from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useAuthContext } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";

const fontSizeOptions = [
  { value: 'small', label: 'Small', preview: 'Aa' },
  { value: 'medium', label: 'Medium', preview: 'Aa' },
  { value: 'large', label: 'Large', preview: 'Aa' },
  { value: 'extra-large', label: 'Extra Large', preview: 'Aa' },
];

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

function SettingCard({ title, description, icon: Icon, children }) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function ToggleSwitch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { userId } = useAuthContext();
  const { settings, fetchSettings, updateSettings, setLocalSettings, resetSettings, loading } = useSettingsStore();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchSettings(userId);
    }
  }, [userId, fetchSettings]);

  const handleSettingChange = async (key, value) => {
    if (!userId) return;
    // Update local state immediately
    setLocalSettings({ [key]: value });
    
    // Auto-save to backend
    setIsSaving(true);
    await updateSettings(userId, { ...settings, [key]: value });
    setIsSaving(false);
  };

  const handleReset = async () => {
    if (!userId) return;
    
    setIsSaving(true);
    await resetSettings(userId);
    setIsSaving(false);
  };

  const getCurrentValue = (key) => {
    return localChanges[key] !== undefined ? localChanges[key] : settings[key];
  };

  return (
    <div className="flex-1 min-h-screen">
      <div className="mx-8 my-2">
        <Header
          title="Settings"
          description="Customize your experience"
        />
      </div>
      
      <main className="flex-1 px-8 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Theme Selection */}
          <SettingCard
            title="Theme"
            description="Choose your preferred color scheme"
            icon={Monitor}
          >
            <div className="flex gap-3">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = settings.theme === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSettingChange('theme', option.value)}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <div className={cn(
                      "p-3 rounded-lg",
                      option.value === 'light' ? "bg-white shadow-md" : "bg-gray-800"
                    )}>
                      <Icon className={cn(
                        "h-6 w-6",
                        option.value === 'light' ? "text-yellow-500" : "text-blue-300"
                      )} />
                    </div>
                    <span className="font-medium">{option.label}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </SettingCard>

          {/* Font Size */}
          <SettingCard
            title="Font Size"
            description="Adjust the text size for better readability"
            icon={Type}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {fontSizeOptions.map((option) => {
                const isSelected = settings.font_size === option.value;
                const fontSizeClass = {
                  'small': 'text-xs',
                  'medium': 'text-sm',
                  'large': 'text-base',
                  'extra-large': 'text-lg'
                }[option.value];
                
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSettingChange('font_size', option.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <span className={cn("font-bold", fontSizeClass)}>{option.preview}</span>
                    <span className="text-sm text-muted-foreground">{option.label}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </SettingCard>

          {/* Layout Options */}
          <SettingCard
            title="Layout"
            description="Customize the interface layout"
            icon={Layout}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Reduce spacing and padding for a denser layout
                  </p>
                </div>
                <ToggleSwitch
                  checked={settings.compact_mode}
                  onChange={(value) => handleSettingChange('compact_mode', value)}
                />
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Sidebar Collapsed by Default</Label>
                    <p className="text-sm text-muted-foreground">
                      Start with the sidebar in collapsed state
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={settings.sidebar_collapsed}
                    onChange={(value) => handleSettingChange('sidebar_collapsed', value)}
                  />
                </div>
              </div>
            </div>
          </SettingCard>

          {/* Notifications */}
          <SettingCard
            title="Notifications"
            description="Manage your notification preferences"
            icon={Bell}
          >
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for order updates and reminders
                </p>
              </div>
              <ToggleSwitch
                checked={settings.notifications_enabled}
                onChange={(value) => handleSettingChange('notifications_enabled', value)}
              />
            </div>
          </SettingCard>

          {/* Reset Button */}
          <div className="flex justify-end items-center pt-4">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isSaving || loading}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
