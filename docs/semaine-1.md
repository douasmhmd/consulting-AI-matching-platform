# Semaine 1 - Fondations

Objectif de fin de semaine : un utilisateur peut s'inscrire et se connecter, les
3 roles fonctionnent, et le CRUD des entites principales (utilisateurs, consultants,
rendez-vous) tourne et se teste via Swagger. Aucune fonctionnalite IA cette semaine.

## Repartition suggeree (4 personnes)

- Dev A : backend - Service Utilisateur + securite (Firebase, JWT, roles)
- Dev B : backend - Service Consultant + Service Rendez-vous
- Dev C : mobile - initialisation Expo, ecrans connexion / inscription
- Dev D : infra - depot Git, MongoDB, Docker, squelette backoffice Angular

## Jours 1-2 : mise en place

Toute l'equipe :
- Creer le depot Git distant, cloner le squelette fourni.
- Mettre en place l'outil de suivi de taches (GitHub Projects ou Trello).
- Convenir des conventions : nommage des branches, messages de commit.

Infra (Dev D) :
- Lancer MongoDB via `docker compose up -d mongodb`.
- Verifier la connexion avec MongoDB Compass.
- Creer la base `consulting` et les 7 collections (vides) : users, consultants,
  disciplines, conversations, reports, appointments, notifications.
- Initialiser le projet Angular dans `/backoffice` (`ng new`).

Backend (Dev A et B) :
- Generer les squelettes Spring Boot via start.spring.io pour service-user,
  service-consultant, service-appointment.
- Dependances : Spring Web, Spring Data MongoDB, Spring Security, Lombok, Validation.
- Verifier que chaque service demarre et se connecte a MongoDB.

Mobile (Dev C) :
- Initialiser le projet Expo dans `/mobile` (`npx create-expo-app`).
- Mettre en place la navigation (React Navigation) et la structure des ecrans.

## Jours 3-5 : authentification et Service Utilisateur

Dev A - Service Utilisateur :
- Configurer un projet Firebase, activer Authentication (email/password).
- Implementer le modele `User` (voir doc modele de donnees).
- Endpoints : POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout,
  GET /api/users/me, PUT /api/users/me, GET /api/users (admin),
  PUT /api/users/{id}/status (admin).
- Verification du token Firebase cote backend, generation du JWT applicatif.
- Filtre de securite : controle du JWT et du role sur chaque requete protegee.
- Exposer Swagger (springdoc-openapi).

Dev B - Service Consultant :
- Modeles `Consultant` et `Discipline`.
- Endpoints CRUD : POST/GET/PUT /api/consultants, GET /api/consultants/{id},
  gestion des disponibilites, PUT /api/consultants/{id}/status (admin).
- Inserer manuellement 2 disciplines de test : PSYCHOLOGY et NUTRITION.

Mobile (Dev C) :
- Ecrans connexion et inscription, branches sur Firebase Auth.
- Stockage securise du JWT, gestion de la session.

## Jours 6-7 : Service Rendez-vous et integration

Dev B - Service Rendez-vous :
- Modele `Appointment`.
- Endpoints CRUD : POST /api/appointments, GET par client, GET par consultant,
  PUT /api/appointments/{id}/status.

Infra (Dev D) :
- Rediger les Dockerfiles des 3 services backend.
- Verifier le `docker compose up` complet (hors IA et notification).

Toute l'equipe :
- Test d'integration : inscription d'un client depuis le mobile, verification
  en base, connexion, appel d'un endpoint protege.

## Definition of Done - fin de Semaine 1

- [ ] Depot Git en place, structure respectee, suivi de taches actif
- [ ] MongoDB operationnel avec les 7 collections
- [ ] Inscription et connexion fonctionnelles (Firebase + JWT)
- [ ] Les 3 roles sont geres et controles
- [ ] CRUD utilisateurs, consultants, rendez-vous testable via Swagger
- [ ] 2 disciplines de test inserees
- [ ] Ecrans mobile de connexion / inscription operationnels
- [ ] Les services backend demarrent sous Docker

## Pieges a eviter

- Ne pas commencer l'IA cette semaine, meme si c'est tentant.
- Ne pas commiter de cle API ou de fichier de secret (verifier .gitignore).
- Faire un point d'equipe court chaque jour : qui fait quoi, qui est bloque.
- Si retard en fin de semaine, prioriser l'auth et le Service Utilisateur ;
  le reste peut glisser au debut de la Semaine 2.
