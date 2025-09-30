import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Fake backend data storage
interface User {
  id: string;
  email: string;
  displayName: string;
  password: string;
}

interface Session {
  token: string;
  refreshToken: string;
  email: string;
  expiresAt: number;
}

const users: User[] = [];
const sessions: Session[] = [];

// Middleware to parse JSON
app.use(express.json());

// Fake auth API endpoints
app.post('/account/login', (req: any, res: any): void => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  // Create session
  const token = `fake-jwt-token-${Date.now()}`;
  const refreshToken = `fake-refresh-token-${Date.now()}`;
  const session: Session = {
    token,
    refreshToken,
    email,
    expiresAt: Date.now() + 3600000 // 1 hour
  };

  sessions.push(session);

  res.json({
    token,
    refreshToken
  });
});

app.post('/account/register', (req: any, res: any): void => {
  const { email, displayName, password } = req.body;

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    res.status(400).json({ error: 'User already exists' });
    return;
  }

  const user: User = {
    id: `user-${Date.now()}`,
    email,
    displayName,
    password
  };

  users.push(user);

  res.json({
    id: user.id,
    email: user.email,
    displayName: user.displayName
  });
});

app.post('/account/refresh', (req: any, res: any): void => {
  const { email, refreshToken } = req.body;

  const session = sessions.find(s => s.email === email && s.refreshToken === refreshToken);
  if (!session) {
    res.status(401).json({ error: 'Invalid refresh token' });
    return;
  }

  // Create new session
  const newToken = `fake-jwt-token-${Date.now()}`;
  const newRefreshToken = `fake-refresh-token-${Date.now()}`;
  const newSession: Session = {
    token: newToken,
    refreshToken: newRefreshToken,
    email,
    expiresAt: Date.now() + 3600000
  };

  // Remove old session
  const index = sessions.indexOf(session);
  sessions.splice(index, 1);
  sessions.push(newSession);

  res.json({
    token: newToken,
    refreshToken: newRefreshToken
  });
});

app.post('/account/logout', (req: any, res: any): void => {
  const { email, refreshToken } = req.body;

  const index = sessions.findIndex(s => s.email === email && s.refreshToken === refreshToken);
  if (index !== -1) {
    sessions.splice(index, 1);
  }

  res.json({ success: true });
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then(response => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
