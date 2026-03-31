import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface InlineEditContextType {
  editMode: boolean;
  toggleEditMode: () => void;
  isEditing: string | null;
  setIsEditing: (id: string | null) => void;
}

const InlineEditContext = createContext<InlineEditContextType | undefined>(undefined);

export const InlineEditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Auto-enable edit mode when loaded inside builder iframe with ?edit=true
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('edit') === 'true' && isAdmin) {
      setEditMode(true);
    }
  }, [isAdmin]);

  const toggleEditMode = () => {
    if (isAdmin) {
      setEditMode(!editMode);
      setIsEditing(null);
    }
  };

  const value = {
    editMode: isAdmin && editMode,
    toggleEditMode,
    isEditing,
    setIsEditing,
  };

  return (
    <InlineEditContext.Provider value={value}>
      {children}
    </InlineEditContext.Provider>
  );
};

export const useInlineEdit = () => {
  const context = useContext(InlineEditContext);
  if (context === undefined) {
    throw new Error('useInlineEdit must be used within an InlineEditProvider');
  }
  return context;
};
