import React, { useState , useEffect} from 'react'
import "../styles/interview.scss"
import { useInterview } from '../hooks/useinterview.js'
import { useParams } from 'react-router-dom'
import Header from '../components/Header.jsx'

const Interview = () => {
    const { report , getReportById } = useInterview()

    const [activeSection, setActiveSection] = useState("technical")
    const [activeTechnicalIndex, setActiveTechnicalIndex] = useState(0)
    const [activeBehavioralIndex, setActiveBehavioralIndex] = useState(null)
    const [isLeftShrunk, setIsLeftShrunk] = useState(false)
    const [isLightMode, setIsLightMode] = useState(false)

    const { interviewId } = useParams()

    const handleDownload = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/interview/resume/pdf/${interviewId}`,
          {
            method: "POST",
            credentials: "include",
          }
        )

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = url
        a.download = "resume.pdf"

        document.body.appendChild(a)
        a.click()

        a.remove()
        window.URL.revokeObjectURL(url)

      } catch (error) {
        console.error(error)
      }
    }

    useEffect(() => {
      if (interviewId) {
        getReportById(interviewId)
      }
    }, [interviewId])

    if (!report) return <h1>Loading...</h1>

    const technicalQuestions = report.technicalQuestions || []
    const behavioralQuestions = report.behavioralQuestions || []
    const preparationPlan = report.preparationPlan || []

    const toggleTechnical = (index) => {
      setActiveTechnicalIndex(prev => prev === index ? null : index)
    }

    const toggleBehavioral = (index) => {
      setActiveBehavioralIndex(prev => prev === index ? null : index)
    }

    return (
      <div className={`app-layout ${isLightMode ? "app-layout--light" : ""}`}>

        {/* 🔥 LEFT SIDEBAR (FULL HEIGHT) */}
        <aside className={`interview-layout__left ${isLeftShrunk ? 'shrunk' : ''}`}>
          
          <button 
            className={`shrink-toggle ${isLeftShrunk ? "collapsed" : "expanded"}`}
            onClick={() => setIsLeftShrunk(!isLeftShrunk)}
            aria-label={isLeftShrunk ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="shrink-toggle__icon" aria-hidden="true" />
          </button>

          <p className='side-heading'>Sections</p>

          <button
            className={`nav-item ${activeSection === "technical" ? "nav-item--active" : ""}`}
            data-section="technical"
            onClick={() => setActiveSection("technical")}
          >
            <span className='nav-icon' aria-hidden='true'>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h10M4 18h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <span className='text'>Technical</span>
          </button>

          <button
            className={`nav-item ${activeSection === "behavioral" ? "nav-item--active" : ""}`}
            data-section="behavioral"
            onClick={() => setActiveSection("behavioral")}
          >
            <span className='nav-icon' aria-hidden='true'>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.8" />
                <path d="M5 19.2c1.6-2.6 3.8-3.8 7-3.8s5.4 1.2 7 3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <span className='text'>Behavioral</span>
          </button>

          <button
            className={`nav-item ${activeSection === "roadmap" ? "nav-item--active" : ""}`}
            data-section="roadmap"
            onClick={() => setActiveSection("roadmap")}
          >
            <span className='nav-icon' aria-hidden='true'>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 19v-5m7 5V9m7 10V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <span className='text'>Roadmap</span>
          </button>

          <button
            className={`nav-item ${activeSection === "score" ? "nav-item--active" : ""}`}
            data-section="score"
            onClick={() => setActiveSection("score")}
          >
            <span className='nav-icon' aria-hidden='true'>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.35" />
                <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </span>
            <span className='text'>Match Score</span>
          </button>

          <button onClick={handleDownload} className='nav-item' data-section="download">
            <span className='nav-icon' aria-hidden='true'>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className='text'>Download Resume</span>
          </button>
        </aside>

        {/* 🔥 RIGHT AREA (HEADER + CONTENT) */}
        <div className="right-area">

          <Header 
            isLightMode={isLightMode}
            onToggleTheme={() => setIsLightMode(prev => !prev)}
          />

          <main className='interview-page'>

            <section className='interview-layout'>

              {/* 🔥 MAIN CONTENT */}
              <section className='interview-layout__main'>

                {activeSection === "technical" && (
                  <>
                    <header className='content-header'>
                      <h1>
                        Technical Questions 
                        <span className='question-count'>{technicalQuestions.length}</span>
                      </h1>
                    </header>

                    <div className='question-group'>
                      {technicalQuestions.map((item, index) => (
                        <article className={`question-card ${activeTechnicalIndex === index ? "question-card--open" : ""}`} key={index}>
                          <button
                            className='question-card__toggle'
                            onClick={() => toggleTechnical(index)}
                            aria-expanded={activeTechnicalIndex === index}
                          >
                            <span className='question-card__number'>{index + 1}</span>
                            <span className='question-card__question'>{item.question}</span>
                            <span className='question-card__chevron' aria-hidden='true'>›</span>
                          </button>

                          <div className={`question-card__details ${activeTechnicalIndex === index ? "question-card__details--open" : ""}`}>
                            <div className='question-card__details-inner'>
                              <p>{item.answer}</p>
                            </div>
                          </div>
                        </article>
                      ))}
                      {technicalQuestions.length === 0 && (
                        <article className='question-card'>
                          <p className='question-card__meta'>No technical questions available for this report yet.</p>
                        </article>
                      )}
                    </div>
                  </>
                )}

                {activeSection === "behavioral" && (
                  <>
                    <header className='content-header'>
                      <h1>
                        Behavioral Questions
                        <span className='question-count'>{behavioralQuestions.length}</span>
                      </h1>
                    </header>

                    <div className='question-group'>
                      {behavioralQuestions.map((item, index) => (
                        <article className={`question-card ${activeBehavioralIndex === index ? "question-card--open" : ""}`} key={index}>
                          <button
                            className='question-card__toggle'
                            onClick={() => toggleBehavioral(index)}
                            aria-expanded={activeBehavioralIndex === index}
                          >
                            <span className='question-card__number'>{index + 1}</span>
                            <span className='question-card__question'>{item.question}</span>
                            <span className='question-card__chevron' aria-hidden='true'>›</span>
                          </button>

                          <div className={`question-card__details ${activeBehavioralIndex === index ? "question-card__details--open" : ""}`}>
                            <div className='question-card__details-inner'>
                              <p>{item.answer}</p>
                            </div>
                          </div>
                        </article>
                      ))}
                      {behavioralQuestions.length === 0 && (
                        <article className='question-card'>
                          <p className='question-card__meta'>No behavioral questions available for this report yet.</p>
                        </article>
                      )}
                    </div>
                  </>
                )}

                {activeSection === "roadmap" && (
                  <>
                    <header className='content-header'>
                      <h1>
                        Preparation Roadmap
                        <span className='question-count'>{preparationPlan.length}</span>
                      </h1>
                    </header>

                    <div className='roadmap-list'>
                      {preparationPlan.map((item, index) => (
                        <article className='roadmap-item' key={`${item.day}-${index}`}>
                          <span className='roadmap-node' />
                          <div className='roadmap-content'>
                            <p className='roadmap-day'>Day {item.day}</p>
                            <p className='roadmap-focus'>
                              {Array.isArray(item.focus) ? item.focus.join(", ") : item.focus}
                            </p>
                            <ul className='roadmap-tasks'>
                              {(item.task || []).map((task, taskIndex) => (
                                <li key={`${index}-${taskIndex}`}>{task}</li>
                              ))}
                            </ul>
                          </div>
                        </article>
                      ))}
                      {preparationPlan.length === 0 && (
                        <article className='question-card'>
                          <p className='question-card__meta'>No preparation roadmap available for this report yet.</p>
                        </article>
                      )}
                    </div>
                  </>
                )}

                {activeSection === "score" && (
                  <>
                    <header className='content-header'>
                      <h1>Match Score</h1>
                    </header>
                    <div className='question-group'>
                      <div className='score-ring' style={{ "--score": report.matchScore }}>
                        <div className='score-ring__inner'>
                          <span className='score-ring__value'>{report.matchScore}%</span>
                        </div>
                      </div>
                      <p className='score-note'>
                        Your resume/profile currently matches this role at {report.matchScore}%.
                      </p>
                    </div>
                  </>
                )}

              </section>

            </section>
          </main>

        </div>
      </div>
    )
}

export default Interview