import user from '@testing-library/user-event';
import { screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Auth } from '../components/handlers/FirebaseHandler';

const login = async (email, password) => {
  const response = await Auth.signInWithEmailAndPassword(email, password);
  return response.user;
};

const signup = async (email, password) => {
  const response = await Auth.createUserWithEmailAndPassword(email, password);
  return response.user;
};

const logout = async () => {
  await Auth.signOut();
};

const isUserAuthenticated = () => {
  return new Promise((resolve) => {
    if (Auth.currentUser) {
      resolve(Auth.currentUser.uid);
    }

    const unsubscribe = Auth.onAuthStateChanged(user => {
      unsubscribe();
      if (user) {
        resolve(user.uid);
      } else {
        resolve(null);
      }
    });
  });
};


describe('Tests for the Auth', () => {
    it('login', async () => {
        const account = {
          email: 'syeaziran@yahoo.com',
          password: 'GoBruins'
        }

        const user = await login(account.email, account.password)
        expect(user.email).toBe(account.email);

    });

    
    it('signup', async () => {
        const account = {
          email: 'testuser_' +  Math.random() + '@test.com',
          password: '123456'
        }

        const user = await signup(account.email, account.password)
        expect(user.email).toBe(account.email);

    });

    it('logout', async () => {

        await logout()
        expect(Auth.currentUser).toBe(null);

    });

    it('isUserAuthenticated', async () => {

      const user = await isUserAuthenticated();
      const currentUserId = Auth.currentUser ? Auth.currentUser.uid : null;
      expect(user).toBe(currentUserId);

    });

});
