# Plateforme de mise en relation client / consultant

Application mobile multiplateforme permettant a un utilisateur de mener un entretien
avec un assistant IA, qui genere un rapport structure et l'oriente vers le consultant
certifie le mieux adapte (psychologie, nutrition, business, IT, relationnel).

## Stack technique

| Couche            | Technologie                          |
|-------------------|--------------------------------------|
| Mobile            | React Native (Expo)                  |
| Backend           | Spring Boot 3 (Java 21), REST        |
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

## Avancement (planning 3 semaines)

- [ ] Semaine 1 : fondations - auth, roles, CRUD des entites
- [ ] Semaine 2 : service IA, entretien, rapport, matching, parcours client
- [ ] Semaine 3 : backoffice, deploiement Docker, documentation, video

## Equipe

A completer : noms et repartition des roles.
