# LogPulse Kubernetes Infrastructure & Operations Guide

This document is the operations guide and progress tracker for the LogPulse Kubernetes infrastructure. It serves as a quick-reference (similar to CLAUDE.md) for local cluster management, application deployment, database migrations, and CI/CD operations.

---

## 🛠 Command Reference

### Local Cluster Management (k3d)
* **Create cluster with ingress port-forwarding:**
  ```bash
  k3d cluster create logpulse -p "80:80@loadbalancer" -p "443:443@loadbalancer"
  ```
* **Delete cluster:**
  ```bash
  k3d cluster delete logpulse
  ```

### Rebuilding & Deploying Images (Local Development)
Because manifests use `imagePullPolicy: Never` for custom images, you must build and import them into the cluster nodes:
```bash
# 1. Build images
docker build -t logpulse-api:latest ./backend
docker build -t logpulse-frontend:latest ./frontend

# 2. Import into cluster
k3d image import logpulse-api:latest logpulse-frontend:latest -c logpulse

# 3. Apply manifests
kubectl apply -k k8s

# 4. Rollout restart to load new images
kubectl rollout restart deployment/api -n logpulse
kubectl rollout restart deployment/celery-worker -n logpulse
kubectl rollout restart deployment/celery-beat -n logpulse
```

### Database Migrations (Alembic)
* **Run migrations:**
  ```bash
  kubectl exec -it deployment/api -n logpulse -- alembic upgrade head
  ```
* **Create new migration:**
  ```bash
  kubectl exec -it deployment/api -n logpulse -- alembic revision --autogenerate -m "description"
  ```

---

## 🌐 Service Access Map

* **Frontend & API Gateway:** `http://logpulse.local`
  *(Requires `/etc/hosts` mapping: `127.0.0.1 logpulse.local`)*
* **Mailpit Web UI (SMTP catcher):** `http://localhost:8025`
  ```bash
  kubectl port-forward svc/mailpit -n logpulse 8025:8025
  ```
* **MinIO Console (S3 storage admin):** `http://localhost:9001`
  ```bash
  kubectl port-forward svc/minio -n logpulse 9001:9001
  ```
* **Grafana Console (Observability dashboards):** `http://localhost:3000` (User: `admin` / Password: `admin`)
  ```bash
  kubectl port-forward deployment/prometheus-grafana -n monitoring 3000:3000
  ```
* **Cloudflare Tunnel URL:**
  Check the log of the `cloudflared` deployment to retrieve the temporary `.trycloudflare.com` URL:
  ```bash
  kubectl logs deployment/cloudflared -n logpulse | grep trycloudflare.com
  ```

---

## 🔄 CI/CD Pipelines

### 1. Test Environment (Non-Main Branches)
* **Workflow File:** `.github/workflows/ci.yml`
* **Runner:** GitHub-hosted (`ubuntu-latest`)
* **Behavior:** Automatically spins up a clean k3d cluster inside the runner, builds images, runs Postgres health checks (`pg_isready`), applies Alembic migrations, and tests the `/health` endpoint.

### 2. Production Environment (Main Branch)
* **Workflow File:** `.github/workflows/deploy.yml`
* **Runner:** Self-hosted (runs on your remote Ubuntu server)
* **Behavior:** Builds images directly on the host machine, imports them to the server's k3d cluster, and restarts the live services.
* **GitOps:** ArgoCD tracks modifications in the `k8s/` directory and synchronizes manifest changes directly into the server cluster.

---

## 🗺 Roadmap Progress

### Core Kubernetes Setup
* [x] **Step 5.1: Cluster Initialization & The Foundation** (Isolated namespace setup)
* [x] **Step 5.2: The Configuration Layer** (ConfigMaps & base64-encoded Secrets)
* [x] **Step 5.3: The Data Layer** (PostgreSQL, Redis, MinIO, Mailpit services & PVCs)
* [x] **Step 5.4: The Application Layer** (FastAPI backend, React frontend, Celery workers)
* [x] **Step 5.5: The Networking Layer** (Ingress routing, Path prefixes, local DNS)

### Advanced Infrastructure (Adventures)
* [x] **Adventure A: The Global Gateway (Cloudflare Tunnels)**
  * Configured Ingress path prefix routing for `/logpulse` to enable relative media URL resolution across public tunnels.
* [x] **Adventure B: The Assembly Line (CI/CD workflows)**
  * Created self-hosted production deployment workflow.
  * Created GitHub-hosted test environment workflow with Postgres readiness loops.
* [x] **Adventure C: The Watchtower (Prometheus & Grafana Observability)**
  * Instrumented backend API with `prometheus-fastapi-instrumentator` to expose `/metrics` endpoint.
  * Created resource-efficient Helm values config (`k8s/monitoring/values.yaml`) and `ServiceMonitor` CRD (`k8s/monitoring/servicemonitor.yaml`) to scrape application metrics.
* [x] **Adventure D: The Robot Administrator (GitOps with ArgoCD)**
