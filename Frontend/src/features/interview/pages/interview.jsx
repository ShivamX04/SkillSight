import React, { useState, useEffect } from "react";
import "../styles/interview.scss";
import { useInterview } from "../hooks/useinterview.js";
import { useParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import "remixicon/fonts/remixicon.css";

import {
  Code,
  User,
  Map,
  BarChart3,
  Download
} from "lucide-react";

const Interview = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const { report, getReportById } = useInterview();

  const [activeSection, setActiveSection] = useState("technical");
  const [activeTechnicalIndex, setActiveTechnicalIndex] = useState(0);
  const [activeBehavioralIndex, setActiveBehavioralIndex] = useState(null);
  const [isLeftShrunk, setIsLeftShrunk] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  const { interviewId } = useParams();

  // ✅ SAFE DATA ACCESS
  const technicalQuestions = report?.technicalQuestions || [];
  const behavioralQuestions = report?.behavioralQuestions || [];
  const preparationPlan = report?.preparationPlan || [];

  // ✅ SHARE FUNCTION (FIXED)
  const handleShare = async () => {
    if (!report) return;

    const textContent = `
📊 Interview Report

🧠 Technical Questions: ${technicalQuestions.length}
💬 Behavioral Questions: ${behavioralQuestions.length}
📈 Match Score: ${report.matchScore}%

🚀 Generated via SkillSight
`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Interview Report - SkillSight",
          text: textContent,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(textContent);
        alert("Report copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  // ✅ DOWNLOAD FUNCTION (ENV READY)
  const handleDownload = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/interview/resume/pdf/${interviewId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";

      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  if (!report) return <p>Loading report...</p>;

  const toggleTechnical = (index) => {
    setActiveTechnicalIndex((prev) => (prev === index ? null : index));
  };

  const toggleBehavioral = (index) => {
    setActiveBehavioralIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className={`app-layout ${isLightMode ? "app-layout--light" : ""}`}>
      
      {/* 🔥 SIDEBAR */}
      <aside className={`interview-layout__left ${isLeftShrunk ? "shrunk" : ""}`}>
        
        <button
          className={`shrink-toggle ${isLeftShrunk ? "collapsed" : "expanded"}`}
          onClick={() => setIsLeftShrunk(!isLeftShrunk)}
        >
          ☰
        </button>

        <p className="side-heading">Sections</p>

        <button
          className={`nav-item ${activeSection === "technical" ? "nav-item--active" : ""}`}
          onClick={() => setActiveSection("technical")}
        >
          <span className="nav-icon"><Code size={18} /></span>
          <span className="text">Technical</span>
        </button>

        <button
          className={`nav-item ${activeSection === "behavioral" ? "nav-item--active" : ""}`}
          onClick={() => setActiveSection("behavioral")}
        >
          <span className="nav-icon"><User size={18} /></span>
          <span className="text">Behavioral</span>
        </button>

        <button
          className={`nav-item ${activeSection === "roadmap" ? "nav-item--active" : ""}`}
          onClick={() => setActiveSection("roadmap")}
        >
          <span className="nav-icon"><Map size={18} /></span>
          <span className="text">Roadmap</span>
        </button>

        <button
          className={`nav-item ${activeSection === "score" ? "nav-item--active" : ""}`}
          onClick={() => setActiveSection("score")}
        >
          <span className="nav-icon"><BarChart3 size={18} /></span>
          <span className="text">Match Score</span>
        </button>

        <button onClick={handleDownload} className="nav-item">
          <span className="nav-icon"><Download size={18} /></span>
          <span className="text">Download Resume</span>
        </button>
      </aside>

      {/* 🔥 RIGHT AREA */}
      <div className="right-area">

        <Header
          isLightMode={isLightMode}
          onToggleTheme={() => setIsLightMode((prev) => !prev)}
          onShare={handleShare}
        />

        <main className="interview-page">
          <section className="interview-layout">
            <section className="interview-layout__main">

              {/* 🔹 TECHNICAL */}
              {activeSection === "technical" && (
                <>
                  <header className="content-header">
                    <h1>
                      Technical Questions
                      <span className="question-count">{technicalQuestions.length}</span>
                    </h1>
                  </header>

                  <div className="question-group">
                    {technicalQuestions.map((item, index) => (
                      <article
                        key={index}
                        className={`question-card ${
                          activeTechnicalIndex === index ? "question-card--open" : ""
                        }`}
                      >
                        <button
                          className="question-card__toggle"
                          onClick={() => toggleTechnical(index)}
                        >
                          <span className="question-card__number">{index + 1}</span>
                          <span className="question-card__question">{item.question}</span>
                          <span className="question-card__chevron">›</span>
                        </button>

                        <div
                          className={`question-card__details ${
                            activeTechnicalIndex === index ? "question-card__details--open" : ""
                          }`}
                        >
                          <div className="question-card__details-inner">
                            <p>{item.answer}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}

              {/* 🔹 BEHAVIORAL */}
              {activeSection === "behavioral" && (
                <>
                  <header className="content-header">
                    <h1>
                      Behavioral Questions
                      <span className="question-count">{behavioralQuestions.length}</span>
                    </h1>
                  </header>

                  <div className="question-group">
                    {behavioralQuestions.map((item, index) => (
                      <article
                        key={index}
                        className={`question-card ${
                          activeBehavioralIndex === index ? "question-card--open" : ""
                        }`}
                      >
                        <button
                          className="question-card__toggle"
                          onClick={() => toggleBehavioral(index)}
                        >
                          <span className="question-card__number">{index + 1}</span>
                          <span className="question-card__question">{item.question}</span>
                          <span className="question-card__chevron">›</span>
                        </button>

                        <div
                          className={`question-card__details ${
                            activeBehavioralIndex === index ? "question-card__details--open" : ""
                          }`}
                        >
                          <div className="question-card__details-inner">
                            <p>{item.answer}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}

              {/* 🔹 ROADMAP */}
              {activeSection === "roadmap" && (
                <>
                  <header className="content-header">
                    <h1>
                      Preparation Roadmap
                      <span className="question-count">{preparationPlan.length}</span>
                    </h1>
                  </header>

                  <div className="roadmap-list">
                    {preparationPlan.map((item, index) => (
                      <div key={index} className="roadmap-item">
                        <span className="roadmap-node" />
                        <div>
                          <p className="roadmap-day">Day {item.day}</p>
                          <p className="roadmap-focus">{item.focus}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* 🔹 SCORE */}
              {activeSection === "score" && (
                <>
                  <header className="content-header">
                    <h1>Match Score</h1>
                  </header>

                  <div className="question-group">
                    <p className="score-title">Your Match Score</p>

                    <div
                      className="score-ring"
                      style={{ "--score": report.matchScore }}
                    >
                      <div className="score-ring__inner">
                        <span className="score-ring__value">
                          {report.matchScore}%
                        </span>
                      </div>
                    </div>

                    <p className="score-note">
                      Your resume/profile matches this role at {report.matchScore}%.
                    </p>
                  </div>
                </>
              )}

            </section>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Interview;