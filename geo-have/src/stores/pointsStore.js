import { defineStore } from 'pinia';
import { db } from '@/configs/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export const usePointsStore = defineStore('points', {
  state: () => ({
    points: 0,
  }),
  actions: {
    async addPoints(pointsToAdd) {
      try {
        this.points += pointsToAdd;
      } catch (error) {
        console.error('Error adding points:', error);
      }
    },
    async updatePointsForUser(userId, pointsToAdd) {
      try {
        const userRef = doc(db, 'User', userId);
        await updateDoc(userRef, {
          points: pointsToAdd,
        });
      } catch (error) {
        console.error('Error updating points for user:', error);
      }
    },
  },
});