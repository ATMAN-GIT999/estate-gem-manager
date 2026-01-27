import React, { createContext, useContext, useState } from 'react';
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

  const toggleEditMode = () => {
    if (isAdmin) {
      setEditMode(!editMode);
      setIsEditing(null);
    }
  };

  // Only provide edit capabilities to admins
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
