# Demo Checklist

[English](#english) | [한국어](#한국어)

<a id="english"></a>

## English

Use this checklist before recording screenshots or sharing the project demo.

### Safety

- Rotate any local secrets that were exposed in screenshots or screen sharing.
- Keep `.env` files, terminal env output, database consoles, and provider
  dashboards out of screenshots.
- Use paper-trading data only. Do not show real brokerage accounts or personal
  financial data.

### Local Run

1. Start PostgreSQL from the repository root:
   `docker compose up -d postgres`
2. Start the backend from `apps/api`:
   `uvicorn marketpilot_api.main:app --reload`
3. Start the frontend from `apps/web`:
   `npm run dev`
4. Open `http://localhost:3000/ko`.

### Demo Path

1. Sign in or use the local authenticated flow prepared for development.
2. Open `/ko/portfolio`.
3. Confirm portfolio summary cards, holdings, quote source metadata, FX badges,
   cash activity, and paper order history.
4. Open `/ko/markets`.
5. Confirm market data cards and quote-provider information.
6. Open `/ko/backtests`.
7. Run the default simulation.
8. Change stop-loss, slippage, execution timing, and allocation values, then run
   the simulation again.
9. Confirm the assumption summary, allocation report, risk diagnostics, charts,
   benchmark comparison, and fixture trade history.
10. Repeat the key screens at a mobile width before taking screenshots.

### Screenshot Candidates

- Portfolio overview with holdings and quote source metadata.
- Portfolio mobile view showing current-price source text.
- Market data or quote-provider view.
- Backtest result screen with assumptions and risk diagnostics.
- Backtest mobile view.

### Known Limits

- Backtest results are deterministic UI fixtures, not historical market
  calculations.
- Some market-data provider paths are still fixture or local-development
  oriented.
- No real-money brokerage integration is included.
- AWS deployment and production observability are not part of the current demo.

---

<a id="한국어"></a>

## 한국어

스크린샷을 찍거나 프로젝트 데모를 공유하기 전에 이 체크리스트를 사용합니다.

### 안전 확인

- 스크린샷이나 화면 공유에 노출된 로컬 비밀값은 먼저 교체합니다.
- `.env` 파일, 터미널 env 출력, DB 콘솔, provider dashboard는 스크린샷에
  나오지 않게 합니다.
- 모의투자 데이터만 보여줍니다. 실제 증권 계좌나 개인 금융 데이터는 보여주지
  않습니다.

### 로컬 실행

1. repository root에서 PostgreSQL을 실행합니다:
   `docker compose up -d postgres`
2. `apps/api`에서 백엔드를 실행합니다:
   `uvicorn marketpilot_api.main:app --reload`
3. `apps/web`에서 프론트엔드를 실행합니다:
   `npm run dev`
4. `http://localhost:3000/ko`를 엽니다.

### 데모 순서

1. 로그인하거나 로컬 개발용 인증 흐름을 사용합니다.
2. `/ko/portfolio`를 엽니다.
3. 포트폴리오 요약 카드, 보유 종목, 현재가 출처, FX 배지, 현금 활동, 모의주문
   내역을 확인합니다.
4. `/ko/markets`를 엽니다.
5. 시장 데이터 카드와 quote provider 정보를 확인합니다.
6. `/ko/backtests`를 엽니다.
7. 기본값으로 시뮬레이션을 실행합니다.
8. 손절, 슬리피지, 체결 시점, 종목 비중 값을 바꾼 뒤 다시 실행합니다.
9. 사용 가정 요약, 종목 비중 리포트, 리스크 진단, 차트, 벤치마크 비교, fixture
   거래 내역을 확인합니다.
10. 스크린샷을 찍기 전 핵심 화면을 모바일 폭에서도 한 번 확인합니다.

### 스크린샷 후보

- 현재가 출처가 보이는 포트폴리오 overview 화면
- 현재가 출처 텍스트가 보이는 포트폴리오 모바일 화면
- 시장 데이터 또는 quote provider 화면
- 사용 가정과 리스크 진단이 보이는 백테스트 결과 화면
- 백테스트 모바일 화면

### 현재 제한사항

- 백테스트 결과는 과거 시장 데이터 계산이 아니라 결정적인 UI fixture입니다.
- 일부 시장 데이터 provider 흐름은 아직 fixture 또는 로컬 개발 중심입니다.
- 실제 자금을 사용하는 증권사 연동은 포함되어 있지 않습니다.
- AWS 배포와 production observability는 현재 데모 범위가 아닙니다.
