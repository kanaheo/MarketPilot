# AWS Roadmap

[English](#english) | [한국어](#한국어)

<a id="english"></a>

## English

MarketPilot's AWS track is a career-focused modernization path. The goal is to
move the existing Next.js, FastAPI, and PostgreSQL application toward AWS in
small steps that can be explained in interviews.

## Current Readiness

Status: Planning started

- Frontend exists at `apps/web`.
- Backend exists at `apps/api`.
- GitHub Actions already has a web CI workflow.
- Docker files are not added yet.
- Terraform files are not added yet.
- AWS resources are not created yet.
- Secrets must stay outside source code.

## Why Start With This Document?

Cloud work becomes confusing when the project jumps straight to AWS resources.
This document keeps the order simple:

1. understand the current app
2. run it locally with Docker
3. define AWS infrastructure with Terraform
4. deploy one service at a time
5. document the decisions for portfolio and interview use

## Key Concepts

- Docker packages the app so it can run the same way on a laptop, CI, and AWS.
- Docker Compose runs multiple local containers together, such as web, api, and
  PostgreSQL.
- Terraform describes AWS infrastructure as code instead of relying on manual
  console clicks.
- ECR stores Docker images inside AWS.
- ECS Fargate runs Docker containers without managing EC2 servers directly.
- ALB receives internet traffic and forwards it to the backend service.
- RDS provides managed PostgreSQL.
- Secrets Manager stores database passwords and other sensitive values outside
  application code.
- CloudWatch stores logs and metrics for debugging and operations.
- GitHub OIDC lets GitHub Actions deploy to AWS without hard-coded access keys.

## Step-by-Step Plan

### Step 1 - Readiness Checklist

Goal: understand the repository before changing infrastructure.

- identify frontend, backend, database, CI, and docs locations
- list missing Docker and AWS files
- decide the first safe deployment path

Exit: the repository has a clear AWS learning roadmap.

### Step 2 - Local Docker Baseline

Goal: run the application with containers before AWS.

- add a FastAPI Dockerfile
- add a Next.js Dockerfile
- add a local Docker Compose file
- run PostgreSQL locally through Docker Compose
- document local container commands

Exit: web, api, and database can run locally with Docker.

### Step 3 - First Terraform Baseline

Goal: create simple, understandable infrastructure code.

- add Terraform provider configuration
- add shared naming and tags
- prepare a dev environment folder
- avoid expensive services by default

Exit: Terraform can run `fmt` and `validate` locally.

### Step 4 - Container Registry

Goal: prepare AWS image storage.

- create ECR repositories for web and api images
- document image build and push flow
- keep AWS credentials out of source code

Exit: Docker images can be pushed to ECR.

### Step 5 - Backend Deployment

Goal: deploy FastAPI first because it is the main server boundary.

- create ECS Fargate task and service
- connect the service to an ALB
- expose a health endpoint through the load balancer
- send logs to CloudWatch

Exit: the FastAPI health endpoint is reachable from the internet.

### Step 6 - Database Deployment

Goal: connect the backend to PostgreSQL safely.

- create RDS PostgreSQL only after budget alerts are ready
- keep database in private subnets
- allow access only from the backend security group
- store secrets in AWS Secrets Manager
- document migration flow

Exit: the backend can connect to RDS without exposing the database publicly.

### Step 7 - Frontend Deployment

Goal: deploy the Next.js frontend.

- choose ECS, Amplify, or CloudFront/S3 based on Next.js requirements
- configure frontend environment variables
- connect frontend requests to the AWS backend URL

Exit: a reviewer can use the deployed web application.

### Step 8 - CI/CD

Goal: automate repeatable deployment.

- keep existing CI checks
- add Docker build checks
- use GitHub OIDC for AWS deployment
- avoid long-lived AWS access keys

Exit: GitHub Actions can deploy without hard-coded cloud credentials.

### Step 9 - Portfolio Documentation

Goal: make the project explainable in interviews.

- document architecture decisions
- document security decisions
- document cost controls
- add diagrams and screenshots
- prepare interview talking points

Exit: the repository explains both the app and the cloud architecture.

---

<a id="한국어"></a>

## 한국어

MarketPilot의 AWS 트랙은 전직을 위한 modernization 학습 경로입니다. 목표는
기존 Next.js, FastAPI, PostgreSQL 앱을 작고 설명 가능한 단계로 AWS에 옮기는
것입니다.

## 현재 준비 상태

상태: 계획 시작

- Frontend는 `apps/web`에 있습니다.
- Backend는 `apps/api`에 있습니다.
- GitHub Actions에는 이미 web CI workflow가 있습니다.
- Docker 파일은 아직 추가하지 않았습니다.
- Terraform 파일은 아직 추가하지 않았습니다.
- AWS 리소스는 아직 만들지 않았습니다.
- Secret은 source code에 넣지 않습니다.

## 왜 이 문서부터 시작하나?

Cloud 작업은 AWS resource부터 바로 만들면 금방 헷갈립니다. 이 문서는 순서를
단순하게 유지합니다.

1. 현재 app 구조를 이해한다.
2. Docker로 로컬 실행을 맞춘다.
3. Terraform으로 AWS infrastructure를 정의한다.
4. service를 하나씩 배포한다.
5. portfolio와 면접에서 설명할 decision을 문서화한다.

## 핵심 개념

- Docker는 app을 하나의 실행 상자로 포장해서 local, CI, AWS에서 비슷하게
  실행할 수 있게 해줍니다.
- Docker Compose는 web, api, PostgreSQL처럼 여러 container를 로컬에서 같이
  실행해줍니다.
- Terraform은 AWS console에서 손으로 누르는 대신 infrastructure를 code로
  관리하게 해줍니다.
- ECR은 AWS 안에 Docker image를 저장하는 곳입니다.
- ECS Fargate는 EC2 server를 직접 관리하지 않고 Docker container를 실행하는
  서비스입니다.
- ALB는 인터넷 요청을 받아 backend service로 보내는 입구입니다.
- RDS는 AWS가 관리해주는 PostgreSQL입니다.
- Secrets Manager는 database password 같은 민감한 값을 application code 밖에
  보관합니다.
- CloudWatch는 log와 metric을 저장해서 장애 확인과 운영에 씁니다.
- GitHub OIDC는 GitHub Actions가 AWS access key를 hard coding하지 않고
  배포할 수 있게 해줍니다.

## 단계별 계획

### 1단계 - 준비 상태 점검

목표: infrastructure를 바꾸기 전에 현재 Repository를 이해합니다.

- frontend, backend, database, CI, docs 위치 확인
- 부족한 Docker 및 AWS 파일 목록 정리
- 첫 번째로 안전한 배포 경로 결정

완료 조건: Repository에 명확한 AWS 학습 로드맵이 있다.

### 2단계 - 로컬 Docker 기준선

목표: AWS 전에 container로 app을 실행합니다.

- FastAPI Dockerfile 추가
- Next.js Dockerfile 추가
- local Docker Compose 파일 추가
- PostgreSQL을 Docker Compose로 실행
- local container 명령어 문서화

완료 조건: web, api, database를 Docker로 로컬 실행할 수 있다.

### 3단계 - 첫 Terraform 기준선

목표: 단순하고 이해 가능한 infrastructure code를 만듭니다.

- Terraform provider 설정 추가
- 공통 naming과 tag 준비
- dev environment 폴더 준비
- 비용이 큰 service는 기본값에서 제외

완료 조건: Terraform에서 `fmt`와 `validate`를 로컬 실행할 수 있다.

### 4단계 - Container Registry

목표: AWS에 Docker image 저장소를 준비합니다.

- web과 api용 ECR repository 생성
- image build 및 push 흐름 문서화
- AWS credential은 source code 밖에서 관리

완료 조건: Docker image를 ECR에 push할 수 있다.

### 5단계 - Backend 배포

목표: server boundary인 FastAPI를 먼저 배포합니다.

- ECS Fargate task와 service 생성
- service를 ALB에 연결
- load balancer를 통해 health endpoint 공개
- CloudWatch로 log 전송

완료 조건: FastAPI health endpoint를 인터넷에서 확인할 수 있다.

### 6단계 - Database 배포

목표: Backend를 PostgreSQL에 안전하게 연결합니다.

- budget alert 준비 후 RDS PostgreSQL 생성
- database는 private subnet에 배치
- backend security group에서만 database 접근 허용
- secret은 AWS Secrets Manager에 저장
- migration 실행 흐름 문서화

완료 조건: database를 public에 노출하지 않고 backend가 RDS에 연결된다.

### 7단계 - Frontend 배포

목표: Next.js frontend를 배포합니다.

- Next.js 요구사항에 따라 ECS, Amplify, CloudFront/S3 중 선택
- frontend environment variable 설정
- frontend 요청을 AWS backend URL에 연결

완료 조건: 리뷰어가 배포된 web app을 사용할 수 있다.

### 8단계 - CI/CD

목표: 반복 가능한 배포를 자동화합니다.

- 기존 CI check 유지
- Docker build check 추가
- AWS 배포에는 GitHub OIDC 사용
- 오래 유지되는 AWS access key 사용 회피

완료 조건: GitHub Actions가 hard-coded cloud credential 없이 배포할 수 있다.

### 9단계 - Portfolio 문서화

목표: 면접에서 설명 가능한 프로젝트로 만듭니다.

- architecture decision 문서화
- security decision 문서화
- cost control 문서화
- diagram과 screenshot 추가
- interview talking point 준비

완료 조건: Repository가 app과 cloud architecture를 함께 설명한다.
