import { defineStore } from 'pinia';
import { db } from '@/configs/firebase';
import { collection, getDocs } from 'firebase/firestore';

    export const useQuizStore = defineStore('quiz', {
      // state function returns initial state of the store
      state: () => ({
        questions: [],
      }),
      actions: { // actions for fetching questions
        async fetchQuestions() { // fetches quiz questions from firestore
          try {
            // get all documents from the quiz collection
            const querySnapshot = await getDocs(collection(db, 'quiz'));
            // map the documents to an array of question objects
            this.questions = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              // sorts questions by questionOrder
            })).sort((a, b) => a.questionOrder - b.questionOrder);
          } catch (error) {
            console.error('Error fetching questions:', error);
          }
        },
      },
    });

    