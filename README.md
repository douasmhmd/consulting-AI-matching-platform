# Plateforme de mise en relation client / consultant assistée par IA

Plateforme où un **assistant IA** mène un entretien approfondi avec l'utilisateur, génère un **rapport structuré**, puis l'oriente vers le **consultant certifié** le mieux adapté. Le rapport est transmis au consultant avant le rendez-vous — c'est la valeur ajoutée qui distingue la plateforme d'une marketplace classique.

**Disciplines couvertes :** psychologie, nutrition, business, IT, relationnel.

> L'IA **oriente** mais ne diagnostique ni ne prescrit jamais. Un filet de sécurité (détection de détresse, ressources d'urgence) est intégré. La plateforme ne cible pas les mineurs.

---

## Architecture

Architecture **microservices** REST. Chaque service est indépendant, conteneurisé, et communique via un JWT applicatif partagé. Un API Gateway sert de point d'entrée unique.

```
                          ┌─────────────────┐
        Client mobile ──► │  API Gateway    │ :8080
        Backoffice    ──► │  (point unique) │
                          └────────┬────────┘
            ┌──────────────┬───────┼───────┬──────────────┐
            ▼              ▼       ▼        ▼              ▼
       service-user  consultant  appoint.  ai        notification
         :8081        :8082      :8083    :8084         :8085
            └──────────────┴───────┬───────┴──────────────┘
                                   ▼
                              MongoDB :27017
```

---

## Stack technique

| Couche            | Technologie                          |
|-------------------|--------------------------------------|
| Mobile            | React Native (Expo)                  |
| Backend           | Spring Boot 4 (Java 21), REST        |
| Backoffice        | Angular 17 PWA                       |
| Base de données   | MongoDB 7                            |
| Authentification  | Firebase Authentication + JWT        |
| Notifications     | Firebase Cloud Messaging             |
| IA                | API OpenAI (entretien, rapport)      |
| Conteneurisation  | Docker / Docker Compose / Kubernetes |
| Documentation API | Swagger / OpenAPI                    |

---

## Rôles utilisateurs

- **ADMIN** — gère la plateforme, valide les consultants.
- **CLIENT** — mène l'entretien IA, reçoit un rapport, réserve un rendez-vous.
- **CONSULTANT** — gère son profil, consulte son calendrier et les rapports de ses clients.

---

## Structure du dépôt

```
consulting-platform/
├── backend/                   Microservices Spring Boot
│   ├── api-gateway/           Point d'entrée unique, routage (:8080)
│   ├── service-user/          Comptes, rôles, authentification (:8081)
│   ├── service-consultant/    Annuaire consultants, validation (:8082)
│   ├── service-appointment/   Créneaux et réservations (:8083)
│   ├── service-ai/            Entretien IA, rapport, matching (:8084)
│   └── service-notification/  Push FCM et historique (:8085)
├── mobile/                    Application React Native
├── backoffice/                Application Angular PWA
├── deployment/
│   ├── docker/                docker-compose.yml + Dockerfiles
│   └── kubernetes/            Manifests K8s
└── docs/                      Documentation technique
```

---

## Ports et documentation des services

| Service              | Port | Swagger                                  |
|----------------------|------|------------------------------------------|
| API Gateway          | 8080 | point d'entrée unique                    |
| Service Utilisateur  | 8081 | http://localhost:8081/swagger-ui.html    |
| Service Consultant   | 8082 | http://localhost:8082/swagger-ui.html    |
| Service Rendez-vous  | 8083 | http://localhost:8083/swagger-ui.html    |
| Service IA           | 8084 | http://localhost:8084/swagger-ui.html    |
| Service Notification | 8085 | http://localhost:8085/swagger-ui.html    |

Via la gateway, tous les services sont accessibles sur le port **8080** (ex. `http://localhost:8080/api/users/health`).

---

## Flux d'authentification

1. Le mobile authentifie l'utilisateur via **Firebase** → obtient un `idToken`.
2. Le `idToken` est envoyé au **Service Utilisateur** (`/api/auth/register` ou `/api/auth/login`).
3. Le backend vérifie le token Firebase et délivre un **JWT applicatif** (contient `userId` et `role`).
4. Ce JWT est envoyé dans l'en-tête `Authorization: Bearer <jwt>` à tous les services.
5. Chaque service vérifie le JWT localement (clé secrète partagée).

---

## Configuration des secrets (obligatoire)

Ces fichiers ne sont **pas** versionnés (voir `.gitignore`). Chaque développeur doit les créer localement.

**1. Clé Firebase** — placer le fichier dans chaque service qui utilise Firebase (`service-user`, `service-notification`) :
```
backend/service-user/src/main/resources/firebase-service-account.json
```
À récupérer depuis : Console Firebase → Paramètres du projet → Comptes de service → Générer une nouvelle clé privée.

**2. Variables d'environnement** — créer `deployment/docker/.env` :
```env
MONGO_USER=admin
MONGO_PASSWORD=admin
OPENAI_API_KEY=votre_cle_openai
```

> ⚠️ Ne jamais committer une clé API. Le fichier doit s'appeler exactement `.env` (pas `.env.txt`).

---

## Démarrage rapide

### Prérequis
Docker & Docker Compose, Java 21, Node.js 22+ (pour mobile/backoffice).

### Option A — Tout lancer avec Docker (recommandé)

```bash
cd deployment/docker
docker compose up --build -d
```

Cette commande construit et démarre les **7 conteneurs** (MongoDB + 5 microservices + gateway). Vérifier :

```bash
docker ps
curl http://localhost:8080/api/users/health
```

### Option B — Lancer service par service (développement)

Lancer MongoDB via Docker, puis chaque service depuis l'IDE :
```bash
cd deployment/docker
docker compose up -d mongodb
```

### Mobile et Backoffice

```bash
cd mobile && npm install && npm start
cd backoffice && npm install && ng serve
```

> Sur émulateur Android, `localhost` ne pointe pas vers le PC hôte. Utiliser `http://10.0.2.2:8080` ; sur téléphone réel, l'IP locale de la machine (`http://192.168.x.x:8080`).

---

## Commandes Docker utiles

| Action                       | Commande                          |
|------------------------------|-----------------------------------|
| Lancer (images existantes)   | `docker compose up -d`            |
| Lancer + reconstruire        | `docker compose up --build -d`    |
| État des conteneurs          | `docker ps`                       |
| Logs d'un service            | `docker compose logs service-ai`  |
| Arrêter                      | `docker compose down`             |

---

## Parcours fonctionnel (cœur de la plateforme)

1. Le client démarre un **entretien** : `POST /api/ai/interviews`
2. Il échange avec l'IA : `POST /api/ai/interviews/{id}/messages`
3. L'IA génère un **rapport** + recommande une discipline : `POST /api/ai/interviews/{id}/report`
4. **Matching** : `GET /api/ai/interviews/{id}/matching` propose des consultants approuvés de la discipline (appel inter-service vers le Service Consultant)
5. Le client **réserve** un rendez-vous : `POST /api/appointments`
6. Le consultant **confirme** et reçoit le rapport avant la séance.

---

## Avancement

### Backend — terminé et testé
- [x] Service Utilisateur (auth Firebase + JWT, rôles)
- [x] Service Consultant (annuaire, validation admin)
- [x] Service Rendez-vous (créneaux, réservations, statuts)
- [x] Service IA (entretien guidé, rapport, matching inter-service)
- [x] Service Notification (tokens FCM, envoi, historique)
- [x] API Gateway (routage, point d'entrée unique)
- [x] Documentation Swagger sur tous les services
- [x] Déploiement Docker complet (7 conteneurs orchestrés)

### En cours / à venir
- [ ] Application mobile React Native
- [ ] Backoffice Angular PWA
- [ ] Déploiement Kubernetes

---

## Équipe

- **DOUAS MOHAMED** — AI / IT engineer
- **BOULAHJOUR OMAR** — IT engineer / Games developer