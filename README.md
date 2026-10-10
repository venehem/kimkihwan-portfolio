# Kim Ki hwan — Design Portfolio 2027

르노 콜레오스 overview 페이지 방식(휠 스크롤로 장면이 넘어가는 스티키·패럴랙스 연출)을 적용한 정적 포트폴리오 사이트입니다.
서버나 빌드 없이 `index.html`을 더블클릭하면 열립니다. 웹 호스팅(GitHub Pages, Netlify, 카페24 FTP 등)에는 폴더 전체를 그대로 올리면 됩니다.

## 폴더 구조

```
index.html            진입점 (스크립트 로드 순서만 정의)
data/content.js       모든 콘텐츠(텍스트·이미지·영상·링크·메뉴·설정). 유일한 콘텐츠 원본
assets/img/…          PDF에서 추출·최적화한 이미지 (챕터별 폴더)
css/tokens.css        디자인 토큰 (색상 역할, 타입 스케일, 간격, 모서리, 모션, 테마)
css/base.css          리셋·공통 컴포넌트 (버튼, 칩, 링, 헤더, 메뉴, 라이트박스, 스낵바)
css/sections.css      섹션별 레이아웃과 스크롤 연동 연출
css/admin.css         관리자 모드 UI
js/core/              앱 코어 (store, db, scroll 엔진, ui, app 셸, config)
js/sections/          섹션 타입 1개 = 파일 1개 (render + 관리자 필드 스키마)
js/admin/             관리자 모드 (스키마 기반 폼, 인라인 편집, 가져오기/내보내기)
```

## 스크롤 연출 (섹션 타입)

| 타입 | 동작 |
|---|---|
| `hero` | 풀스크린 미디어가 스크롤에 따라 둥근 프레임으로 줄어들고 문장이 떠오름 |
| `profile` | 인사말, 경력 연차 카운트업, 이력·연락처·스킬 순차 등장 |
| `index` | 챕터를 자동으로 모은 목차, 마우스를 올리면 미리보기 이미지가 따라다님 |
| `chapter` | 큰 외곽선 번호 + 작은 창의 이미지가 전체 화면으로 확장 → 프롤로그·참여율 링 |
| `story` | 화면 고정 상태에서 휠을 내리면 단계별로 이미지·설명 전환 (번호 버튼으로 이동) |
| `feature` | 풀블리드 패럴랙스 이미지/영상 위에 제목·본문·수치 |
| `split` | 이미지+텍스트 2단 / 위아래 배치, 이미지 클릭 시 크게 보기 |
| `gallery` | 세로 휠 → 가로로 흐르는 카드 갤러리 |
| `tabs` | 탭 + 스와이프 슬라이더 |
| `contact` | 큰 전화번호와 연락처, 메일 복사 |

부드러운 휠 스크롤은 터치 기기와 "동작 줄이기" 설정에서는 자동으로 꺼집니다.

## 관리자 모드

1. 주소 뒤에 `?admin`을 붙이거나 `Ctrl(⌘)+Shift+E`
2. 비밀번호 입력 (기본값 `admin1234` → 사이트 설정 › 관리자에서 꼭 바꾸세요)
3. 편집 방법
   - 페이지의 요소를 클릭하면 해당 섹션의 편집 패널이 열리고 해당 필드로 이동
   - 글자를 더블클릭하면 그 자리에서 바로 수정 (Esc 또는 바깥 클릭으로 완료)
   - 이미지/영상 파일을 페이지의 이미지 위로 끌어다 놓으면 교체
   - [섹션] 탭: 순서 변경, 숨기기, 복제, 삭제, 새 섹션 추가
   - [사이트 설정] 탭: 탭 제목, 로고, 포인트 컬러, 폰트, 메뉴, 휠 감도, 푸터, UI 문구, 비밀번호
   - 실행 취소/다시 실행: `Ctrl+Z` / `Ctrl+Shift+Z`
4. 편집 내용은 이 브라우저에 자동 저장됩니다(IndexedDB). 방문자에게 반영하려면
   **내보내기 › content.js**를 받아 `data/content.js`를 교체한 뒤 다시 업로드하세요.
   업로드한 이미지·영상은 내보낸 파일 안에 포함됩니다. 큰 영상은 `assets/` 폴더에 넣고 경로를 입력하는 편이 가볍습니다.
5. **내보내기 › content.json**은 백업용이며 [가져오기]로 되돌릴 수 있습니다.

> 관리자 비밀번호는 정적 사이트용 간이 잠금입니다. 여러 사람이 온라인으로 편집·게시해야 한다면 서버(예: Supabase, Firebase)에 저장하도록 `js/core/store.js`의 persist/export 부분만 교체하면 됩니다.

## 확장하기

- **새 섹션 타입**: `js/sections/새타입.js`에 `PF.registerSection('type', { label, defaults, fields, render })`를 작성하고 `index.html`에 스크립트 한 줄 추가. 관리자 폼은 `fields` 스키마로 자동 생성됩니다.
- **새 배경 테마**: `css/tokens.css`에 `[data-theme="이름"]` 블록 추가 → `js/core/config.js`의 `themes`에 등록.
- **스크롤 길이·연출 강도**: `js/core/config.js`의 `pin`, `css/tokens.css`의 `--sys-pin-*`, `--sys-chapter-window-*`, `--sys-parallax-range`.
- **콘텐츠 구조 변경**: `data/content.js`의 `version`을 올리고 `js/core/store.js`의 `migrations`에 변환 함수를 추가하면 기존 편집본도 자동 변환됩니다.
