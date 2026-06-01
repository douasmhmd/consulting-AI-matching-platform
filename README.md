# Plateforme de mise en relation client / consultant

Application mobile multiplateforme permettant a un utilisateur de mener un entretien
avec un assistant IA, qui genere un rapport structure et l'oriente vers le consultant
certifie le mieux adapte (psychologie, nutrition, business, IT, relationnel).

## Stack technique

| Couche            | Technologie                          |
|-------------------|--------------------------------------|
| Mobile            | React Native (Expo)                  |
| Backend           | Spring Boot 4 (Java 21), REST        |
| Backoffice        | Angular 17 PWA                       |
| Base de donnees   | MongoDB 7                            |
| Authentification  | Firebase Authentication + JWT        |
| Notifications     | Firebase Cloud Messaging             |
| IA                | API OpenAI (entretien, rapport)      |
| Conteneurisation  | Docker / Docker Compose / Kubernetes |

## Structure du depot

```
consulting-platform/
  backend/              Microservices Spring Boot
    api-gateway/        Point d'entree unique, routage, JWT
    service-user/       Comptes, roles, profils
    service-consultant/ Annuaire consultants, disponibilites
    service-appointment/ Creneaux et reservations
    service-ai/         Entretien IA, rapport, matching
    service-notification/ Push et rappels
  mobile/               Application React Native
  backoffice/           Application Angular PWA
  deployment/
    docker/             Dockerfiles
    kubernetes/         Manifests K8s
  docs/                 Documentation technique
```

## Roles utilisateurs

- ADMIN : super-role, gere toute la plateforme, valide les consultants.
- CLIENT : mene l'entretien IA, recoit un rapport, reserve un rendez-vous.
- CONSULTANT : consulte son calendrier, le tableau de ses clients et leurs rapports.

## Configuration des secrets (obligatoire)

Ces fichiers ne sont PAS versionnes (voir .gitignore). Chaque developpeur doit les creer localement.

**1. Cle Firebase** — placer le fichier dans :
```
backend/service-user/src/main/resources/firebase-service-account.json
```
A recuperer depuis : Console Firebase > Parametres du projet > Comptes de service > Generer une nouvelle cle privee.

**2. Variables d'environnement** — creer `deployment/docker/.env` :
```env
MONGO_USER=admin
MONGO_PASSWORD=admin
OPENAI_API_KEY=votre_cle_openai
```

## Demarrage rapide (developpement local)

Prerequis : Docker, Node.js 22+, Java 21, MongoDB (ou via Docker Compose).

```bash
# Lancer MongoDB et les services
cd deployment/docker
docker compose up -d

# Mobile
cd ../../mobile
npm install && npm start

# Backoffice
cd ../backoffice
npm install && ng serve
```
## Ports des services

| Service              | Port | Swagger                              |
|----------------------|------|--------------------------------------|
| API Gateway          | 8080 | -                                    |
| Service Utilisateur  | 8081 | http://localhost:8081/swagger-ui.html |
| Service Consultant   | 8082 | http://localhost:8082/swagger-ui.html |
| Service Rendez-vous  | 8083 | http://localhost:8083/swagger-ui.html |
| Service IA           | 8084 | a venir                              |
| Service Notification | 8085 | a venir                              |

## Avancement (planning 3 semaines)

- [ ] Semaine 1 : fondations - auth, roles, CRUD des entites
- [ ] Semaine 2 : service IA, entretien, rapport, matching, parcours client
- [ ] Semaine 3 : backoffice, deploiement Docker, documentation, video

## Avancement

### Semaine 1 : fondations
- [x] Service Utilisateur (auth Firebase + JWT, roles)
- [x] Service Consultant (annuaire, validation admin)
- [x] Service Rendez-vous (creneaux, reservations, statuts)
- [x] Documentation Swagger

### Semaine 2 : intelligence et parcours
- [ ] Service IA (entretien, rapport, matching)
- [ ] Service Notification
- [ ] API Gateway
- [ ] Parcours client mobile

### Semaine 3 : finalisation
- [ ] Backoffice Angular
- [ ] Deploiement Docker complet / Kubernetes
- [ ] Documentation technique et video de demo

## Equipe
DOUAS MOHAMED (AI/IT engineer)/ BOULAHJOUR OMAR (IT engineer/Games dev )
