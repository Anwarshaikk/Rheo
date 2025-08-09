import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function log(
  event: string,
  level: 'INFO' | 'WARN' | 'ERROR',
  payload: any,
  orgId: string,
  actor: string,
  projectId?: string,
  error?: string,
  durationMs?: number
) {
  try {
    const logEntry = {
      orgId,
      projectId,
      actor,
      event,
      level,
      payload,
      error,
      durationMs,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, 'logs'), logEntry);
    console.log(`[${level}] ${event}`, logEntry);
  } catch (e) {
    console.error("Failed to write log:", e);
  }
}
