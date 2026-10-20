# 2. Python (3.13) backend, Angular frontend

Status: accepted

## Context
The original spec defaulted to Node.js Lambdas for shared types with the frontend.
The owner prefers Python for the backend and Angular for the frontend.

## Decision
- Backend: AWS Lambda on Python 3.13, `boto3`, Powertools for AWS Lambda.
- Frontend: Angular (standalone components, signals), static build served from S3 + CloudFront.
- Types are not shared at compile time. The API contract is an OpenAPI document
  in `packages/contracts/`, from which TypeScript client types are generated.

## Consequences
Loses free type sharing; gains an explicit, reviewable API contract.
