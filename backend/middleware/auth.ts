import admin from 'firebase-admin';
import { readFileSync } from 'fs';
<<<<<<< Updated upstream
import { join } from 'path';
import type { Request, Response, NextFunction } from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
=======
import { join } from 'path'; 
import type {Request, Response, NextFunction} from 'express';
import { fileURLToPath } from 'url';
import {dirname} from 'path';
>>>>>>> Stashed changes

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccountPath = join(__dirname, '..', 'serviceAccountKey.json');

const serviceAccount = JSON.parse(
  readFileSync(serviceAccountPath, 'utf8')
);
interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export const verifyFirebaseToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
<<<<<<< Updated upstream
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split('Bearer ')[1]
=======
  const token = authHeader?.startsWith('Bearer ') 
    ? authHeader.split('Bearer ')[1] 
>>>>>>> Stashed changes
    : null;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    // Assigning the decoded token to the request for use in controllers
<<<<<<< Updated upstream
    req.user = decodedToken;
=======
    req.user = decodedToken; 
>>>>>>> Stashed changes
    next();
  } catch (error: any) {
    console.error("Firebase Verification Error:", error.message);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};