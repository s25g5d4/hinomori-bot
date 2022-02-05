import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export class FirebaseDB {
  db: FirebaseFirestore.Firestore;

  async init(): Promise<void> {
    initializeApp({
      credential: applicationDefault()
    });

    this.db = getFirestore();
  }
}
