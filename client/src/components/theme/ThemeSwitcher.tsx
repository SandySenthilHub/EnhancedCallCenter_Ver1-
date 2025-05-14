import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

// Define the themes according to SRS
const themes = {
  sunset: { 
    name: 'Vibrant Sunset',
    bg: 'bg-orange-50', 
    primary: 'bg-orange-500', 
    accent: 'bg-pink-500', 
    text: 'text-gray-800',
    btnText: 'text-white',
    primaryText: 'text-orange-500',
    accentText: 'text-pink-500',
    hover: 'hover:bg-orange-600',
    border: 'border-orange-200'
  },
  tropical: { 
    name: 'Tropical Oasis',
    bg: 'bg-emerald-50', 
    primary: 'bg-teal-500', 
    accent: 'bg-green-500', 
    text: 'text-slate-900',
    btnText: 'text-white',
    primaryText: 'text-teal-500',
    accentText: 'text-green-500',
    hover: 'hover:bg-teal-600',
    border: 'border-emerald-200'
  },
  cosmic: { 
    name: 'Cosmic Galaxy',
    bg: 'bg-purple-50', 
    primary: 'bg-purple-500', 
    accent: 'bg-blue-500', 
    text: 'text-gray-900',
    btnText: 'text-white',
    primaryText: 'text-purple-500',
    accentText: 'text-blue-500',
    hover: 'hover:bg-purple-600',
    border: 'border-purple-200'
  },
  citrus: { 
    name: 'Citrus Burst',
    bg: 'bg-yellow-50', 
    primary: 'bg-yellow-400', 
    accent: 'bg-orange-400', 
    text: 'text-slate-800',
    btnText: 'text-slate-800',
    primaryText: 'text-yellow-500',
    accentText: 'text-orange-400',
    hover: 'hover:bg-yellow-500',
    border: 'border-yellow-200'
  },
  berry: { 
    name: 'Berry Bliss',
    bg: 'bg-pink-50', 
    primary: 'bg-rose-600', 
    accent: 'bg-purple-400', 
    text: 'text-gray-900',
    btnText: 'text-white',
    primaryText: 'text-rose-600',
    accentText: 'text-purple-400',
    hover: 'hover:bg-rose-700',
    border: 'border-pink-200'
  },
};

type ThemeKey = keyof typeof themes;
type ThemeValues = typeof themes[ThemeKey];

interface ThemeSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeSwitcher({ isOpen, onClose }: ThemeSwitcherProps) {
  const { currentTheme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>(currentTheme as ThemeKey);

  useEffect(() => {
    setSelectedTheme(currentTheme as ThemeKey);
  }, [currentTheme, isOpen]);

  const handleThemeChange = (theme: ThemeKey) => {
    setSelectedTheme(theme);
  };

  const handleSave = () => {
    setTheme(selectedTheme);
    // Here you would also save the theme preference to the backend
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Theme</DialogTitle>
          <DialogDescription>
            Select a color theme for your dashboard
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-4 py-4">
          {Object.entries(themes).map(([key, theme]) => (
            <div 
              key={key} 
              className={`flex items-center justify-between p-4 rounded-md cursor-pointer transition-all ${theme.bg} ${theme.border} border ${selectedTheme === key ? 'ring-2 ring-black' : ''}`}
              onClick={() => handleThemeChange(key as ThemeKey)}
            >
              <div>
                <h3 className={`font-medium ${theme.text}`}>{theme.name}</h3>
              </div>
              <div className="flex space-x-2">
                <div className={`w-6 h-6 rounded-full ${theme.primary}`}></div>
                <div className={`w-6 h-6 rounded-full ${theme.accent}`}></div>
                {selectedTheme === key && (
                  <div className="flex items-center justify-center ml-2">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className={`${themes[selectedTheme].primary} ${themes[selectedTheme].btnText}`}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Small button component to open the theme switcher
export function ThemeSwitcherButton({ onClick }: { onClick: () => void }) {
  const { currentTheme } = useTheme();
  const theme = themes[currentTheme as ThemeKey];
  
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={`flex items-center space-x-2 ${theme.border}`}
    >
      <div className={`w-4 h-4 rounded-full ${theme.primary}`}></div>
      <span>Theme</span>
    </Button>
  );
}