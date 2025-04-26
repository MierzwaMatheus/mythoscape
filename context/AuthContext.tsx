import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Mock secure store for web platform
const webStore: Record<string, string> = {};

const storeData = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    webStore[key] = value;
    return;
  }
  await SecureStore.setItemAsync(key, value);
};

const getData = async (key: string) => {
  if (Platform.OS === 'web') {
    return webStore[key] || null;
  }
  return await SecureStore.getItemAsync(key);
};

const removeData = async (key: string) => {
  if (Platform.OS === 'web') {
    delete webStore[key];
    return;
  }
  await SecureStore.deleteItemAsync(key);
};

interface User {
  email: string;
  id: string;
}

interface Session {
  user: User;
  apiKey?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  saveApiKey: (apiKey: string) => Promise<void>;
  getApiKey: () => Promise<string | null>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session on startup
  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionData = await getData('session');
        if (sessionData) {
          setSession(JSON.parse(sessionData));
        }
      } catch (error) {
        console.error('Failed to load auth session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // In a real app, this would validate with a server
      // For demo, we'll simulate successful authentication

      // Generate a mock user ID (in a real app, this would come from the server)
      const userId = Math.random().toString(36).substring(2, 15);
      
      const newSession = {
        user: {
          email,
          id: userId,
        }
      };
      
      // Store session
      await storeData('session', JSON.stringify(newSession));
      setSession(newSession);
      
      return newSession;
    } catch (error) {
      console.error('Sign in error:', error);
      throw new Error('Failed to sign in');
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // In a real app, this would create a user on the server
      // For demo, we'll simulate successful registration
      
      // Generate a mock user ID (in a real app, this would come from the server)
      const userId = Math.random().toString(36).substring(2, 15);
      
      const newSession = {
        user: {
          email,
          id: userId,
        }
      };
      
      // Store session
      await storeData('session', JSON.stringify(newSession));
      setSession(newSession);
      
      return newSession;
    } catch (error) {
      console.error('Sign up error:', error);
      throw new Error('Failed to sign up');
    }
  };

  const signOut = async () => {
    try {
      await removeData('session');
      await removeData('apiKey');
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out');
    }
  };

  const saveApiKey = async (apiKey: string) => {
    try {
      await storeData('apiKey', apiKey);
      
      // Update session with API key
      if (session) {
        const updatedSession = { ...session, apiKey };
        await storeData('session', JSON.stringify(updatedSession));
        setSession(updatedSession);
      }
    } catch (error) {
      console.error('Save API key error:', error);
      throw new Error('Failed to save API key');
    }
  };

  const getApiKey = async () => {
    try {
      return await getData('apiKey');
    } catch (error) {
      console.error('Get API key error:', error);
      return null;
    }
  };

  const value = {
    session,
    user: session?.user || null,
    signIn,
    signUp,
    signOut,
    saveApiKey,
    getApiKey,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};