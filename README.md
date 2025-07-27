# 보조 배터리 기내 반입 가능 품목

🔋 항공기 기내 보조배터리 반입 규정과 허용 품목을 확인할 수 있는 정적 웹사이트입니다.

## 🌟 주요 기능

- **배터리 데이터베이스**: 다양한 브랜드의 보조배터리 정보
- **실시간 검색**: 브랜드명, 모델명, 주의사항 검색
- **스마트 필터링**: 반입 가능 여부, 용량 범위별 필터
- **Wh 계산기**: mAh와 전압으로 Wh 자동 계산
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **다크모드 지원**: 시스템 설정에 따른 자동 테마

## 📊 제공 정보

각 배터리별로 다음 정보를 제공합니다:

- 브랜드 및 모델명
- 용량 (mAh)
- 전압 (V)
- 전력량 (Wh)
- 기내 반입 가능 여부
- 수량 제한
- 주의사항 (항공사별/국가별 특징)

## 🛡️ 규정 기준

**IATA/ICAO 국제 표준 기준**
- 100Wh 이하: 기내 반입 가능 (최대 5개)
- 100-160Wh: 항공사 승인 시 2개까지
- 160Wh 초과: 반입 불가

**2025년 강화된 규정**
- 좌석 위 선반(오버헤드빈) 보관 금지
- 개별 포장 의무화
- 기내 USB 포트 직접 충전 금지

## 🚀 GitHub Pages 배포

### 자동 배포 설정

1. GitHub 저장소 생성
2. 파일 업로드
3. Settings > Pages에서 Source를 "Deploy from a branch" 선택
4. Branch를 "main" 선택
5. 몇 분 후 `https://username.github.io/repository-name`에서 접속 가능

### 커스텀 도메인 (선택사항)

CNAME 파일을 생성하고 도메인을 입력하여 커스텀 도메인 사용 가능

## 🛠️ 기술 스택

- **HTML5**: 시맨틱 마크업, 접근성 고려
- **CSS3**: Grid/Flexbox, CSS Variables, 반응형 디자인
- **Vanilla JavaScript**: 경량화된 클라이언트 사이드 처리
- **JSON**: 구조화된 배터리 데이터

## 📁 프로젝트 구조

```
battery-carry-on/
├── index.html          # 메인 페이지
├── styles.css          # 스타일시트
├── script.js           # JavaScript 로직
├── data/
│   └── batteries.json  # 배터리 데이터
└── README.md           # 프로젝트 문서
```

## 🔧 로컬 개발

```bash
# 저장소 클론
git clone https://github.com/username/battery-carry-on.git

# 로컬 서버 실행 (Python 3)
cd battery-carry-on
python -m http.server 8000

# 브라우저에서 접속
# http://localhost:8000
```

## 📱 사용법

1. **검색**: 상단 검색창에 브랜드명이나 모델명 입력
2. **필터**: 반입 가능 여부나 용량 범위로 필터링
3. **계산**: Wh 계산기로 소유 배터리의 전력량 확인
4. **확인**: 테이블에서 해당 배터리의 반입 가능 여부 확인

## ⚠️ 주의사항

- 본 정보는 참고용이며, 실제 탑승 시 해당 항공사의 최신 규정을 확인하시기 바랍니다
- 항공사별로 세부 운영 기준이 다를 수 있습니다
- 국가별 추가 규제가 있을 수 있습니다

## 📝 데이터 업데이트

새로운 배터리 정보를 추가하려면 `data/batteries.json` 파일을 수정하세요:

```json
{
  "brand": "브랜드명",
  "model": "모델명",
  "capacity_mah": 10000,
  "voltage": 3.7,
  "capacity_wh": 37,
  "carry_on_status": "allowed",
  "max_quantity": 5,
  "notes": "주의사항",
  "category": "카테고리"
}
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트 관련 문의사항이 있으시면 [Issues](https://github.com/username/battery-carry-on/issues)를 통해 연락해 주세요.

---

마지막 업데이트: 2025년 1월  
IATA/ICAO 2025년 규정 기준