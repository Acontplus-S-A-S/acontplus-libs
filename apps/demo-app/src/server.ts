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

// Application interface and seed data
interface Application {
  id: number;
  name: string;
  description: string;
  version: string;
  status: 'active' | 'inactive' | 'maintenance' | 'deprecated';
  category: string;
  owner: string;
  environment: 'development' | 'staging' | 'production';
  lastDeployed: string;
  dependencies: string[];
  tags: string[];
  isPublic: boolean;
  repositoryUrl: string;
  documentationUrl: string;
  createdAt: string;
  updatedAt: string;
}

let applications: Application[] = [
  {
    id: 1,
    name: 'Customer Portal',
    description: 'Web application for customer self-service and account management',
    version: '2.1.0',
    status: 'active',
    category: 'Web Application',
    owner: 'Frontend Team',
    environment: 'production',
    lastDeployed: '2024-01-15T10:00:00Z',
    dependencies: ['Angular 20', 'Material Design', 'RxJS'],
    tags: ['customer-facing', 'portal', 'web'],
    isPublic: true,
    repositoryUrl: 'https://github.com/company/customer-portal',
    documentationUrl: 'https://docs.company.com/customer-portal',
    createdAt: '2023-06-01T09:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'Order Management API',
    description: 'RESTful API for managing customer orders and inventory',
    version: '1.5.2',
    status: 'active',
    category: 'API',
    owner: 'Backend Team',
    environment: 'production',
    lastDeployed: '2024-01-10T14:30:00Z',
    dependencies: ['Node.js', 'Express', 'MongoDB'],
    tags: ['api', 'orders', 'inventory'],
    isPublic: false,
    repositoryUrl: 'https://github.com/company/order-api',
    documentationUrl: 'https://api.company.com/docs',
    createdAt: '2023-03-15T11:00:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
  },
  {
    id: 3,
    name: 'Mobile App',
    description: 'Cross-platform mobile application for iOS and Android',
    version: '3.0.1',
    status: 'maintenance',
    category: 'Mobile Application',
    owner: 'Mobile Team',
    environment: 'staging',
    lastDeployed: '2024-01-12T16:45:00Z',
    dependencies: ['React Native', 'Redux', 'Native Base'],
    tags: ['mobile', 'cross-platform', 'react-native'],
    isPublic: true,
    repositoryUrl: 'https://github.com/company/mobile-app',
    documentationUrl: 'https://docs.company.com/mobile',
    createdAt: '2023-01-20T08:00:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
  },
  {
    id: 4,
    name: 'Analytics Dashboard',
    description: 'Real-time analytics and reporting dashboard for business intelligence',
    version: '1.2.0',
    status: 'active',
    category: 'Dashboard',
    owner: 'Data Team',
    environment: 'production',
    lastDeployed: '2024-01-08T12:15:00Z',
    dependencies: ['Vue.js', 'D3.js', 'Chart.js'],
    tags: ['analytics', 'dashboard', 'business-intelligence'],
    isPublic: false,
    repositoryUrl: 'https://github.com/company/analytics-dashboard',
    documentationUrl: 'https://docs.company.com/analytics',
    createdAt: '2023-08-10T13:00:00Z',
    updatedAt: '2024-01-08T12:15:00Z',
  },
  {
    id: 5,
    name: 'Legacy System',
    description: 'Legacy enterprise system for internal operations',
    version: '5.2.1',
    status: 'deprecated',
    category: 'Enterprise',
    owner: 'Legacy Team',
    environment: 'production',
    lastDeployed: '2023-12-01T09:00:00Z',
    dependencies: ['Java 8', 'Spring Framework', 'Oracle DB'],
    tags: ['legacy', 'enterprise', 'internal'],
    isPublic: false,
    repositoryUrl: 'https://github.com/company/legacy-system',
    documentationUrl: 'https://docs.company.com/legacy',
    createdAt: '2018-05-15T10:00:00Z',
    updatedAt: '2023-12-01T09:00:00Z',
  },
  {
    id: 6,
    name: 'DevOps Tools',
    description: 'Collection of DevOps tools and automation scripts',
    version: '2.0.0',
    status: 'active',
    category: 'DevOps',
    owner: 'DevOps Team',
    environment: 'development',
    lastDeployed: '2024-01-14T11:20:00Z',
    dependencies: ['Python', 'Docker', 'Kubernetes'],
    tags: ['devops', 'automation', 'tools'],
    isPublic: true,
    repositoryUrl: 'https://github.com/company/devops-tools',
    documentationUrl: 'https://docs.company.com/devops',
    createdAt: '2023-09-01T14:00:00Z',
    updatedAt: '2024-01-14T11:20:00Z',
  },
  {
    id: 7,
    name: 'Testing Framework',
    description: 'Comprehensive testing framework for automated testing',
    version: '1.8.3',
    status: 'active',
    category: 'Testing',
    owner: 'QA Team',
    environment: 'staging',
    lastDeployed: '2024-01-11T15:30:00Z',
    dependencies: ['Jest', 'Cypress', 'Playwright'],
    tags: ['testing', 'automation', 'qa'],
    isPublic: false,
    repositoryUrl: 'https://github.com/company/testing-framework',
    documentationUrl: 'https://docs.company.com/testing',
    createdAt: '2023-04-20T16:00:00Z',
    updatedAt: '2024-01-11T15:30:00Z',
  },
  {
    id: 8,
    name: 'Microservice Gateway',
    description: 'API gateway for managing microservices communication',
    version: '1.3.0',
    status: 'maintenance',
    category: 'Infrastructure',
    owner: 'Platform Team',
    environment: 'production',
    lastDeployed: '2024-01-09T13:45:00Z',
    dependencies: ['Kong', 'Redis', 'PostgreSQL'],
    tags: ['gateway', 'microservices', 'infrastructure'],
    isPublic: false,
    repositoryUrl: 'https://github.com/company/api-gateway',
    documentationUrl: 'https://docs.company.com/gateway',
    createdAt: '2023-07-01T12:00:00Z',
    updatedAt: '2024-01-09T13:45:00Z',
  },
];

let nextApplicationId = 9;

// Middleware to parse JSON
app.use(express.json());

// CSRF token endpoint
app.get('/csrf-token', (req, res) => {
  const token = `csrf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  csrfTokens.add(token);
  res.json({ csrfToken: token }); // Changed from "token" to "csrfToken"
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
  const accessToken = jwt.sign({ sub: user.id, email: user.email, type: 'access' }, JWT_SECRET, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign({ sub: user.id, email: user.email, type: 'refresh' }, JWT_SECRET, {
    expiresIn: '7d',
  });

  // Create session
  const session: Session = {
    token: accessToken,
    refreshToken,
    email,
    expiresAt: Date.now() + 3600000, // 1 hour
  };

  sessions.push(session);

  res.json({
    token: accessToken,
    refreshToken,
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
    password,
  };

  users.push(user);

  // Create JWT tokens (same as login)
  const accessToken = jwt.sign({ sub: user.id, email: user.email, type: 'access' }, JWT_SECRET, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign({ sub: user.id, email: user.email, type: 'refresh' }, JWT_SECRET, {
    expiresIn: '7d',
  });

  // Create session
  const session: Session = {
    token: accessToken,
    refreshToken,
    email,
    expiresAt: Date.now() + 3600000, // 1 hour
  };

  sessions.push(session);

  // Return tokens (same as login response)
  res.json({
    token: accessToken,
    refreshToken,
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
      { expiresIn: '1h' },
    );
    const newRefreshToken = jwt.sign(
      { sub: user.id, email: user.email, type: 'refresh' },
      JWT_SECRET,
      { expiresIn: '7d' },
    );

    // Update session
    const sessionIndex = sessions.findIndex(
      s => s.email === email && s.refreshToken === refreshToken,
    );
    if (sessionIndex !== -1) {
      sessions[sessionIndex] = {
        token: newAccessToken,
        refreshToken: newRefreshToken,
        email,
        expiresAt: Date.now() + 3600000,
      };
    }

    res.json({
      token: newAccessToken,
      refreshToken: newRefreshToken,
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

// Application API endpoints
app.get('/aplicaciones', (req: any, res: any): void => {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const status = req.query.status;
  const environment = req.query.environment;
  const category = req.query.category;
  const isPublic = req.query.isPublic;
  const owner = req.query.owner;
  const search = req.query.q;

  let filteredApps = [...applications];

  // Apply filters
  if (status) {
    filteredApps = filteredApps.filter(app => app.status === status);
  }
  if (environment) {
    filteredApps = filteredApps.filter(app => app.environment === environment);
  }
  if (category) {
    filteredApps = filteredApps.filter(app => app.category === category);
  }
  if (isPublic !== undefined) {
    filteredApps = filteredApps.filter(app => app.isPublic === (isPublic === 'true'));
  }
  if (owner) {
    filteredApps = filteredApps.filter(app => app.owner === owner);
  }
  if (search) {
    const searchLower = search.toLowerCase();
    filteredApps = filteredApps.filter(
      app =>
        app.name.toLowerCase().includes(searchLower) ||
        app.description.toLowerCase().includes(searchLower) ||
        app.category.toLowerCase().includes(searchLower) ||
        app.owner.toLowerCase().includes(searchLower),
    );
  }

  // Apply pagination
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const paginatedApps = filteredApps.slice(startIndex, endIndex);

  const result = {
    items: paginatedApps,
    totalCount: filteredApps.length,
    pageIndex: page,
    pageSize: size,
    totalPages: Math.ceil(filteredApps.length / size),
    hasNextPage: page < Math.ceil(filteredApps.length / size),
    hasPreviousPage: page > 1,
  };

  // Simulate delay
  setTimeout(
    () => {
      res.json(result);
    },
    Math.random() * 500 + 200,
  );
});

app.get('/aplicaciones/:id', (req: any, res: any): void => {
  const id = parseInt(req.params.id);
  const app = applications.find(a => a.id === id);

  if (!app) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  // Simulate delay
  setTimeout(
    () => {
      res.json(app);
    },
    Math.random() * 500 + 200,
  );
});

app.post('/aplicaciones', checkCsrf, (req: any, res: any): void => {
  const applicationData = req.body;

  const newApp: Application = {
    ...applicationData,
    id: nextApplicationId++,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  applications.push(newApp);

  // Simulate delay
  setTimeout(
    () => {
      res.json(newApp);
    },
    Math.random() * 500 + 200,
  );
});

app.put('/aplicaciones/:id', checkCsrf, (req: any, res: any): void => {
  const id = parseInt(req.params.id);
  const updates = req.body;

  const appIndex = applications.findIndex(a => a.id === id);
  if (appIndex === -1) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  applications[appIndex] = {
    ...applications[appIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Simulate delay
  setTimeout(
    () => {
      res.json(applications[appIndex]);
    },
    Math.random() * 500 + 200,
  );
});

app.delete('/aplicaciones/:id', checkCsrf, (req: any, res: any): void => {
  const id = parseInt(req.params.id);

  const appIndex = applications.findIndex(a => a.id === id);
  if (appIndex === -1) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  applications.splice(appIndex, 1);

  // Simulate delay
  setTimeout(
    () => {
      res.json(true);
    },
    Math.random() * 500 + 200,
  );
});

app.get('/aplicaciones/search', (req: any, res: any): void => {
  const query = req.query.q;
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;

  if (!query) {
    res.status(400).json({ error: 'Search query is required' });
    return;
  }

  const searchLower = query.toLowerCase();
  const filteredApps = applications.filter(
    app =>
      app.name.toLowerCase().includes(searchLower) ||
      app.description.toLowerCase().includes(searchLower) ||
      app.category.toLowerCase().includes(searchLower) ||
      app.owner.toLowerCase().includes(searchLower) ||
      app.tags.some(tag => tag.toLowerCase().includes(searchLower)),
  );

  // Apply pagination
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const paginatedApps = filteredApps.slice(startIndex, endIndex);

  const result = {
    items: paginatedApps,
    totalCount: filteredApps.length,
    pageIndex: page,
    pageSize: size,
    totalPages: Math.ceil(filteredApps.length / size),
    hasNextPage: page < Math.ceil(filteredApps.length / size),
    hasPreviousPage: page > 1,
  };

  // Simulate delay
  setTimeout(
    () => {
      res.json(result);
    },
    Math.random() * 500 + 200,
  );
});

app.get('/aplicaciones/stats', (req: any, res: any): void => {
  const stats = {
    total: applications.length,
    byStatus: applications.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
    byEnvironment: applications.reduce(
      (acc, app) => {
        acc[app.environment] = (acc[app.environment] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
    byCategory: applications.reduce(
      (acc, app) => {
        acc[app.category] = (acc[app.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  };

  // Simulate delay
  setTimeout(
    () => {
      res.json(stats);
    },
    Math.random() * 500 + 200,
  );
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
