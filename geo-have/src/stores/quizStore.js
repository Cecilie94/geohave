import { defineStore } from 'pinia';
import { db } from '@/configs/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    questions: [],
  }),
  actions: {
    async fetchQuestions() {
      try {
        const querySnapshot = await getDocs(collection(db, 'quiz'));
        this.questions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })).sort((a, b) => a.questionOrder - b.questionOrder);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    },
    async addQuestion(question) {
      try {
        const docRef = await addDoc(collection(db, 'quiz'), question);
        this.questions.push({ id: docRef.id, ...question });
      } catch (error) {
        console.error('Error adding question:', error);
      }
    },
  },
});