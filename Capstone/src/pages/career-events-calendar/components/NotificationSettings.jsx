import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const NotificationSettings = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const eventTypeOptions = [
    { value: 'webinar', label: 'Webinars' },
    { value: 'hackathon', label: 'Hackathons' },
    { value: 'campus-drive', label: 'Campus Drives' },
    { value: 'networking', label: 'Networking Events' }
  ];

  const companyOptions = [
    { value: 'google', label: 'Google' },
    { value: 'microsoft', label: 'Microsoft' },
    { value: 'amazon', label: 'Amazon' },
    { value: 'meta', label: 'Meta' },
    { value: 'apple', label: 'Apple' },
    { value: 'netflix', label: 'Netflix' }
  ];

  const reminderOptions = [
    { value: '1', label: '1 day before' },
    { value: '3', label: '3 days before' },
    { value: '7', label: '1 week before' },
    { value: '14', label: '2 weeks before' }
  ];

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleArrayToggle = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: prev?.[key]?.includes(value)
        ? prev?.[key]?.filter(item => item !== value)
        : [...prev?.[key], value]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Bell" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Notification Settings</h2>
              <p className="text-sm text-muted-foreground">Customize your event notifications</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" iconName="X" onClick={onClose}>
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* General Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">General Notifications</h3>
            
            <div className="space-y-3">
              <Checkbox
                label="Email notifications"
                description="Receive event updates via email"
                checked={localSettings?.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e?.target?.checked)}
              />
              
              <Checkbox
                label="In-app notifications"
                description="Show notifications within the application"
                checked={localSettings?.inAppNotifications}
                onChange={(e) => handleSettingChange('inAppNotifications', e?.target?.checked)}
              />
              
              <Checkbox
                label="SMS notifications"
                description="Receive important updates via SMS"
                checked={localSettings?.smsNotifications}
                onChange={(e) => handleSettingChange('smsNotifications', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Event Type Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Event Types</h3>
            <p className="text-sm text-muted-foreground">
              Select which types of events you want to be notified about
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {eventTypeOptions?.map(option => (
                <Checkbox
                  key={option?.value}
                  label={option?.label}
                  checked={localSettings?.eventTypes?.includes(option?.value)}
                  onChange={() => handleArrayToggle('eventTypes', option?.value)}
                />
              ))}
            </div>
          </div>

          {/* Company Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Preferred Companies</h3>
            <p className="text-sm text-muted-foreground">
              Get notified about events from specific companies
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {companyOptions?.map(option => (
                <Checkbox
                  key={option?.value}
                  label={option?.label}
                  checked={localSettings?.companies?.includes(option?.value)}
                  onChange={() => handleArrayToggle('companies', option?.value)}
                />
              ))}
            </div>
          </div>

          {/* Reminder Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Reminder Timing</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Registration Deadline Reminder"
                options={reminderOptions}
                value={localSettings?.registrationReminder}
                onChange={(value) => handleSettingChange('registrationReminder', value)}
                description="When to remind about registration deadlines"
              />
              
              <Select
                label="Event Start Reminder"
                options={reminderOptions}
                value={localSettings?.eventReminder}
                onChange={(value) => handleSettingChange('eventReminder', value)}
                description="When to remind about upcoming events"
              />
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Advanced Settings</h3>
            
            <div className="space-y-3">
              <Checkbox
                label="Digest notifications"
                description="Receive a weekly summary of upcoming events"
                checked={localSettings?.weeklyDigest}
                onChange={(e) => handleSettingChange('weeklyDigest', e?.target?.checked)}
              />
              
              <Checkbox
                label="New event alerts"
                description="Get notified immediately when new events are posted"
                checked={localSettings?.newEventAlerts}
                onChange={(e) => handleSettingChange('newEventAlerts', e?.target?.checked)}
              />
              
              <Checkbox
                label="Event updates"
                description="Receive notifications about changes to registered events"
                checked={localSettings?.eventUpdates}
                onChange={(e) => handleSettingChange('eventUpdates', e?.target?.checked)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSave} iconName="Save" iconPosition="left">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;