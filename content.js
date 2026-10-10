/* Portfolio content (single source of truth).
   - Edit through Admin mode (?admin) and use "내보내기 → content.js" to replace this file,
     or edit the JSON below directly.
   - Every section has: id (anchor), type (see js/sections), visible, theme (see js/core/config.js). */
window.PORTFOLIO_CONTENT = {
  "version": 1,
  "settings": {
    "meta": {
      "title": "Kim Ki hwan — Design Portfolio 2027",
      "description": "18년 경력의 브랜드·제품·웹·편집 디자이너 김기환의 포트폴리오",
      "lang": "ko"
    },
    "brand": { "name": "Kim Ki hwan" },
    "theme": {
      "accent": "#ffd200",
      "onAccent": "#1a1a1d",
      "fontSans": "",
      "fontDisplay": ""
    },
    "header": {
      "showChapterNav": true,
      "cta": { "label": "Contact", "href": "#contact", "newTab": false }
    },
    "nav": {
      "extra": []
    },
    "motion": {
      "smoothWheel": true,
      "wheelLerp": 0.1,
      "wheelMultiplier": 1,
      "reveal": true
    },
    "ui": { "showSideDots": true, "showProgress": true },
    "labels": {
      "scroll": "Scroll",
      "menu": "메뉴",
      "close": "닫기",
      "prev": "이전",
      "next": "다음",
      "participation": "Participation rate",
      "skip": "본문으로 건너뛰기",
      "copy": "복사",
      "copied": "클립보드에 복사했어요",
      "viewLarge": "크게 보기",
      "pause": "일시정지",
      "play": "재생",
      "contents": "Contents"
    },
    "footer": {
      "copyright": "© 2026 Kim Ki hwan. All rights reserved.",
      "links": [
        { "label": "venhem@naver.com", "href": "mailto:venhem@naver.com", "newTab": false },
        { "label": "010 7667 9053", "href": "tel:01076679053", "newTab": false }
      ]
    },
    "admin": { "passcode": "admin1234" }
  },
  "sections": [
    {
      "id": "home",
      "type": "hero",
      "visible": true,
      "theme": "black",
      "navLabel": "",
      "eyebrow": "Portfolio 2027 · Creative Designer",
      "title": "Design\nPortfolio",
      "subtitle": "브랜드에서 제품, 웹, 편집까지.\n18년 동안 쌓아온 디자인의 모든 장면을 휠로 넘겨보세요.",
      "statement": "Small but Great.\n작은 디테일이 브랜드를 만듭니다.",
      "media": { "type": "image", "src": "assets/img/brand/guess-what.jpg", "poster": "", "alt": "어둠 속에서 장난치는 고양이와 휘핏" },
      "ctas": [
        { "label": "작업 보기", "href": "#chapter-ai", "newTab": false, "variant": "filled" },
        { "label": "연락하기", "href": "#contact", "newTab": false, "variant": "outlined" }
      ]
    },
    {
      "id": "about",
      "type": "profile",
      "visible": true,
      "theme": "light",
      "navLabel": "About",
      "title": "Hello\nCall me Kim",
      "badge": "designer",
      "stat": { "value": "18", "suffix": "YEARS", "label": "EXPERIENCE" },
      "careerTitle": "About me",
      "career": [
        { "period": "2024.06 ~", "name": "LUVID" },
        { "period": "2019.01 ~ 2024.04", "name": "MAXN sofa" },
        { "period": "2016.06 ~ 2019.01", "name": "EBONIA furniture" },
        { "period": "2015.07 ~ 2020.06", "name": "VENHEM for pets" },
        { "period": "2010.07 ~ 2015.06", "name": "DODOT furniture" }
      ],
      "info": [
        { "label": "Name", "value": "김기환" },
        { "label": "Graduation", "value": "강남대학교 시각디자인과 졸업" },
        { "label": "Patent", "value": "반려동물 용품 디자인특허 3건\n반려동물 브랜드 상표특허 1건" }
      ],
      "contactsTitle": "Contacts",
      "contacts": [
        { "label": "Phone", "value": "010 7667 9053", "href": "tel:01076679053" },
        { "label": "Mail", "value": "venhem@naver.com", "href": "mailto:venhem@naver.com" },
        { "label": "Address", "value": "경기도 성남시 분당구 야탑동 526", "href": "" }
      ],
      "skillsTitle": "Skills",
      "skills": [
        { "abbr": "Ps", "name": "Photoshop" },
        { "abbr": "Ai", "name": "Illustrator" },
        { "abbr": "Id", "name": "Indesign" },
        { "abbr": "C2", "name": "Cafe24" },
        { "abbr": "Pr", "name": "Premiere" },
        { "abbr": "Fm", "name": "Figma" },
        { "abbr": "Su", "name": "Sketchup" },
        { "abbr": "C", "name": "CAD" },
        { "abbr": "Mj", "name": "Midjourney" },
        { "abbr": "gpt", "name": "Chat GPT" }
      ]
    },
    {
      "id": "contents",
      "type": "index",
      "visible": true,
      "theme": "dark",
      "navLabel": "",
      "title": "CONTENTS",
      "text": "각 챕터를 선택하면 해당 위치로 이동합니다."
    },

    {
      "id": "chapter-ai",
      "type": "chapter",
      "visible": true,
      "theme": "ink",
      "navLabel": "AI",
      "number": "00",
      "title": "Ai projects",
      "subtitle": "About your company design · Midjourney, Chat GPT",
      "prologue": "ai 프로젝트는 2023년부터 ai를 연구하여 디자인과 상업적 홍보, 마케팅의 연계를 연구하는 목적으로 하고 있습니다. 상상하는 무엇이든 만들 수 있는 가치를 연구합니다.",
      "workType": "Personal work",
      "rates": [
        { "label": "Planning", "value": 100 },
        { "label": "Program", "value": 100 },
        { "label": "Design", "value": 100 }
      ],
      "media": { "type": "image", "src": "assets/img/ai/cabinet-open.jpg", "poster": "", "alt": "AI로 생성한 욕실 수납장 3D 모델" },
      "link": { "label": "", "href": "", "newTab": false }
    },
    {
      "id": "ai-program",
      "type": "story",
      "visible": true,
      "theme": "ink",
      "navLabel": "",
      "eyebrow": "00 Ai Program / planning",
      "title": "Sketch up?\nJust Ai",
      "steps": [
        {
          "kicker": "Concept",
          "title": "누구나, 3번 클릭만으로\n가구 디자이너",
          "text": "Google Ai studio gemini 3.8 기반으로 제작한 욕실 가구 설계 프로그램. 전문 툴 없이도 “10초” 만에 가구를 만들 수 있습니다.",
          "media": { "type": "image", "src": "assets/img/ai/cabinet-sink.jpg", "poster": "", "alt": "세면대 일체형 하부장 3D 렌더" },
          "tags": ["Google Ai studio", "gemini 3.8"],
          "link": { "label": "\"10초\" 가구 만들기", "href": "", "newTab": true }
        },
        {
          "kicker": "Why?",
          "title": "오차 없이, 완벽히\n소통하다",
          "text": "소재, 제조방식, 제조범위, 제조규칙, 가구구조, 업체 특유의 노하우를 녹인 제작 프로그램. 전문가조차 완벽히 이해하지 못하는 PS(플라스틱 욕실 가구)를 더 많은 사람과 소통하기 위해 개발했습니다.\n소통의 범위 : 고객 ↔ 콜센터 ↔ 제조공장 ↔ 고객",
          "media": { "type": "image", "src": "assets/img/ai/why-diagram.jpg", "poster": "", "alt": "전문가와 일반인의 인식 차이를 보여주는 다이어그램" },
          "tags": ["어렵다 → 쉽다", "느리다 → 빠르다", "답답하다 → 이해하다"],
          "link": { "label": "", "href": "", "newTab": false }
        },
        {
          "kicker": "1 · 2 · 3 click",
          "title": "3번의 클릭으로\n도면까지",
          "text": "제품군 선택 → 사이즈 → 옵션. 세 번의 선택만으로 외부·내부 도면이 실시간으로 생성됩니다.",
          "media": { "type": "image", "src": "assets/img/ai/easycad-ui.jpg", "poster": "", "alt": "LUVID 3D EASY CAD 프로그램 화면" },
          "tags": ["LUVID 3D EASY CAD"],
          "link": { "label": "", "href": "", "newTab": false }
        },
        {
          "kicker": "2D → 3D",
          "title": "평면 도면에서\n입체 모델까지",
          "text": "생성된 2D 도면은 즉시 3D 모델로 변환되어 재질과 색상을 확인할 수 있으며 dxf, svg, pdf로 내보낼 수 있습니다.",
          "media": { "type": "image", "src": "assets/img/ai/2d-3d.jpg", "poster": "", "alt": "2D 도면과 3D 모델 비교" },
          "tags": ["dxf", "svg", "pdf", "easycad"],
          "link": { "label": "", "href": "", "newTab": false }
        }
      ]
    },
    {
      "id": "ai-architecture",
      "type": "split",
      "visible": true,
      "theme": "ink",
      "navLabel": "",
      "eyebrow": "00 Ai Program / planning",
      "title": "System\nArchitecture",
      "text": "로그인부터 디자인, 사이즈, 컬러, 옵션 선택과 3D·2D·상세 뷰, 파일 출력, 커뮤니티까지. 제품·기능·뷰 콘텐츠를 서비스·신뢰·태도의 가치로 연결해 멤버십으로 이어지도록 설계했습니다.",
      "media": { "type": "image", "src": "assets/img/ai/architecture.jpg", "poster": "", "alt": "AI 프로그램 시스템 아키텍처 다이어그램" },
      "layout": "stacked",
      "mediaFit": "contain",
      "chips": ["Login", "Design", "3D View", "Export", "Membership"],
      "meta": [],
      "link": { "label": "", "href": "", "newTab": false }
    },

    {
      "id": "chapter-brand",
      "type": "chapter",
      "visible": true,
      "theme": "black",
      "navLabel": "Brand",
      "number": "01",
      "title": "Brand Design",
      "subtitle": "Brand Identity - venhem design",
      "prologue": "벤헴은 “친구의 집”이라는 뜻으로, 반려동물의 라이프스타일을 담는 공간을 의미합니다. 소소한 일상의 교감을 통해 서로를 존중하며 함께 즐거운 시간을 만들어가는 삶을 이야기하고자 합니다. 공간 속에서 사람과 반려동물을 배려하는 위트 있는 디자인을 지향하는 브랜드입니다.",
      "workType": "Personal work",
      "rates": [
        { "label": "Planning", "value": 100 },
        { "label": "Branding", "value": 100 },
        { "label": "Design", "value": 100 },
        { "label": "Photo", "value": 100 }
      ],
      "media": { "type": "image", "src": "assets/img/brand/whippet-portrait.jpg", "poster": "", "alt": "검은 배경 앞 휘핏 초상" },
      "link": { "label": "Go now", "href": "http://www.venhem.com", "newTab": true }
    },
    {
      "id": "brand-concept",
      "type": "feature",
      "visible": true,
      "theme": "black",
      "navLabel": "",
      "eyebrow": "venhem Design concept",
      "title": "Guess what!",
      "text": "벤헴은 반려동물의 표정과 행동을 통해 전달되는 감정과 이야기를 아이덴티티에 담고자 했습니다. 언어의 장벽을 넘어 전 세계 누구나 공감할 수 있는 비주얼 아이덴티티를 창조하는 데 중점을 두었습니다. 스토리텔링을 통해 각각의 반려동물이 지닌 독특한 성격과 감정을 이해하고 공감하게 만들고, 브랜드와 소비자 사이의 강력한 연결 고리를 형성합니다.",
      "media": { "type": "image", "src": "assets/img/brand/guess-what.jpg", "poster": "", "alt": "고양이와 휘핏이 장난치는 장면" },
      "align": "center",
      "titleStyle": "serif-accent",
      "stats": [],
      "link": { "label": "", "href": "", "newTab": false }
    },
    {
      "id": "brand-identity",
      "type": "split",
      "visible": true,
      "theme": "stone",
      "navLabel": "",
      "eyebrow": "01 Brand design",
      "title": "venhem\nIdentity",
      "text": "세리프 서체 Minion Pro를 패밀리 폰트로 사용해 클래식하고 따뜻한 인상을 만들고, 포인트 컬러 옐로우로 위트를 더했습니다. 슬로건 “Small but Great”는 작은 반려동물을 위한 큰 배려를 뜻합니다.",
      "media": { "type": "image", "src": "assets/img/brand/identity-logo.jpg", "poster": "", "alt": "venhem 심볼 로고와 슬로건" },
      "layout": "split",
      "mediaFit": "cover",
      "chips": ["Minion Pro", "Small but Great"],
      "meta": [
        { "label": "Typeface", "value": "Minion Pro" },
        { "label": "Web", "value": "www.venhem.com" }
      ],
      "link": { "label": "www.venhem.com", "href": "http://www.venhem.com", "newTab": true }
    },
    {
      "id": "brand-signature",
      "type": "split",
      "visible": true,
      "theme": "light",
      "navLabel": "",
      "eyebrow": "01 Brand design / signature",
      "title": "Signature &\nSymbol mark",
      "text": "포인트 사이즈, 볼드 타입, 심볼 마크의 어센더와 엑스하이트를 정밀하게 설계하고 메인 컬러 시스템을 정의했습니다.",
      "media": { "type": "image", "src": "assets/img/brand/signature.jpg", "poster": "", "alt": "venhem 시그니처 가이드와 심볼 마크, 메인 컬러" },
      "layout": "split-reverse",
      "mediaFit": "contain",
      "chips": [],
      "meta": [
        { "label": "Trademark patent", "value": "4500664290000" },
        { "label": "Slogan", "value": "Small but Great" }
      ],
      "link": { "label": "", "href": "", "newTab": false }
    },
    {
      "id": "brand-applications",
      "type": "gallery",
      "visible": true,
      "theme": "stone",
      "navLabel": "",
      "eyebrow": "01 Brand design + Identity design",
      "title": "Brand applications",
      "text": "100% Microfiber, Anti allergy & Anti atopy. 라벨부터 굿즈, 촬영까지 브랜드의 모든 접점을 디자인했습니다.",
      "cardSize": "landscape",
      "items": [
        { "media": { "type": "image", "src": "assets/img/brand/cushion-orange.jpg", "poster": "", "alt": "오렌지 쿠션 위의 고양이" }, "caption": "Cushion", "text": "Premium Cotton 100%", "link": { "label": "", "href": "", "newTab": false } },
        { "media": { "type": "image", "src": "assets/img/brand/flag.jpg", "poster": "", "alt": "venhem 로고 플래그" }, "caption": "Flag", "text": "Brand symbol", "link": { "label": "", "href": "", "newTab": false } },
        { "media": { "type": "image", "src": "assets/img/brand/goods.jpg", "poster": "", "alt": "브랜드 패브릭 굿즈" }, "caption": "Goods", "text": "Label & Package", "link": { "label": "", "href": "", "newTab": false } },
        { "media": { "type": "image", "src": "assets/img/brand/corgi.jpg", "poster": "", "alt": "웃는 웰시코기" }, "caption": "Photo", "text": "Wash information", "link": { "label": "", "href": "", "newTab": false } }
      ]
    },
    {
      "id": "brand-digital",
      "type": "tabs",
      "visible": true,
      "theme": "stone",
      "navLabel": "",
      "eyebrow": "01 Brand design",
      "title": "Web · Mobile · Others",
      "text": "브랜드 웹사이트와 모바일, 그리고 함께 작업한 브랜드 로고들.",
      "tabs": [
        {
          "label": "Web design",
          "items": [
            { "media": { "type": "image", "src": "assets/img/brand/web-01.jpg", "poster": "", "alt": "가정의 달 프로모션 웹 메인" }, "caption": "5월 가정의 달 20% off" },
            { "media": { "type": "image", "src": "assets/img/brand/web-02.jpg", "poster": "", "alt": "쿠션 제품 웹 페이지" }, "caption": "Cushion Kitten" },
            { "media": { "type": "image", "src": "assets/img/brand/web-03.jpg", "poster": "", "alt": "펫하우스 웹 페이지" }, "caption": "Pet house" },
            { "media": { "type": "image", "src": "assets/img/brand/web-04.jpg", "poster": "", "alt": "브랜드 필름 웹 페이지" }, "caption": "Brand film" }
          ]
        },
        {
          "label": "Mobile design",
          "items": [
            { "media": { "type": "image", "src": "assets/img/brand/mobile.jpg", "poster": "", "alt": "venhem 모바일 화면 3종" }, "caption": "Opera home · Castle stripe · Event" }
          ]
        },
        {
          "label": "Others",
          "items": [
            { "media": { "type": "image", "src": "assets/img/brand/logos.jpg", "poster": "", "alt": "작업한 브랜드 로고 모음" }, "caption": "dodot, blåskov, MAXN, GINGER, CARDON, JASMIN, BARTON 외" }
          ]
        }
      ]
    },

    {
      "id": "chapter-product",
      "type": "chapter",
      "visible": true,
      "theme": "black",
      "navLabel": "Product",
      "number": "02",
      "title": "Product Design",
      "subtitle": "Product - venhem / LUVID",
      "prologue": "제품 디자인의 본질은 단순히 눈을 즐겁게 하는 아름다움에만 그치지 않습니다. 진정한 디자인은 사용자의 행동, 습관, 그리고 특성을 깊이 연구하여, 그들이 진정으로 필요로 하는 기능과 형태를 창조해내는 과정에서 완성됩니다.",
      "workType": "Personal work",
      "rates": [
        { "label": "Planning", "value": 100 },
        { "label": "Concept", "value": 100 },
        { "label": "Design", "value": 100 }
      ],
      "media": { "type": "image", "src": "assets/img/product/pet-house.jpg", "poster": "", "alt": "검은 펫하우스와 휘핏, 고양이" },
      "link": { "label": "", "href": "", "newTab": false }
    },
    {
      "id": "product-lineup",
      "type": "story",
      "visible": true,
      "theme": "black",
      "navLabel": "",
      "eyebrow": "02 Product design",
      "title": "Product\nLine-up",
      "mediaFit": "cover",
      "steps": [
        {
          "kicker": "Concept · CASTLE",
          "title": "venhem\nPet house",
          "text": "국내 소형견의 특징을 연구하여 최적의 사이즈와 형태를, 대중이 좋아할 수 있는 디자인과 빠른 제작이 가능한 소재와 기법으로 디자인했습니다. 세탁, 수납 등 반려인과 반려견에게 필요한 기능을 고려했습니다.",
          "media": { "type": "image", "src": "assets/img/product/pet-house.jpg", "poster": "", "alt": "블랙 캐슬 펫하우스" },
          "tags": ["KOREA Design patent 3008701360000"],
          "link": { "label": "www.venhem.co.kr", "href": "http://www.venhem.co.kr", "newTab": true }
        },
        {
          "kicker": "Series",
          "title": "venhem\nhouse series",
          "text": "Roof house, Opera house, Castle house. 컬러와 사이즈, 커버 소재를 조합한 하우스 시리즈.",
          "media": { "type": "image", "src": "assets/img/product/house-series-b.jpg", "poster": "", "alt": "하우스 시리즈 컬러·사이즈 표" },
          "tags": ["Roof house", "Opera house", "Castle house"],
          "link": { "label": "", "href": "", "newTab": false }
        },
        {
          "kicker": "Concept · HUG",
          "title": "Cushion\nKitten",
          "text": "고양이의 얼굴을 닮은 형태의 쿠션으로, 반려동물의 몸에 착 감기는 빈백 스타일로 개발했습니다.",
          "media": { "type": "image", "src": "assets/img/product/cushion-kitten.jpg", "poster": "", "alt": "그린 빈백 쿠션 위의 휘핏" },
          "tags": ["Bean bag"],
          "link": { "label": "", "href": "", "newTab": false }
        },
        {
          "kicker": "Concept · Mom's touch",
          "title": "Blanket\nfor pet",
          "text": "포근한 엄마 품에 안긴 느낌에 가까운 보들보들한 퍼 원단으로 제작하고, 보온을 위해 이중 레이어드로 디자인했습니다. 굵은 오버로크로 디자인 퀄리티를 높였습니다.",
          "media": { "type": "image", "src": "assets/img/product/blanket.jpg", "poster": "", "alt": "퍼 블랭킷을 덮은 고양이" },
          "tags": ["Fur", "Double layered"],
          "link": { "label": "", "href": "", "newTab": false }
        },
        {
          "kicker": "Concept · Natural",
          "title": "LUVID\nCabinets",
          "text": "플라스틱 PS 욕실 가구 브랜드 루비드의 내추럴한 컨셉을 적용한 가구 디자인. 타깃, 환경, 공간, 규모에 따라 제품을 개발했습니다.",
          "media": { "type": "image", "src": "assets/img/product/luvid-cabinet-a.jpg", "poster": "", "alt": "우드 톤 욕실 하부장" },
          "tags": ["문라이트 시리즈", "브릭 시리즈", "홈케어 시리즈", "스택 시리즈", "스피어 시리즈"],
          "link": { "label": "", "href": "", "newTab": false }
        }
      ]
    },
    {
      "id": "product-luvid",
      "type": "gallery",
      "visible": true,
      "theme": "black",
      "navLabel": "",
      "eyebrow": "02 Product design",
      "title": "LUVID series",
      "text": "공간의 무드에 맞춰 확장되는 욕실 가구 시리즈.",
      "cardSize": "portrait",
      "items": [
        { "media": { "type": "image", "src": "assets/img/product/luvid-cabinet-b.jpg", "poster": "", "alt": "조명이 있는 상부장과 세면대" }, "caption": "문라이트 시리즈", "text": "", "link": { "label": "", "href": "", "newTab": false } },
        { "media": { "type": "image", "src": "assets/img/product/luvid-mood.jpg", "poster": "", "alt": "앰버 조명의 욕실 소품" }, "caption": "홈케어 시리즈", "text": "", "link": { "label": "", "href": "", "newTab": false } },
        { "media": { "type": "image", "src": "assets/img/product/luvid-sphere-a.jpg", "poster": "", "alt": "아치형 오픈 수납장" }, "caption": "스택 시리즈", "text": "", "link": { "label": "", "href": "", "newTab": false } },
        { "media": { "type": "image", "src": "assets/img/product/luvid-sphere-b.jpg", "poster": "", "alt": "원형 거울과 스톤 세면대" }, "caption": "스피어 시리즈", "text": "", "link": { "label": "", "href": "", "newTab": false } },
        { "media": { "type": "image", "src": "assets/img/product/luvid-cabinet-a.jpg", "poster": "", "alt": "우드 하부장" }, "caption": "브릭 시리즈", "text": "", "link": { "label": "", "href": "", "newTab": false } }
      ]
    },
    {
      "id": "product-tent",
      "type": "feature",
      "visible": true,
      "theme": "dark",
      "navLabel": "",
      "eyebrow": "Sewing Project",
      "title": "Design A Tent\nby myself",
      "text": "찾다가 없어서, 1달 동안 퇴근 후 직접 만든 감성 A텐트.",
      "media": { "type": "image", "src": "assets/img/product/tent-hero.jpg", "poster": "", "alt": "바닷가 잔디 위의 화이트 A텐트" },
      "align": "left",
      "titleStyle": "default",
      "stats": [
        { "label": "Photo", "value": "Kimnyeong Beach", "suffix": "" },
        { "label": "Date", "value": "2021.01 ~ 2021.02", "suffix": "" },
        { "label": "Cost", "value": "860000", "suffix": "won" }
      ],
      "link": { "label": "", "href": "", "newTab": false }
    },
    {
      "id": "product-tent-process",
      "type": "gallery",
      "visible": true,
      "theme": "taupe",
      "navLabel": "",
      "eyebrow": "Design process · Sketchup 3D",
      "title": "원하는 텐트가 없다면\n만들어라!",
      "text": "기획 → 디자인 → 스케치업 → 캐드 → 원단 → 재봉. 브라더 본봉미싱, 오바로크미싱, 자수미싱으로 직접 제작했습니다.",
      "cardSize": "landscape",
      "items": [
        { "media": { "type": "image", "src": "assets/img/product/tent-process.jpg", "poster": "", "alt": "텐트 제작 프로세스 다이어그램" }, "caption": "Design process", "text": "보유장비 · 제작순서", "link": { "label": "", "href": "", "newTab": false } },
        { "media": { "type": "image", "src": "assets/img/product/tent-sketch-01.jpg", "poster": "", "alt": "스케치업 텐트 모델링 1" }, "caption": "Sketchup 3D", "text": "리빙쉘 구조", "link": { "label": "", "href": "", "newTab": false } },
        { "media": { "type": "image", "src": "assets/img/product/tent-sketch-02.jpg", "poster": "", "alt": "스케치업 텐트 모델링 2" }, "caption": "Side view", "text": "", "link": { "label": "", "href": "", "newTab": false } },
        { "media": { "type": "image", "src": "assets/img/product/tent-sketch-03.jpg", "poster": "", "alt": "스케치업 텐트 비교" }, "caption": "Scale study", "text": "", "link": { "label": "", "href": "", "newTab": false } },
        { "media": { "type": "image", "src": "assets/img/product/tent-sketch-04.jpg", "poster": "", "alt": "스케치업 텐트 전실" }, "caption": "4m 전실", "text": "", "link": { "label": "", "href": "", "newTab": false } },
        { "media": { "type": "image", "src": "assets/img/product/tent-sketch-05.jpg", "poster": "", "alt": "텐트 2동 비교" }, "caption": "Line up", "text": "", "link": { "label": "", "href": "", "newTab": false } }
      ]
    },
    {
      "id": "product-tent-result",
      "type": "split",
      "visible": true,
      "theme": "taupe",
      "navLabel": "",
      "eyebrow": "LIVING SHELL A TENT",
      "title": "천장까지 3m 20cm\nA형 리빙쉘텐트",
      "text": "양문 개방형, 통풍 구조, 3.5m 이너텐트와 4m 전실. 내수압 3000mm 원단과 UV 차단, 간편한 설치와 건조까지 고려했습니다.",
      "media": { "type": "image", "src": "assets/img/product/tent-photo-01.jpg", "poster": "", "alt": "풍력발전기 앞 A텐트" },
      "layout": "split",
      "mediaFit": "cover",
      "chips": ["양문개방형", "통풍구조", "3.5m 이너텐트", "이너텐트 모기장", "화이트 폴대", "조명 걸이", "천장 와이어", "4m 전실", "3.5m x 6m"],
      "meta": [
        { "label": "Size", "value": "3.5m x 6m" },
        { "label": "Height", "value": "3m 20cm" }
      ],
      "link": { "label": "", "href": "", "newTab": false }
    },

    {
      "id": "chapter-web",
      "type": "chapter",
      "visible": true,
      "theme": "dark",
      "navLabel": "Web",
      "number": "03",
      "title": "Web design",
      "subtitle": "Website Design - MAXN design sofa brand",
      "prologue": "회사에서 진행한 웹디자인 프로젝트를 소개합니다. 디자인의 방향성을 명확히 이해할 수 있도록 중요한 지표들을 함께 곁들여 설명드리겠습니다.",
      "workType": "Team work",
      "rates": [
        { "label": "Planning", "value": 75 },
        { "label": "Concept", "value": 75 },
        { "label": "Application", "value": 100 }
      ],
      "media": { "type": "image", "src": "assets/img/web/bespoke.jpg", "poster": "", "alt": "네온 조명 속 블루 소파" },
      "link": { "label": "", "href": "", "newTab": false }
    },
    {
      "id": "web-bespoke",
      "type": "feature",
      "visible": true,
      "theme": "black",
      "navLabel": "",
      "eyebrow": "03 Web design",
      "title": "Bespoke, Why not?",
      "text": "막스앤 소파는 소파의 모든 부위의 사이즈, 원단, 탄성 등을 고객에게 1:1 맞춤 제작할 수 있는 국내 최다의 비스포크 업체로, 서비스 정보 전달과 이해의 속도가 가장 중요한 제작 컨셉입니다. 고관여 상품인 소파의 특성을 고려하여 디자인했습니다.",
      "media": { "type": "image", "src": "assets/img/web/bespoke.jpg", "poster": "", "alt": "비스포크 소파 키비주얼" },
      "align": "center",
      "titleStyle": "default",
      "stats": [],
      "link": { "label": "", "href": "", "newTab": false }
    },
    {
      "id": "web-maxn",
      "type": "split",
      "visible": true,
      "theme": "black",
      "navLabel": "",
      "eyebrow": "03 Web design",
      "title": "MAXN\nPC & MOBILE",
      "text": "고객이 원하는 정보에 가장 빠르게 도달하도록 정보 구조를 단순화하고, 비스포크 옵션을 시각적으로 비교할 수 있게 설계했습니다.",
      "media": { "type": "image", "src": "assets/img/web/laptop.jpg", "poster": "", "alt": "MAXN 웹사이트가 띄워진 노트북" },
      "layout": "split",
      "mediaFit": "cover",
      "chips": ["Cafe24", "Responsive", "Bespoke"],
      "meta": [],
      "link": { "label": "Go now", "href": "https://www.maxn.co.kr", "newTab": true }
    },
    {
      "id": "web-screens",
      "type": "tabs",
      "visible": true,
      "theme": "stone",
      "navLabel": "",
      "eyebrow": "03 Web design",
      "title": "Ultra Soft cushion Sofa\nFor family",
      "text": "PC 메인과 모바일, 프로모션 페이지까지.",
      "tabs": [
        {
          "label": "PC",
          "items": [
            { "media": { "type": "image", "src": "assets/img/web/pc-01.jpg", "poster": "", "alt": "MAXN 연휴 세일 메인" }, "caption": "Monthly sale" },
            { "media": { "type": "image", "src": "assets/img/web/pc-02.jpg", "poster": "", "alt": "Ultra soft cushion 메인" }, "caption": "Ultra Soft cushion Sofa" },
            { "media": { "type": "image", "src": "assets/img/web/pc-03.jpg", "poster": "", "alt": "MAXN 쇼룸 메인" }, "caption": "Showroom" },
            { "media": { "type": "image", "src": "assets/img/web/pc-04.jpg", "poster": "", "alt": "ITALY FONPELLI 피처 페이지" }, "caption": "Italy Fonpelli" }
          ]
        },
        {
          "label": "Mobile",
          "items": [
            { "media": { "type": "image", "src": "assets/img/web/mobile-01.jpg", "poster": "", "alt": "말랑말랑한 유럽풍 거실인테리어 모바일" }, "caption": "READ Now" },
            { "media": { "type": "image", "src": "assets/img/web/mobile-02.jpg", "poster": "", "alt": "The Blue label Bric series 모바일" }, "caption": "The Blue label Bric series" },
            { "media": { "type": "image", "src": "assets/img/web/mobile-03.jpg", "poster": "", "alt": "비스포크 소재 변경 모바일" }, "caption": "비스포크 리뷰" }
          ]
        },
        {
          "label": "Promotion",
          "items": [
            { "media": { "type": "image", "src": "assets/img/web/promo-01.jpg", "poster": "", "alt": "SALE 프로모션" }, "caption": "Super Sale" },
            { "media": { "type": "image", "src": "assets/img/web/promo-02.jpg", "poster": "", "alt": "7 seven days 프로모션" }, "caption": "7 seven days" },
            { "media": { "type": "image", "src": "assets/img/web/promo-03.jpg", "poster": "", "alt": "Living Fair 프로모션" }, "caption": "Living Fair" },
            { "media": { "type": "image", "src": "assets/img/web/promo-04.jpg", "poster": "", "alt": "오오오 프로모션" }, "caption": "오·오·오" },
            { "media": { "type": "image", "src": "assets/img/web/promo-05.jpg", "poster": "", "alt": "가을 세일 프로모션" }, "caption": "안녕 가을, 어서와 세일" },
            { "media": { "type": "image", "src": "assets/img/web/promo-06.jpg", "poster": "", "alt": "시리즈 소개 프로모션" }, "caption": "Series" }
          ]
        }
      ]
    },
    {
      "id": "web-sitemap",
      "type": "split",
      "visible": true,
      "theme": "stone",
      "navLabel": "",
      "eyebrow": "03 Web design / planning",
      "title": "Site map\nContents develope",
      "text": "제품, 비스포크, 이벤트, 쇼룸, 커뮤니티, 장바구니를 product · function · place contents로 분류하고 Service, Event, Guide, Experience, Review로 연결했습니다.",
      "media": { "type": "image", "src": "assets/img/web/sitemap.jpg", "poster": "", "alt": "MAXN 사이트맵 다이어그램" },
      "layout": "stacked",
      "mediaFit": "contain",
      "chips": ["Product", "Bespoke", "Event", "Showroom", "Community"],
      "meta": [],
      "link": { "label": "", "href": "", "newTab": false }
    },

    {
      "id": "chapter-editorial",
      "type": "chapter",
      "visible": true,
      "theme": "ink",
      "navLabel": "Editorial",
      "number": "04",
      "title": "Editorial Design",
      "subtitle": "Editorial - dodot advertisement",
      "prologue": "글쓰기에 목적이 있듯, 편집 디자인에도 그 목적이 존재합니다. 간결함을 통해 더 많은 사람들에게 공감을 줄 수 있어야 하며, 복잡한 요소를 단순한 형식으로 변화하여 전달하는 것이 저의 기본 철학입니다.",
      "workType": "Personal work",
      "rates": [
        { "label": "Planning", "value": 100 },
        { "label": "Concept", "value": 100 },
        { "label": "Application", "value": 100 }
      ],
      "media": { "type": "image", "src": "assets/img/editorial/cover.jpg", "poster": "", "alt": "다크 그린 브로슈어 커버" },
      "link": { "label": "", "href": "", "newTab": false }
    },
    {
      "id": "editorial-works",
      "type": "story",
      "visible": true,
      "theme": "black",
      "navLabel": "",
      "eyebrow": "04 Editorial design",
      "title": "Catalog &\nBrochure",
      "steps": [
        {
          "kicker": "Concept · We are",
          "title": "LUVID\nCatalog",
          "text": "Typeface — Helvetica Neue Lt std / Pretendard",
          "media": { "type": "image", "src": "assets/img/editorial/luvid-catalog.jpg", "poster": "", "alt": "LUVID 카탈로그 펼침면" },
          "tags": ["Helvetica Neue Lt std", "Pretendard"],
          "link": { "label": "PDF Download", "href": "", "newTab": true }
        },
        {
          "kicker": "Concept · NEW",
          "title": "MAXN\nBrochure",
          "text": "Typeface — Helvetica Neue Lt std / Noto Sans CJK KR",
          "media": { "type": "image", "src": "assets/img/editorial/maxn-brochure-01.jpg", "poster": "", "alt": "MAXN NEW 브로슈어" },
          "tags": ["Helvetica Neue Lt std", "Noto Sans CJK KR"],
          "link": { "label": "www.maxn.co.kr", "href": "https://www.maxn.co.kr", "newTab": true }
        },
        {
          "kicker": "Concept · SALES",
          "title": "dodot\nCatalogue",
          "text": "Typeface — Century Gothic / Yoon gothic 300",
          "media": { "type": "image", "src": "assets/img/editorial/dodot-catalogue.jpg", "poster": "", "alt": "레드 dodot 카탈로그 커버" },
          "tags": ["Century Gothic", "Yoon gothic 300"],
          "link": { "label": "www.dodot.co.kr", "href": "http://www.dodot.co.kr", "newTab": true }
        },
        {
          "kicker": "Graphic design part",
          "title": "dodot Pankyo showroom\nVisual plan",
          "text": "BRAND, POP, SHOP, PRINT, MEDIA, OFFICE 6개 영역의 사인·라벨·프라이스택·플로어 가이드까지 쇼룸의 그래픽 시스템을 계획했습니다.",
          "media": { "type": "image", "src": "assets/img/editorial/visual-plan.jpg", "poster": "", "alt": "판교 쇼룸 비주얼 플랜 다이어그램" },
          "tags": ["Sign system", "Label system", "POP", "Floor Guide"],
          "link": { "label": "", "href": "", "newTab": false }
        }
      ]
    },
    {
      "id": "editorial-shop",
      "type": "gallery",
      "visible": true,
      "theme": "black",
      "navLabel": "",
      "eyebrow": "04 Editorial design _ Shop",
      "title": "dodot · blåskov\nShop",
      "text": "쇼룸 사인과 카페, 패키지까지 공간 전체로 확장된 그래픽.",
      "cardSize": "landscape",
      "items": [
        { "media": { "type": "image", "src": "assets/img/editorial/shop-01.jpg", "poster": "", "alt": "DODOT COFFEE COMPANY 사인" }, "caption": "DODOT COFFEE", "text": "", "link": { "label": "", "href": "", "newTab": false } },
        { "media": { "type": "image", "src": "assets/img/editorial/shop-02.jpg", "poster": "", "alt": "blåskov 패키지" }, "caption": "blåskov package", "text": "", "link": { "label": "", "href": "", "newTab": false } },
        { "media": { "type": "image", "src": "assets/img/editorial/shop-03.jpg", "poster": "", "alt": "dodot 쇼룸 출입문 사인" }, "caption": "Entrance sign", "text": "", "link": { "label": "", "href": "", "newTab": false } },
        { "media": { "type": "image", "src": "assets/img/editorial/shop-04.jpg", "poster": "", "alt": "dodot 외벽 로고" }, "caption": "Facade", "text": "", "link": { "label": "", "href": "", "newTab": false } },
        { "media": { "type": "image", "src": "assets/img/editorial/shop-05.jpg", "poster": "", "alt": "쇼룸 소파와 POP" }, "caption": "POP", "text": "", "link": { "label": "", "href": "", "newTab": false } },
        { "media": { "type": "image", "src": "assets/img/editorial/shop-06.jpg", "poster": "", "alt": "blåskov 선반 사인" }, "caption": "Shelf sign", "text": "", "link": { "label": "", "href": "", "newTab": false } }
      ]
    },

    {
      "id": "contact",
      "type": "contact",
      "visible": true,
      "theme": "light",
      "navLabel": "Contact",
      "title": "Do you like it?\nCall me now",
      "phone": { "label": "010 7667 9053", "href": "tel:01076679053" },
      "contactsTitle": "Contacts",
      "contacts": [
        { "label": "Name", "value": "김기환", "href": "" },
        { "label": "Mail", "value": "venhem@naver.com", "href": "mailto:venhem@naver.com" },
        { "label": "Address", "value": "경기도 성남시 분당구 판교로 519", "href": "" }
      ],
      "sourceTitle": "Portfolio source",
      "source": [
        { "label": "Image", "value": "canon 6d mark 2, adobe, midjourney" },
        { "label": "Font family", "value": "Helvetica Neue LT Std, Pretendard" },
        { "label": "Tool", "value": "Indesign, Photoshop, Illustrator" }
      ],
      "ctas": [
        { "label": "메일 보내기", "href": "mailto:venhem@naver.com", "newTab": false, "variant": "filled" }
      ]
    }
  ]
};
