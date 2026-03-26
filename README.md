# Luftschmaus-Webapp

Webanwendung der fiktiven Luftschmaus GmbH. Dient als Beispielprojekt zur Demonstration einer containerisierten CI/CD-Pipeline mit GitOps-Deployment auf Kubernetes.

Das zugehörige Infrastruktur-Repository mit CI/CD-Pipeline und Installationsanleitung: [luftschmaus-infra](https://github.com/hansdoebel/luftschmaus-infra)

## Setup

```sh
bun install
```

## Development

Frontend-Dev-Server starten (mit API-Proxy zum Backend):

```sh
cd frontend && bun run dev
```

Backend starten:

```sh
cd backend && bun run start
```

## Tests

```sh
cd backend && bun run test
cd frontend && bun run test
```

## Linting

```sh
bun run lint
```
