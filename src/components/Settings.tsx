
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings as SettingsIcon, 
  Volume2, 
  Globe, 
  Smartphone,
  Save,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsConfig {
  language: string;
  voiceEnabled: boolean;
  voiceSpeed: number;
  autoSave: boolean;
  emergencyContacts: string[];
  customPrompts: string;
  darkMode: boolean;
  notifications: boolean;
  aiModel: string;
}

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsConfig>({
    language: 'en',
    voiceEnabled: true,
    voiceSpeed: 1.0,
    autoSave: true,
    emergencyContacts: ['', '', ''],
    customPrompts: '',
    darkMode: false,
    notifications: true,
    aiModel: 'gpt-4'
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
  };

  const saveSettings = () => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'excuse-generator-settings.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Settings Exported",
      description: "Settings file has been downloaded.",
    });
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        setSettings({ ...settings, ...importedSettings });
        toast({
          title: "Settings Imported",
          description: "Settings have been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid settings file format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const resetSettings = () => {
    const defaultSettings: SettingsConfig = {
      language: 'en',
      voiceEnabled: true,
      voiceSpeed: 1.0,
      autoSave: true,
      emergencyContacts: ['', '', ''],
      customPrompts: '',
      darkMode: false,
      notifications: true,
      aiModel: 'gpt-4'
    };
    setSettings(defaultSettings);
    localStorage.removeItem('app-settings');
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults.",
    });
  };

  const testVoice = () => {
    if ('speechSynthesis' in window && settings.voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance("This is a test of the text-to-speech feature.");
      utterance.rate = settings.voiceSpeed;
      speechSynthesis.speak(utterance);
    }
  };

  const updateEmergencyContact = (index: number, value: string) => {
    const newContacts = [...settings.emergencyContacts];
    newContacts[index] = value;
    setSettings({ ...settings, emergencyContacts: newContacts });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings & Preferences</h2>
        <p className="text-gray-600">Customize your AI Excuse Generator experience</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5" />
            <span>General Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="language">Language</Label>
              <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                  <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                  <SelectItem value="fr">🇫🇷 French</SelectItem>
                  <SelectItem value="de">🇩🇪 German</SelectItem>
                  <SelectItem value="it">🇮🇹 Italian</SelectItem>
                  <SelectItem value="pt">🇵🇹 Portuguese</SelectItem>
                  <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
                  <SelectItem value="ja">🇯🇵 Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="ai-model">AI Model</Label>
              <Select value={settings.aiModel} onValueChange={(value) => setSettings({...settings, aiModel: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4 (Best Quality)</SelectItem>
                  <SelectItem value="gpt-3.5">GPT-3.5 (Faster)</SelectItem>
                  <SelectItem value="claude">Claude (Alternative)</SelectItem>
                  <SelectItem value="local">Local Model</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-save">Auto-save Excuses</Label>
                <p className="text-sm text-gray-600">Automatically save generated excuses to history</p>
              </div>
              <Switch
                id="auto-save"
                checked={settings.autoSave}
                onCheckedChange={(checked) => setSettings({...settings, autoSave: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">Enable Notifications</Label>
                <p className="text-sm text-gray-600">Receive notifications for important updates</p>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-gray-600">Use dark theme for the interface</p>
              </div>
              <Switch
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => setSettings({...settings, darkMode: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Volume2 className="w-5 h-5" />
            <span>Voice & Text-to-Speech</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="voice-enabled">Enable Text-to-Speech</Label>
              <p className="text-sm text-gray-600">Read excuses aloud automatically</p>
            </div>
            <Switch
              id="voice-enabled"
              checked={settings.voiceEnabled}
              onCheckedChange={(checked) => setSettings({...settings, voiceEnabled: checked})}
            />
          </div>

          {settings.voiceEnabled && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="voice-speed">Speech Speed</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={settings.voiceSpeed}
                    onChange={(e) => setSettings({...settings, voiceSpeed: parseFloat(e.target.value)})}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 w-12">{settings.voiceSpeed}x</span>
                </div>
              </div>

              <Button variant="outline" onClick={testVoice}>
                <Volume2 className="w-4 h-4 mr-2" />
                Test Voice
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5" />
            <span>Emergency Contacts</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.emergencyContacts.map((contact, index) => (
            <div key={index}>
              <Label htmlFor={`contact-${index}`}>Contact {index + 1}</Label>
              <Input
                id={`contact-${index}`}
                placeholder="+1 (555) 123-4567"
                value={contact}
                onChange={(e) => updateEmergencyContact(index, e.target.value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Custom AI Prompts */}
      <Card>
        <CardHeader>
          <CardTitle>Custom AI Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="custom-prompts">Additional Instructions for AI</Label>
            <Textarea
              id="custom-prompts"
              placeholder="Add any specific instructions or preferences for excuse generation..."
              value={settings.customPrompts}
              onChange={(e) => setSettings({...settings, customPrompts: e.target.value})}
              rows={4}
              className="mt-2"
            />
            <p className="text-sm text-gray-600 mt-1">
              These instructions will be included when generating excuses to customize the AI's behavior.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={saveSettings} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
            
            <Button variant="outline" onClick={exportSettings} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export Settings
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={importSettings}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Import Settings
              </Button>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button variant="destructive" onClick={resetSettings} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
