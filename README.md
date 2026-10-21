# Password Updation Tool — Angular Frontend

Angular frontend for a password management tool, built during my
cybersecurity studies. It is the UI of a three-part project:

- **password_updation_tool** (this repo) — Angular frontend
- **passwd-hmw** — Node.js backend
- **password_security_db** — PostgreSQL functions

## What it does

- Change-password flow (src/app/components/change-password)
- Service layer (src/app/pass-services.service.ts) that talks to the
  Node.js backend through a dev proxy (proxy.conf.json)
- Password hashing/encryption handling with bcryptjs and crypto-js
- UI built with PrimeNG and Bootstrap

## Stack

Angular 14, TypeScript, PrimeNG, Bootstrap, RxJS

## Run it

npm install, then `ng serve` and open http://localhost:4200/ — the app
expects the Node.js backend to be reachable through the proxy.
