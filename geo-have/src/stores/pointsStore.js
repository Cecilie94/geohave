import { defineStore } from 'pinia';
import { db } from '@/configs/firebase';
import { doc, updateDoc } from 'firebase/firestore';

// define store for points
export const usePointsStore = defineStore('points', {
  state: () => ({ // initial state of points
    points: 0,
  }),
  // actions to update points
  actions: {
    async addPoints(pointsToAdd) {
      try {
        this.points += pointsToAdd; 
        // adding points to the local state
      } catch (error) {
        console.error('Error adding points:', error);
      }
    },
    // update points for user in firestore
    async updatePointsForUser(userId, pointsToAdd) { 
      try {
        const userRef = doc(db, 'User', userId);
        await updateDoc(userRef, {
          points: pointsToAdd, // updates points in user document
        });
      } catch (error) {
        console.error('Error updating points for user:', error);
      }
    },
  },
});

// In this snippet, we define a store called usePointsStore that has a state property called points, 
// which is initialized to 0. The store also has an action called addPoints that takes 
// a pointsToAdd argument and adds it to the points state. Additionally, 
// there is an action called updatePointsForUser that updates the points 
// for a specific user in the Firestore database.