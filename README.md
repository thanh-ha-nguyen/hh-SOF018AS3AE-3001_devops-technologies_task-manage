# Task Management System - DevOps Project

[![CI](https://github.com/thanh-ha-nguyen/hh-SOF018AS3AE-3001_devops-technologies_task-manage/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/thanh-ha-nguyen/hh-SOF018AS3AE-3001_devops-technologies_task-manage/actions/workflows/ci.yml)

A full-stack task management application built for learning DevOps practices including CI/CD pipelines, containerization, and cloud deployment.

## Features

- User authentication (Register/Login)
- Create, read, update, delete tasks
- Task status management (Todo, In Progress, Done)
- Task priority levels (Low, Medium, High)
- Due dates
- Filter and search functionality

## Technology Stack

The app has been implemented in a monorepo structure with separate backend and frontend directories. The project utilizes Node.js workspaces to manage dependencies and scripts across both parts of the application. This reduces, for example, the need to install duplicate dependencies in both parts of the application.

**Backend:**
- Node.js with [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL database](https://www.postgresql.org/)
- [JWT authentication](https://jwt.io/)

**Frontend:**
- [React 19](https://react.dev) & [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Router](https://reactrouter.com/) for routing

You do not need prior experience with all these technologies, but familiarity with JavaScript/TypeScript and web development concepts will be helpful. The focus of this project is on DevOps practices rather than developing the application.

## Architecture

The overall architecture follows a typical client-server model with a RESTful API backend and a single-page application (SPA) frontend. The backend handles business logic, data persistence, and authentication, while the frontend provides the user interface and interacts with the backend via API calls:

```mermaid
flowchart LR
   subgraph Frontend["Frontend"]
      FE["React App"]
   end

   subgraph Backend["Backend"]
      BE["API Server (Node + Express)"]
      Auth[(JWT)]
   end

   subgraph Data["Data & Persistence"]
      DB[(PostgreSQL)]
   end

   FE -->|API calls| BE
   BE -->|HTTP responses| FE

   FE -->|Authorization: Bearer token| BE
   BE -->|issues JWT on auth| FE

   BE -->|Read/Write| DB
   DB -->|Query results| BE

   BE -->|issue/verify token| Auth
   Auth -->|token used by| BE
 ```

# Project Tasks

### Prerequisites

- Node.js 22.12+ and npm (or Node.js Docker image)
- Docker and Docker Compose
- Git

### Default Ports

- Frontend: `5173`
- Backend: `5000`
- Database: `5432`

### Tips for Getting Started

- **Start simple:** Begin by setting up a basic GitHub Actions workflow that runs on push and pull requests.
- **Incremental approach:** Add one CI/CD step at a time (e.g., first linting, then testing, then Docker build).
- **Use official actions:** Leverage pre-built GitHub Actions for Node.js, Docker, and CodeQL to simplify your workflow.
- **Test locally:** Make sure your tests and Docker builds work locally before automating them in CI/CD.
- **Read documentation:** Refer to [GitHub Actions docs](https://docs.github.com/en/actions) and [Docker docs](https://docs.docker.com/) for examples and troubleshooting.
- **Monitor pipeline runs:** Check the Actions tab in your repository for logs and troubleshooting information.
- **Iterate and improve:** Refine your workflow as you discover new requirements or issues.

### References

- Workflow syntax for Github actions: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
- The following Docker workshop provides clear instructions that are helpful for completing the docker tasks in this project: https://docs.docker.com/get-started/workshop
- The Render.com documentation helps in the deployment task: https://render.com/docs

## Task 1. Run Task manager Locally

It is recommended to run the application locally before starting CI/CD to quickly identify and resolve issues in the development environment. Running locally allows you to verify basic functionality, catch errors early, and ensure dependencies are correctly configured. 

Running the locally can help detect issues, misunderstandings and misconfigurations early and prevent unnecessary failures later in the CI/CD pipeline.

The following steps guide you through setting up and running the system on your local machine, using your local Node.js environment. If you prefer, you can also utilize your Docker skills to run both the frontend and the backend in containers.


### 1. Fork & Clone repository and install dependencies

This project has a monorepo structure with separate frontend and backend directories. Both the frontend and the backend share some dependencies, so [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) are used to manage them efficiently. 

In practice, this means that both parts are techically independent, but their dependencies are installed from the root directory to avoid duplication. You can also run commands for both parts from the root folder.

To install dependencies for both frontend and backend, fork this repository and clone your forked repository. Run `npm run install:all` from the root directory:

```bash
git clone <forked_repo_url>
cd <directory_name>
npm run install:all
```

### 2. Run PostgreSQL in Docker:

To run the application, you need a PostgreSQL database. The easiest way to set up a local PostgreSQL instance is by using Docker and the [official PostgreSQL image](https://hub.docker.com/_/postgres).

The [image documentation](https://hub.docker.com/_/postgres) provides detailed information and examples on how to use the image, but here are quick examples on how to start a PostgreSQL container with a username, password, and database name and map it to the local port 5432:


```bash
# Powershell
docker run -d `
  --name postgres-local `
  -e POSTGRES_DB=taskmanagement `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -p 5432:5432 `
  postgres:alpine
```

```bash
# Linux or MacOS:
docker run -d \
  --name postgres-local \
  -e POSTGRES_DB=taskmanagement \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:alpine
```

The `postgres-local` container is useful for small development and testing purposes, but it does not persist data if the container is removed. You will need to set up a more robust database solution later in the project.


### 3. Environment variables

In local development, you can use `.env` files to manage environment variables for both frontend and backend. Copy `.env.example` to `.env` both in frontend and backend.

This creates a real `.env` file that your app will use.

In the deployment task later, you will set these environment variables in Render.com instead of using `.env` files.


#### Backend .env

The backend has environment variables for connecting to the database, configuring JWT authentication, and specifying the frontend URL. 

Update the `DATABASE_URL` variable to match your local PostgreSQL setup if necessary.
The database schema is included at `backend/src/db/schema.sql` and is applied automatically when the backend starts in development mode.

```
# The mode in which the application is running and the port it listens on:
NODE_ENV=development
PORT=5000

# Database connection string contains the username, password, host, port, and database name:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskmanagement

# JWT configuration for signing, verifying and expiring tokens:
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# URL of the frontend application (used to allow CORS):
FRONTEND_URL=http://localhost:5173

# Set to true during initial production deployment to create the database
# tables (runs backend/src/db/schema.sql). Switch back to false afterwards:
DB_SYNC=false
```


#### Frontend .env

The frontend needs less configuration. You only need to set the API URL to point to your local backend server:

```
VITE_API_URL=http://localhost:5000/api
```


### 4. Run backend

The backend is built using TypeScript, so you need to compile the TypeScript code to JavaScript before running it. You can do this by running the build script followed by the development server script:

```bash
npm run build:backend
npm run dev:backend
```

Also, verify that the backend passes [tests](./backend/tests/) with:

```bash
npm run test:backend
```

### 5. Run frontend

The frontend is built using Vite, which has a built-in development server, which does not require a separate build step for development. You can start the frontend development server directly with:

```bash
npm run dev:frontend
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Database: localhost:5432


Frontend tests can be run with:

```bash
npm run test:frontend
```


## Task 2. Implement CI pipeline

Your goal is to implement a CI pipeline for the Task Management System:

> [!TIP]
> This project uses [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces), you can run commands in specific subdirectories by setting the [`working-directory`](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsworking-directory) property in your GitHub Actions job step. For example:
>
   > ```yaml
   > - name: Install dependencies
   >   working-directory: ./backend
   >   run: npm install
   > ```
   > 
   > Review the `package.json` files in the root directory to see the available scripts for each part of the CI pipeline.

1. **Set Up a CI Workflow:**

   - Use GitHub Actions to automate your workflow.
   - The pipeline should run on every push and pull request to the main branch.

2. **Automate Testing and Linting:**

   - Configure the pipeline to run backend and frontend tests.
   - Add a linter step to check code quality.

## Task 3. Security 

1. **Static code analysis & dependencies**
   - Integrate [CodeQL analysis](https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql) in the CI/CD pipeline to automatically scan for vulnerabilities.
   - Add steps to check for outdated or vulnerable dependencies using tools like [`npm audit` with an `--audit-level`](https://docs.npmjs.com/cli/commands/npm-audit).


## Task 4. Docker Containers

1. Create Dockerfiles for both backend and frontend applications. 

   *Note that in the frontend Dockerfile, you should not be using the Vite development server for production. Instead, build the frontend and serve the static files using a lightweight web server like Nginx or serve. Docker has [a good tutorial on how to dockerize a React application](https://www.docker.com/blog/how-to-dockerize-react-app/).*

2. Build Docker images for the backend and frontend as part of the pipeline.
3. Optionally, push the images to a container registry.

When creating Dockerfiles and building images, consider the following best practices:

* prefer [official base images](https://hub.docker.com/u/library) (e.g., `node`, `nginx` etc.)
* consider using multi-stage builds to minimize image size
* use `.dockerignore` files to exclude unnecessary files (`node_modules`) and secrets (`.env`) from the build context.


**Notes on environment variables:**

While both the backend and frontend applications rely on environment variables for configuration, there is a big difference in how the backend and frontend handle them in Docker containers.

The backend application reads environment variables directly from the container's environment **at runtime**. This means you can set environment variables when starting the container or in a Docker Compose file.

The frontend application, however, is built into static files during the build process, and there is no runtime environment to read variables from. Therefore, environment variables for the frontend must be injected **at build time**. In the Dockerfile, you can use the [`ARG` instruction](https://www.docker.com/blog/docker-best-practices-using-arg-and-env-in-your-dockerfiles/) to define build-time variables and then pass them to the build command.


**Notes on monorepo structure:**

This project is very similar to repositories used in many Docker tutorials. However, the monorepo and npm workspaces structure may require some adjustments when creating Dockerfiles. Both the backend and frontend have their own `package.json` files, but they also share a `package.json` and `node_modules` folder in the root directory.

There are numerous ways to structure Dockerfiles for monorepos and you can choose your approach based on your skills and preferences. In this case, creating separate Dockerfiles in both `backend` and `frontend` directories and copying only the service specific files into the images is a straightforward approach. In more complex repositories, where the services would actually share code, you might need a more advanced setup.

The backend applies `src/db/schema.sql` at startup when `DB_SYNC=true` (or in development), so make sure the file is present in the runtime image at that path relative to the backend's working directory. For example, with the backend directory as the Docker build context and `WORKDIR /app`:

```dockerfile
COPY src/db/schema.sql ./src/db/schema.sql
```

In a multi-stage Dockerfile, copy the schema into the final image from the build stage, or copy it directly from the build context. If the file is omitted, the backend cannot apply the schema at startup.

**Notes on networking:**

When running the backend container, it needs to able to connect to the PostgreSQL database. Although we started a local PostgreSQL instance earlier, that container is not in the same Docker network as the backend container, so they cannot communicate by default. We recommend using Docker Compose to define and run all the services together in a single network.


## Task 5. Deployment to Render.com

You can choose either **Path 1 (Manual deployment & CD workflow)** or **Path 2 (Deployment using containers)** for deploying your application to Render.com. 

### Path 1: Manual deployment & CD workflow

   1. **PostgreSQL database** 
      - Create a PostgreSQL database in render.com
      - You should remember database URL (Internal Database URL) for the next step 2.

   2. **Backend** 
      - Create Web Service for the backend
         - Root directory: `backend`
         - Build command: `npm install && npm run build`
         - Start command: `npm start`
         - Set the environment variables:
         ```
         NODE_ENV=production
         PORT=5000
         DATABASE_URL=<INTERNAL DATABASE URL>
         JWT_SECRET=generate a random secure string
         JWT_EXPIRES_IN=7d
         FRONTEND_URL=<SET THIS AFTER FRONTEND SETUP>
         DB_SYNC=true
         ```

      After deployment, review the render.com backend deployment logs for the following messages. These confirm a successful database connection and that the tables have been created.
      ```
      Database connection established successfully.
      Database schema applied.
      ```
      
      Check the backend health endpoint: `https://your-backend.onrender.com/api/health`

   3. **Frontend**
      - Create Static site for the frontend
         - Root Directory: `frontend`
         - Build Command: `npm install && npm run build`
         - Publish Directory: `dist`
         - Set the environment variables
         ```
         VITE_API_URL=<BACKEND URL>/api
         ```

   4. **Update CI/CD workflow**
      - Disable automatic deployment for both backend and frontend services in Render.com.
      - Update your CI workflow from Task 2 to include a CD (Continuous Deployment) step.
      - Configure deployment to trigger only when a new release tag is pushed.

> [!TIP] 
> Render.com provides **Blueprints**, which are YAML files that define your entire infrastructure as code (IaC). Blueprints allow you to version, review, and automate the setup of services, databases, environment variables, and more directly from your repository.  
>  
> With Blueprints, you can:
> - Describe all resources (web services, static sites, databases) in a single file.
> - Automate deployments and updates by pushing changes to your repository.
> - Ensure consistent environments across teams and deployments.
>  
> To use Blueprints for deployment:
> 1. Create a `render.yaml` file in your repository root.
> 2. Define your services, build commands, environment variables, and database configuration in the file.
> 3. Connect your repository to Render.com and enable Blueprint deployment.
> 4. Render will automatically provision and update resources based on your Blueprint file.
>  
> Learn more: [Render Blueprints documentation](https://render.com/docs/infrastructure-as-code)


### Path 2: Deployment using containers

This option deploys both backend and frontend as Docker containers on Render.com. If you want, you can also mix this path with the previous one, by deploying the backend as a Docker container and the frontend as a static site.

Render.com provides PostgreSQL as a managed service, which we recommend using instead of deploying your own database container.

1. **Create Dockerfiles**
   - Create a `Dockerfile` in both `backend` and `frontend` directories if you haven't done these in Task 4.

2. **Build and Test Locally**

   - Build and test the Dockerfiles locally

3. **Push Images to Registry**

   - Use either Docker Hub, or [GitHub container registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) to store your Docker images.
   - Build and push images to the registry from your CI pipeline.

Docker container registries typically support both public and private images. For simplicity, it may be easier to publish the images as public.
  
4. **Create Services on Render.com**

   - Create a new **Web Service** for backend:
     - Select "Deploy an existing Docker image".
     - Set image source to your registry.
     - Set environment variables.

   - Create a new **Web Service** for frontend (optionally, you can use Static Site as in Path 1):
     - Use the frontend image.
     - Set environment variables.

5. **Configure Database**

   - Create a PostgreSQL database on Render.com.
   - Update backend environment variables with the internal database URL.

6. **Update CI/CD Workflow**

   - Add steps to build and push Docker images on a release or a tag.
   - Trigger deployment on Render.com after pushing new images.
  
**References:**

- [Render Docker Deployment Docs](https://render.com/docs/docker)

## Task 6. Monitoring

Implement monitoring and health checks for your deployed application:

1. **Configure Render.com Health Checks for backend**
   - Enable [health check monitoring](https://render.com/docs/health-checks) in your Render.com backend service settings.
   - Set the health check path to `/api/health`.
   - Configure appropriate intervals and timeout values.
   - Render.com will automatically restart your service if health checks fail consistently.

2. **Set Up Notifications**
   - Configure [notification settings](https://render.com/docs/notifications) in Render.com to receive alerts when services go down or health checks fail.
   - Add email or Slack notifications for deployment failures and service health issues.

## Deliveries & Submission

Teachers will provide a link to the course self‑assessment form. All students must complete that form and submit it by the course deadline.

In the self‑assessment there are own assessment for each project task. Ensure access permissions are correct. If any link points to a private resource, grant the teachers access or provide a downloadable alternative link.

## Course implementation and runbook

The repository includes hands-on examples for the wider course topics: GitHub collaboration, CI/CD, containerization, release versioning, security, Kubernetes, and monitoring. Start with [CONTRIBUTING.md](./CONTRIBUTING.md) for the branch and pull-request workflow.

### CI, security, and releases

- The `CI and release deployment` workflow runs on pushes and pull requests to `main`, and on `v*` tags. It tests and builds on Ubuntu and Windows with Node.js 22 and 24, builds and scans both production images, then publishes them to GHCR on pushes to `main` and valid release tags. Images receive `latest`, branch/release, and commit-SHA tags.
- CodeQL scans JavaScript/TypeScript and GitHub Actions weekly and on changes. Gitleaks scans repository history for secrets. Trivy checks both built images and deployment configuration for high/critical findings. Dependabot proposes npm and GitHub Actions updates. The CI dependency audit fails on high or critical npm advisories; moderate findings are reported in the Actions log.
- A small JavaScript action validates release tags as `vMAJOR.MINOR.PATCH`. Its tests can be run with `node --test .github/actions/validate-release-tag/test.mjs`.
- For a release, merge and verify the change on `main`, create and push an annotated semantic-version tag, then publish the GitHub release if desired:

  ```bash
  git tag -a v1.0.0 -m "First release"
  git push origin v1.0.0
  ```

- Before tagging, add `RENDER_BACKEND_DEPLOY_HOOK_URL` and `RENDER_FRONTEND_DEPLOY_HOOK_URL` as secrets in the GitHub `production` environment. In Render, create a workspace container registry credential named `github-container-registry` for GHCR, using a GitHub personal access token with `read:packages` access, then create a deploy hook for each image-backed service. Keep the hook URLs and registry token private. The workflow publishes images with `GITHUB_TOKEN` and `packages: write`; no separate push credential is needed in GitHub.

### Local containers

Copy `.env.compose.example` to `.env`, replace every placeholder with local-only random values (use an alphanumeric database password so it is safe in the connection URL), then build and start the app:

```bash
cp .env.compose.example .env
docker compose up --build
```

The frontend is at `http://localhost:5173`; its `/api` requests are proxied to the backend, and PostgreSQL data is kept in a named volume. The frontend image builds static Vite files and serves them with Nginx. Compose waits for PostgreSQL and the backend health checks before starting dependent services. The API container is private to the Compose network; the existing local Node development instructions still use port `5000`.

Do not use the example credentials in a deployed environment. The root `.env` file is ignored by Git.

### Render container deployment

The root `render.yaml` defines a Render Blueprint with a PostgreSQL database and backend and frontend services that pull prebuilt images from GHCR. First merge to `main` so CI publishes the initial `latest` images. Then add the workspace registry credential named `github-container-registry` and connect the repository to Render to create the Blueprint (the packages can remain private). The pipeline publishes `latest`, branch/release, and commit-SHA tags; on a tagged release it triggers Render deploy hooks with that exact release tag after both images have been pushed. The free PostgreSQL plan expires after 30 days and free web services may spin down; check Render's current plan limits before using this for anything beyond a course demonstration.

For the first backend deployment, set `DB_SYNC=true` in the Render dashboard to apply the schema. Confirm the deployment logs show a successful database connection and schema application, then set `DB_SYNC=false`. The frontend Nginx proxy resolves the backend hostname at request time, so it can start even if the backend is still starting or temporarily unavailable. The `FRONTEND_URL` in the Blueprint assumes Render assigns `https://task-management-frontend.onrender.com`; update it if the service receives a different hostname or you use a custom domain. Configure Render's backend health check at `/api/health` and enable deployment and service-health notifications.

The release workflow calls each service's Render deploy hook only after tests, audit, image scans, and GHCR publishing succeed. Render pulls the tagged release image from GHCR; it does not build the Dockerfiles during deployment.

After the workflows have run at least once, protect `main` in GitHub repository settings: require pull requests, require the relevant CI/security checks to pass, and choose an approval requirement appropriate for your course team. Review collaborator access and use the `production` environment for deployment secrets. GitHub's Actions Insights and workflow run views provide pipeline usage and performance monitoring; configure Render notifications separately for deployed-service alerts.

### Kubernetes exercise

The `k8s/` manifests demonstrate a namespace, configuration, secret references, persistent PostgreSQL storage, Deployments, Services, readiness/liveness probes, resource limits, non-root security contexts, read-only root filesystems, and writable temporary volumes. They are intended for a local Kubernetes cluster, not applied automatically by CI.

1. Build the images locally from the repository root and make them available to your local cluster:

   ```bash
   docker build -f backend/Dockerfile -t task-management-backend:local .
   docker build -f frontend/Dockerfile --build-arg VITE_API_URL=/api -t task-management-frontend:local .
   ```

2. Create the namespace and a Kubernetes Secret using locally generated values. Do not commit the values or paste them into a pull request:

   ```bash
   kubectl apply -f k8s/namespace.yaml
   kubectl -n task-management create secret generic task-management-secrets \
     --from-literal=postgres-password='<local-password>' \
     --from-literal=database-url='postgresql://postgres:<local-password>@postgres:5432/taskmanagement' \
     --from-literal=jwt-secret='<at-least-32-random-characters>'
   kubectl apply -f k8s/
   ```

3. Wait for the pods with `kubectl -n task-management get pods`, then access the app with `kubectl -n task-management port-forward service/frontend 30080:80`. Open `http://localhost:30080`.

These manifests use a local image pull policy and a development PostgreSQL volume. For a real cluster, publish images to a registry, use a managed database and secret manager, and review storage, access control, and availability requirements.

### Metrics and logs

The backend writes structured JSON logs to stdout and exposes Prometheus metrics at `/api/metrics` only when `METRICS_ENABLED=true`. Compose enables metrics for local monitoring. Start the optional dashboards with:

```bash
docker compose --profile metrics up --build
```

Prometheus is at `http://localhost:9090`; Grafana is at `http://localhost:3001` (use the password in `.env`). To try log aggregation with Elasticsearch, Logstash, and Kibana:

```bash
docker compose --profile logs up --build
```

Kibana is at `http://localhost:5601`; the Logstash pipeline reads structured application logs from a shared local volume. These monitoring services bind to loopback and disable Elasticsearch security for local learning only. Do not expose them to the public internet.

The course topics that require GitHub or cloud account actions still need to be completed in those dashboards: create and review pull requests, configure repository permissions and branch protection, add the Render deploy-hook secrets, enable service notifications, and complete the course self-assessment.
