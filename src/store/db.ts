import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { logger } from "../logger";

export class FirebaseDB {
  db: FirebaseFirestore.Firestore;

  async init(): Promise<void> {
    logger.debug("initializing Firebase");
    initializeApp({
      credential: applicationDefault(),
    });

    this.db = getFirestore();
    logger.info("Firebase initialized");
  }
}
