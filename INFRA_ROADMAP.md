# ☸️ LogPulse Kubernetes Infrastructure Roadmap

Welcome to **Phase 5: Local Kubernetes Orchestration**. 

As your Senior DevOps Mentor, I'm here to guide you through transitioning our LogPulse application from a simple Docker Compose setup to a robust, production-like Kubernetes (K8s) cluster. 

In the previous phases, Docker Compose was fantastic for local development. However, in a real-world production environment, we need a system that can automatically restart failed containers, scale them up during high traffic, and seamlessly route user requests. That is exactly what Kubernetes does—it's an **orchestrator**.

Before we dive in, let's review the **Golden Rules of our Infrastructure**:
1. **Stateless vs Stateful:** Our Python API, Celery Workers, and React Frontend are *stateless*. They hold no local data. We can destroy and recreate them infinitely. Our Database (PostgreSQL) and Object Storage (MinIO) are *stateful*. They need persistent storage (Volumes) so data survives pod restarts.
2. **Decoupled Configuration:** We will never hardcode passwords or URLs in our deployment files. Everything will be injected dynamically via K8s `ConfigMaps` (for non-sensitive data) and `Secrets` (for passwords).
3. **Internal vs External Traffic:** Services inside the cluster communicate freely via internal DNS. However, the outside world (the user's browser) will only be allowed in through a strictly controlled "front door" called an **Ingress**.

---

## 🗺️ Step-by-Step Execution Plan

We will proceed iteratively. We will not apply everything at once. I want you to understand the *why* before the *how*.

### Step 5.1: Cluster Initialization & The Foundation
First, we need a playground. We will spin up a local Kubernetes cluster.
- **Goal:** Install and start a local K8s cluster (using `k3d`, `kind`, or `minikube`).
- **Concept:** Understanding what a "Node" and the "Control Plane" are.
- **Action:** Create a dedicated K8s `Namespace` (e.g., `logpulse`) to isolate our resources from system-level components.

### Step 5.2: The Configuration Layer
Before we deploy any applications, we must provide their configuration.
- **Goal:** Migrate environment variables from `docker-compose.yml` into Kubernetes native formats.
- **Action:**
  - Create a `ConfigMap` for non-sensitive data (e.g., `SMTP_PORT`, `SMTP_SERVER`).
  - Create a `Secret` for sensitive data (e.g., `POSTGRES_PASSWORD`, `DATABASE_URL`).
- **Lesson:** Why we use base64 encoding in K8s Secrets and why external secret managers (like HashiCorp Vault) are used in real enterprises.

### Step 5.3: The Data Layer (Stateful Services)
We start from the bottom of the stack: the databases and storage. If the API starts before the database, it will crash.
- **Goal:** Deploy PostgreSQL, Redis, MinIO, and Mailpit.
- **Action:** 
  - Write `PersistentVolumeClaim` (PVC) manifests so K8s provisions virtual hard drives for our databases.
  - Write `Deployment` and `Service` manifests for each of these 4 components.
- **Lesson:** The lifecycle of a Pod vs the lifecycle of a Volume. Why `ClusterIP` services are essential for internal DNS resolution (e.g., how the API finds `db:5432`).

### Step 5.4: The Application Layer (Stateless Services)
Now we deploy our actual custom code.
- **Goal:** Deploy the FastAPI Backend, Celery Worker, Celery Beat, and the React Frontend.
- **Action:**
  - Write `Deployment` manifests for the `api`, `celery_worker`, `celery_beat`, and `frontend`.
  - Inject the `ConfigMap` and `Secret` we created in Step 5.2 into these pods as environment variables.
  - Define resource limits/requests (CPU/RAM) so one greedy pod doesn't crash our local machine.
- **Lesson:** The beauty of horizontal scaling. We will manually scale the `celery_worker` from 1 to 3 replicas to see how Kubernetes distributes the load.

### Step 5.5: The Networking Layer (Ingress)
Our services are running, but we can't access our frontend or API from our browser yet because they are sealed inside the cluster network.
- **Goal:** Expose the application to your local browser via a clean domain name (e.g., `http://logpulse.local`).
- **Action:**
  - Enable an Ingress Controller (like NGINX Ingress) on our local cluster.
  - Write an `Ingress` manifest that routes traffic:
    - Requests to `/api` go to the FastAPI Backend service.
    - All other requests `/` go to the React Frontend service.
  - Update your machine's `/etc/hosts` file to map `logpulse.local` to `127.0.0.1`.
- **Lesson:** The difference between `NodePort`, `LoadBalancer`, and `Ingress`.

---

## 🎓 The Educational Contract

As your mentor, I will **not** give you one giant YAML file with 1,000 lines of configuration. 

When you are ready to begin, simply tell me: **"Mentor, let's start with Step 5.1"**. I will explain the concepts for that specific step, provide you with a small, digestible snippet of code, and wait for you to apply and verify it before we move on.

Take a breath, and let's orchestrate!
