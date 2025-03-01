import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

function App() {
  const [hoveredOffice, setHoveredOffice] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [mainVisible, setMainVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mainRef = useRef(null);
  const slidesRef = useRef(null);
  
  // 슬라이드 데이터
  const slides = [
    {
      id: 0,
      title: "주거 공간의 혁신",
      description: "자연과 조화를 이루는 지속 가능한 주거 공간",
      className: "slide-1"
    },
    {
      id: 1,
      title: "상업 공간의 재해석",
      description: "기능성과 미학을 결합한 현대적 상업 공간",
      className: "slide-2"
    },
    {
      id: 2,
      title: "공공 시설의 새로운 기준",
      description: "커뮤니티를 위한 혁신적인 공공 건축물",
      className: "slide-3"
    }
  ];
  
  // 페이지 로드 시 메인 레이어 페이드 인 효과
  useEffect(() => {
    // 약간의 지연 후 페이드 인 효과 적용
    const timer = setTimeout(() => {
      setMainVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 스크롤 이벤트 핸들러 수정
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      setScrollY(scrollPosition);
      setMainVisible(scrollPosition <= viewportHeight);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 로드 시 실행
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // 슬라이드 전환 애니메이션 완료 처리
  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);
    console.log('Transition ended, ready for next slide');
  }, []);

  // 이전 슬라이드로 이동
  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    
    // 디버깅을 위한 콘솔 로그 추가
    console.log('Prev slide clicked, moving to slide:', currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  }, [isTransitioning, slides.length, currentSlide]);

  // 다음 슬라이드로 이동
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    
    // 디버깅을 위한 콘솔 로그 추가
    console.log('Next slide clicked, moving to slide:', (currentSlide + 1) % slides.length);
  }, [isTransitioning, slides.length, currentSlide]);
  
  // 특정 슬라이드로 이동
  const goToSlide = useCallback((index) => {
    if (isTransitioning || index === currentSlide) return;
    
    setIsTransitioning(true);
    setCurrentSlide(index);
    
    // 디버깅을 위한 콘솔 로그 추가
    console.log('Going to slide:', index);
  }, [isTransitioning, currentSlide]);
  
  // 슬라이드쇼 자동 전환 효과
  useEffect(() => {
    const slideInterval = setInterval(() => {
      if (!isTransitioning) {
        nextSlide();
      }
    }, 5000);
    
    return () => clearInterval(slideInterval);
  }, [isTransitioning, nextSlide]);
  
  // 메인 레이어의 투명도 계산
  const calculateMainOpacity = () => {
    // 화면 높이의 50%를 스크롤하면 완전히 투명해지도록 설정
    const viewportHeight = window.innerHeight;
    const fadeOutPoint = viewportHeight * 0.5;
    
    if (scrollY <= 0) return 1;
    if (scrollY >= fadeOutPoint) return 0;
    
    return 1 - (scrollY / fadeOutPoint);
  };
  
  // 콘텐츠 래퍼의 opacity와 transform 계산 (Main Layer와 반대로)
  const calculateContentStyle = () => {
    // 화면 높이의 70%를 스크롤하면 나타나기 시작하도록 설정
    const viewportHeight = window.innerHeight;
    const startPoint = viewportHeight * 0.7; // 70vh에서 시작
    const fadeInPoint = viewportHeight * 0.9; // 90vh에서 완전히 불투명해지도록
    
    if (scrollY < startPoint) {
      return { 
        opacity: 0, // 70vh 이전에는 완전히 투명
        transform: 'translateY(50px) scale(0.95)'
      };
    }
    
    if (scrollY >= fadeInPoint) {
      return { 
        opacity: 1, // 90vh 이후에는 완전히 불투명
        transform: 'translateY(0) scale(1)'
      };
    }
    
    // startPoint와 fadeInPoint 사이에서 점진적으로 변화
    const progress = (scrollY - startPoint) / (fadeInPoint - startPoint);
    const translateY = 50 - (progress * 50);
    const scale = 0.95 + (progress * 0.05);
    
    return {
      opacity: progress, // 70vh에서 90vh 사이에서 0에서 1로 점진적으로 변화
      transform: `translateY(${translateY}px) scale(${scale})`
    };
  };
  
  const mainOpacity = calculateMainOpacity();
  const contentStyle = calculateContentStyle();

  // 슬라이드 순서 계산 (무한 회전을 위한 배열)
  const getSlideOrder = useCallback(() => {
    // 현재 슬라이드를 중심으로 앞뒤 슬라이드를 배치
    const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    const nextIndex = (currentSlide + 1) % slides.length;
    
    return [prevIndex, currentSlide, nextIndex];
  }, [currentSlide, slides.length]);

  const slideOrder = getSlideOrder();

  // 텍스트 콘텐츠에도 opacity 적용
  const mainContentOpacity = calculateMainOpacity();

  return (
    <div className="app">
      {/* 헤더 섹션 */}
      <header className="header">
        <div className="container">
          <div className="logo">
            S<span className="small-text">m</span>F<span className="small-text">ine</span> Architects
          </div>
          <nav className="nav">
            <ul>
              <li><a href="#home" className="active">홈</a></li>
              <li><a href="#projects">프로젝트</a></li>
              <li><a href="#about">소개</a></li>
              <li><a href="#services">서비스</a></li>
              <li><a href="#contact">문의</a></li>
            </ul>
          </nav>
          <button className="mobile-menu-btn">☰</button>
        </div>
      </header>

      {/* 히어로 배경 - 배경만 fade out */}
      <div 
        className={`hero-background ${mainVisible ? 'visible' : ''}`}
        style={{ 
          opacity: mainOpacity
        }}
      ></div>

      {/* 히어로 내용 - 고정 위치, 스크롤에 따라 opacity 변화 */}
      <div 
        id="home" 
        className="hero-content-fixed"
        ref={mainRef}
        style={{ 
          opacity: mainContentOpacity  // 텍스트 콘텐츠에도 opacity 적용
        }}
      >
        <div className="hero-content">
          <h1>SF Architects - Architecture is</h1>
          <p>a collaboration with clients</p>
          <button className="btn">프로젝트 문의하기</button>
        </div>
      </div>

      {/* 투명도를 조절할 수 있는 공간 */}
      <div 
        className="space-with-opacity"
        style={{ 
          opacity: 0,
          height: '100vh'
        }}
      ></div>
      
      {/* 콘텐츠 래퍼 - 스크롤에 따라 opacity와 transform 조정 */}
      <div 
        className="content-wrapper"
        style={{ 
          opacity: contentStyle.opacity,
          transform: contentStyle.transform
        }}
      >
        
        {/* Identity Layer */}
        <section id="identity" className="identity">
          <div className="container">
            <div className="identity-content">
              <div className="identity-text">
                <h2>우리의 철학</h2>
                <p>SF Architects는 공간과 사람, 환경의 조화로운 관계를 추구합니다. 우리는 단순한 건물이 아닌, 삶의 질을 향상시키는 공간을 창조합니다.</p>
                <div className="identity-stats">
                  <div className="stat-item">
                    <span className="stat-number">15+</span>
                    <span className="stat-label">수상 경력</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">120+</span>
                    <span className="stat-label">완성 프로젝트</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">20+</span>
                    <span className="stat-label">전문 건축가</span>
                  </div>
                </div>
              </div>
              <div className="identity-image">
                <div className="image-container">
                  <div className="image-overlay"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 슬라이드쇼 레이어 - 너비 조정 */}
        <section id="slideshow" className="slideshow">
          <div className="container">
            <div className="slideshow-container">
              <div 
                className={`slides ${isTransitioning ? 'transitioning' : ''}`} 
                ref={slidesRef}
                onTransitionEnd={handleTransitionEnd}
              >
                {slideOrder.map((slideIndex, index) => (
                  <div 
                    key={slideIndex}
                    className={`slide ${slides[slideIndex].className} ${index === 1 ? 'active' : ''}`}
                    style={{ transform: `translateX(${(index - 1) * 100}%)` }}
                  >
                    <div className="slide-content">
                      <h2>{slides[slideIndex].title}</h2>
                      <p>{slides[slideIndex].description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                className="slide-arrow prev-arrow" 
                onClick={(e) => {
                  e.preventDefault();
                  prevSlide();
                }}
              >
                &#10094;
              </button>
              <button 
                className="slide-arrow next-arrow" 
                onClick={(e) => {
                  e.preventDefault();
                  nextSlide();
                }}
              >
                &#10095;
              </button>
              
              <div className="slide-dots always-visible">
                {slides.map((slide, index) => (
                  <span 
                    key={slide.id} 
                    className={`dot ${currentSlide === index ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                  ></span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 포트폴리오 섹션 */}
        <section id="projects" className="projects">
          <div className="container">
            <h2 className="section-title">포트폴리오</h2>
            
            <div className="office-showcase">
              <div 
                className={`office-section ${hoveredOffice === 'sungmun' ? 'expanded' : ''} ${hoveredOffice === 'fine' ? 'shrunk' : ''}`}
                onMouseEnter={() => setHoveredOffice('sungmun')}
                onMouseLeave={() => setHoveredOffice(null)}
              >
                <div className="office-content">
                  <h3>성문 건축사사무소</h3>
                  <p className="office-description">
                    혁신적인 디자인과 기능성을 결합한 건축 솔루션을 제공합니다. 
                    도시 환경과 조화를 이루는 지속 가능한 건축을 추구합니다.
                  </p>
                  <div className="project-grid">
                    {[1, 2, 3].map((project) => (
                      <div key={project} className="project-card">
                        <div className="project-image sungmun-image"></div>
                        <div className="project-info">
                          <h4>성문 프로젝트 {project}</h4>
                          <p>혁신적인 공간 설계</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn office-btn">자세히 보기</button>
                </div>
              </div>
              
              <div 
                className={`office-section ${hoveredOffice === 'fine' ? 'expanded' : ''} ${hoveredOffice === 'sungmun' ? 'shrunk' : ''}`}
                onMouseEnter={() => setHoveredOffice('fine')}
                onMouseLeave={() => setHoveredOffice(null)}
              >
                <div className="office-content">
                  <h3>화인종합 건축사사무소</h3>
                  <p className="office-description">
                    전통과 현대를 아우르는 독창적인 건축 디자인을 제공합니다.
                    클라이언트의 비전을 실현하는 맞춤형 건축 서비스를 지향합니다.
                  </p>
                  <div className="project-grid">
                    {[1, 2, 3].map((project) => (
                      <div key={project} className="project-card">
                        <div className="project-image fine-image"></div>
                        <div className="project-info">
                          <h4>화인 프로젝트 {project}</h4>
                          <p>혁신적인 공간 설계</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn office-btn">자세히 보기</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 문의하기 섹션 */}
        <section id="contact" className="contact">
          <div className="container">
            <h2 className="section-title">문의하기</h2>
            <p>프로젝트에 대한 문의 사항이 있으시면 언제든지 연락 주세요.</p>
            <button className="btn">연락하기</button>
          </div>
        </section>

        {/* 푸터 */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <h3>SF Architects</h3>
                <p>혁신적인 디자인과 지속 가능한 건축 솔루션</p>
              </div>
              <div className="footer-section">
                <h3>연락처</h3>
                <p>서울특별시 강남구 테헤란로 123</p>
                <p>이메일: info@sfarchitects.com</p>
                <p>전화: 02-123-4567</p>
              </div>
              <div className="footer-section">
                <h3>바로가기</h3>
                <ul>
                  <li><a href="#home">홈</a></li>
                  <li><a href="#projects">프로젝트</a></li>
                  <li><a href="#about">소개</a></li>
                  <li><a href="#services">서비스</a></li>
                  <li><a href="#contact">문의</a></li>
                </ul>
              </div>
            </div>
            <div className="copyright">
              &copy; {new Date().getFullYear()} SF Architects. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;