import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import jwt from 'jsonwebtoken';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// JWT secret for demo
const JWT_SECRET = 'demo-jwt-secret-key-change-in-production';

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

const users: User[] = [
  {
    id: 'user-1',
    email: 'admin@acontplus.test',
    displayName: 'Admin User',
    // NOTE: Plaintext passwords are OK for the demo server only
    password: 'Password123',
  },
  {
    id: 'user-2',
    email: 'user@acontplus.test',
    displayName: 'Demo User',
    password: 'Password123',
  },
];
const sessions: Session[] = [];
const csrfTokens = new Set<string>();

// Middleware to parse JSON
app.use(express.json());

// CSRF token endpoint
app.get('/csrf-token', (req, res) => {
  const token = `csrf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  csrfTokens.add(token);
  res.json({ token });
});

// Middleware to check CSRF token
const checkCsrf = (req: any, res: any, next: any) => {
  const token = req.headers['x-csrf-token'];
  if (!token || !csrfTokens.has(token)) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  next();
};

// Fake auth API endpoints
app.post('/account/login', checkCsrf, (req: any, res: any): void => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  // Create JWT tokens
  const accessToken = jwt.sign(
    { sub: user.id, email: user.email, type: 'access' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  const refreshToken = jwt.sign(
    { sub: user.id, email: user.email, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Create session
  const session: Session = {
    token: accessToken,
    refreshToken,
    email,
    expiresAt: Date.now() + 3600000 // 1 hour
  };

  sessions.push(session);

  res.json({
    token: accessToken,
    refreshToken
  });
});

app.post('/account/register', checkCsrf, (req: any, res: any): void => {
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

app.post('/account/refresh', checkCsrf, (req: any, res: any): void => {
  const { email, refreshToken } = req.body;

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;
    if (decoded.type !== 'refresh' || decoded.email !== email) {
      throw new Error('Invalid token');
    }

    const user = users.find(u => u.id === decoded.sub);
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    // Create new tokens
    const newAccessToken = jwt.sign(
      { sub: user.id, email: user.email, type: 'access' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    const newRefreshToken = jwt.sign(
      { sub: user.id, email: user.email, type: 'refresh' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Update session
    const sessionIndex = sessions.findIndex(s => s.email === email && s.refreshToken === refreshToken);
    if (sessionIndex !== -1) {
      sessions[sessionIndex] = {
        token: newAccessToken,
        refreshToken: newRefreshToken,
        email,
        expiresAt: Date.now() + 3600000
      };
    }

    res.json({
      token: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

app.post('/account/logout', checkCsrf, (req: any, res: any): void => {
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
