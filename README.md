# LogPulse

LogPulse is a daily habit journal (meditation, reading, sports, oral exercises). But really, it's an excuse to build a proper microservices application from scratch. 

I wanted to learn how to stick six different containers together without them breaking, so that's what this is: a training ground for modern backend architecture, DevOps, and frontend design.

---

## The Architecture

I didn't want a monolith. The app is split across six independent containers. 

1. **Frontend (`logpulse-frontend`)**: A React (Vite/TypeScript) SPA. We use Nginx to serve it.
2. **API Gateway (`logpulse-api`)**: Python FastAPI. It handles the business logic, JWT auth, and routing. It doesn't hold any state or local files.
3. **Database (`logpulse-db`)**: PostgreSQL. Holds all the user data, goals, and journal entries.
4. **Worker (`logpulse-worker`)**: A Celery worker. It runs the exact same Python codebase as the API but handles background jobs.
5. **Message Broker (`logpulse-redis`)**: Redis. This is how the API tells the Celery worker what to do.
6. **Object Storage (`logpulse-minio`)**: An S3-compatible MinIO server. We use this to store profile pictures and daily selfies.
7. **SMTP Server (`logpulse-mail`)**: Mailpit. It catches local transactional emails (like daily recaps) so we don't spam real inboxes while testing.

---

## Local Setup (Docker)

Everything runs through `docker-compose.yml`.

All the containers talk to each other on a custom bridge network (`logpulse-network`). We use Docker volumes for the database and MinIO so you don't lose your data every time you take the containers down. Configs and secrets live in `.env` files.

**The commands you actually need:**
- `docker compose up -d` : Start everything in the background.
- `docker compose logs -f api` : Watch the FastAPI logs.
- `docker compose restart frontend` : Kick the frontend container if you changed something and it stuck.

---

## How It Actually Works

### The Asynchronous Flow
If the app needs to send an email or do something heavy, the API doesn't make the user wait. It pushes a job to Redis and tells the user everything is fine. The Celery worker watches Redis, grabs the job, does the work, and sends the email through Mailpit.

### The Media Flow
When someone uploads a picture, we don't save it to the API server's local disk. The React frontend sends the image to the API, and the API streams it straight to MinIO using `boto3`. MinIO hands back a URL, and we save that URL in Postgres.

---

## Making Changes

### Adding a Feature
If you want to add something new, here is the order of operations:
1. **Database:** Add the column/table in `models.py`.
2. **Migration:** Run Alembic to upgrade the schema (see below).
3. **API Logic:** Update Pydantic schemas (`schemas.py`) and FastAPI endpoints (`routers/`).
4. **Frontend:** Update React to hit the new endpoint.

### Database Migrations
We use Alembic so we don't destroy the database every time we change a model.

Generate the migration:
```bash
docker compose exec api alembic revision --autogenerate -m "what changed"
```
Apply it:
```bash
docker compose exec api alembic upgrade head
```

---

## Design System
The frontend has a specific look, mostly defined in `index.css`. 
It uses a deep green canvas (`#00592B`) with stark white cards. Instead of typical soft UI shadows, we use thick 3px borders and hard block shadows (`6px 6px 0 #000000`). It's supposed to feel like physical exhibit signage or an arcade cabinet. We also rely heavily on the Oswald font to make headings look like actual posters.

## What's Next
The app works perfectly in local Docker. The next step is translating the `docker-compose` setup into Kubernetes manifests (Deployments, Services, ConfigMaps, Ingress) so it can run like a real cloud-native application.
