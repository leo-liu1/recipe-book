import React, { useState, useEffect, useContext, createContext } from 'react';
import Recipe from '../classes/Recipe.js';
import firebase from 'firebase';
import 'firebase/firestore';

import { useAuth } from './AuthHandler';

const AuthContext = createContext();

export function useRecommend() {
	return useContext(AuthContext);
};

export function ProvideRecommend({ children }) {
    
    return (
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
      )
}