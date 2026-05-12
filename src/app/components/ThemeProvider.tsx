'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

const ThemeContext = createContext({ themeColor: '#3b82f6' });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeColor, setThemeColor] = useState('#3b82f6');
  const supabase = createClient();

  useEffect(() => {
    const applyTheme = (color: string) => {
      if (!color) return;
      document.documentElement.style.setProperty('--primary-color', color);
      
      // Calculate a darker hover color
      const darken = (hex: string, percent: number) => {
        const num = parseInt(hex.replace('#', ''), 16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) - amt,
          G = (num >> 8 & 0x00FF) - amt,
          B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R < 255 ? R < 0 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 0 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 0 ? 0 : B : 255)).toString(16).slice(1);
      };
      
      document.documentElement.style.setProperty('--primary-hover', darken(color, 15));
      document.documentElement.style.setProperty('--primary-light', color + '1a'); // 10% opacity
    };

    const fetchTheme = async () => {
      const { data } = await supabase
        .from('system_settings')
        .select('theme_color')
        .single();

      if (data?.theme_color) {
        setThemeColor(data.theme_color);
        applyTheme(data.theme_color);
      }
    };

    fetchTheme();

    // Set up real-time subscription for theme changes
    const channel = supabase
      .channel('theme-changes')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'system_settings' 
      }, (payload) => {
        if (payload.new.theme_color) {
          setThemeColor(payload.new.theme_color);
          applyTheme(payload.new.theme_color);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ themeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
