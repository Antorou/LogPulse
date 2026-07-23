# 🏃‍♂️ Kubernetes Infrastructure Parkour: The Recap

This document serves as the historical record of how we migrated the LogPulse application from a monolithic Docker Compose environment to a highly available, production-grade Kubernetes cluster on a remote Ubuntu server. We followed the "rules of art" every step of the way.

## 1. The Playground (`k3d`)
Instead of renting expensive AWS servers, we used `k3d` to simulate a multi-node Kubernetes cluster right on an ultra-low-power Lenovo laptop.
- We created a `logpulse` **Namespace** to keep our factory cleanly isolated.
- **The Catch:** We initially forgot to map port 80 to our load balancer. But thanks to Infrastructure as Code, we destroyed and recreated the entire cluster in under 30 seconds!

## 2. The Instruction Manuals (ConfigMaps & Secrets)
Following 12-factor app principles, we completely decoupled our configuration from our application code.
- Non-sensitive data (`SMTP_PORT`, `REDIS_URL`) went into a **ConfigMap**.
- Passwords (`POSTGRES_PASSWORD`, `DATABASE_URL`) were securely base64-encoded and placed in a **Secret**.

## 3. The Data Vaults (Stateful Services)
We deployed PostgreSQL, Redis, MinIO, and Mailpit at the bottom of our stack.
- **PersistentVolumeClaims (PVCs):** Because Kubernetes Pods are mortal, we gave our databases external virtual hard drives. If a Postgres Pod dies, K8s automatically attaches its PVC to the replacement Pod. The data survives!
- **ClusterIP Services:** We set up internal DNS routing. Our API can connect to `db:5432` without ever knowing the actual, constantly changing IP address of the Postgres Pod.

## 4. The Application Assembly Line
Because our code is custom, we couldn't just pull it from Docker Hub. We built our Docker images (`logpulse-api` and `logpulse-frontend`) locally on the server and securely injected them straight into the `k3d` internal registry.
- We deployed the FastAPI backend, React frontend, and Celery background workers.
- **Horizontal Scaling:** We experienced the true magic of Kubernetes by instantly scaling our Celery workers from 1 to 3 replicas with a single command.

## 5. The Front Door (Ingress & Path Routing)
To let the outside world in, we configured an **Ingress**.
- Traefik (the Ingress Controller) acts as our smart traffic router.
- We declared rules: Any request starting with `/api` routes to the FastAPI service. Everything else routes to the React frontend.
- **The Networking Gotchas:**
  1. We updated the local laptop's `/etc/hosts` file to resolve `logpulse.local` to the remote Ubuntu server (`192.168.1.127`).
  2. The React frontend was hardcoded to hit `localhost:8000`. We elegantly updated its `baseURL` to `/api` so it leverages the Ingress perfectly.
  3. The FastAPI backend wasn't expecting the `/api` prefix, so we quickly added `prefix="/api"` to its routers.

## 6. The "Rules of Art" (Kustomize & Database Migrations)
We didn't just throw a giant YAML file into a folder. We used **Kustomize** to structure our infrastructure hierarchically into elegant directories (`postgres/`, `api/`, `config/`).
- **The Migration Trap:** When we finally tried to register a user, we hit a 500 error because the database was completely empty! 
- We discovered our `.dockerignore` was hiding `alembic.ini`, and `env.py` was hardcoded to localhost. We fixed the code, rebuilt the images, and dynamically executed `kubectl exec -it deployment/api -n logpulse -- alembic upgrade head` to generate our SQL tables right inside the running cluster. 

## 7. The Public Gateway & Relative Ingress (Cloudflare Tunnels)
To access our local k3d cluster from other devices (like an iPhone) without complex network configurations, we integrated `cloudflared` to establish a secure tunnel.
- **The Local Media Trap:** The API backend originally returned absolute URLs like `http://localhost:9000/logpulse/...` for S3/MinIO media files. While this worked locally, it failed on public tunnels (since the client device attempted to load the image from its own `localhost`).
- **The Ingress Solution:** We updated `ingress.yaml` to route `/logpulse` directly to the `minio` container (port 9000) inside the cluster and changed `s3.py` to return relative URLs (e.g., `/logpulse/...`). This allows media requests to automatically route through whatever host the client is using (e.g., `logpulse.local` or `.trycloudflare.com`).

## 8. The Watchtower (Prometheus & Grafana Observability)
We successfully deployed cluster observability to monitor CPU/Memory load and API latencies.
- **Backend Metrics Instrumentation:** We added `prometheus-fastapi-instrumentator` to our FastAPI backend to auto-generate metrics at the `/metrics` endpoint.
- **Named Service Ports:** We added a `name: http-api` to our API service port so the Prometheus custom resource could correctly target the scraping interface.
- **Resource Optimization:** We deployed `kube-prometheus-stack` via Helm with custom values to disable the Alertmanager and control-plane collectors, restricting CPU/memory resources to prevent overloading our local environment.
- **ServiceMonitor CRD:** Created and applied a `ServiceMonitor` to scrape the backend API, allowing metrics to flow directly into Prometheus and display on Grafana dashboards via a port-forwarded deployment on port 3000.

