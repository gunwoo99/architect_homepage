import React, { useState } from 'react';
import './App.css';

function App() {
  const [hoveredOffice, setHoveredOffice] = useState(null);

  return (
    <div className="app">
      {/* 헤더 섹션 */}
      <header className="header">
        <div className="container">
          <div className="logo">SF Architects</div>
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

      {/* 히어로 섹션 */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>SF Architects - 건축의 새로운 기준</h1>
          <p>혁신적인 디자인과 지속 가능한 건축 솔루션을 제공합니다</p>
          <button className="btn">프로젝트 문의하기</button>
        </div>
      </section>

      {/* 포트폴리오 섹션 - 수정된 부분 */}
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
  );
}

export default App;