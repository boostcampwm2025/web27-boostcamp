# web27-boostcamp

## Deploy (GitHub Actions)

### Branch gating
- 기본 배포 브랜치: `feature/deploy`
- GitHub 설정에서 `DEPLOY_BRANCH` Actions Variable을 만들면(예: `main`) 프론트/백 배포 워크플로우가 그 브랜치에서만 동작합니다.
- 수동 재실행이 필요하면 각 워크플로우의 `workflow_dispatch`로 실행 가능합니다.

### Frontend
- Workflow: `.github/workflows/front-deploy.yml`
- Trigger: push to `DEPLOY_BRANCH`(default: `feature/deploy`)
- Required Secrets:
  - `NCP_ACCESS_KEY`, `NCP_SECRET_KEY`, `NCP_BUCKET`
- Notes:
  - NCP Object Storage 호환 이슈로 `awscli==1.15.85`(v1)로 업로드합니다.

### Backend
- Workflow: `.github/workflows/back-deploy.yml`
- Trigger: push to `DEPLOY_BRANCH`(default: `feature/deploy`) (backend/nginx/compose 변경 시)
- Required Secrets:
  - `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `DEPLOY_PATH`
  - Optional: `DEPLOY_PORT` (default: 22)
  - `NCR_ENDPOINT` (예: `kr.ncr.ntruss.com`, 프로토콜 없이)
  - `NCP_ACCESS_KEY`, `NCP_SECRET_KEY` (NCR docker login 용)
- Server prerequisites:
  - `docker` + `docker compose`(or `docker-compose`) 설치
  - repo가 `DEPLOY_PATH`에 clone 되어 있고 `DEPLOY_BRANCH` 브랜치를 pull 할 수 있어야 함(Compose 파일 동기화)
  - `NCR_ENDPOINT`에 대해 `docker login`/`docker pull` 가능해야 함
- Notes:
  - CI가 NCR에 `boostad/backend:sha`와 `boostad/nginx:sha`(그리고 `:deploy`)로 push하고 서버는 pull+up 합니다.
