import React, { useState, useEffect, useRef } from "react";
import "../styles/home.scss";
import { useInterview } from "../hooks/useinterview.js";
import { useNavigate, useLocation } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const Home = () => {
  const { loading, generateReport, reports = [], getReports } = useInterview();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [isLeftShrunk, setIsLeftShrunk] = useState(false);
  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [isLightMode, setIsLightMode] = useState(false);

  const resumeInputRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getReports();
  }, []);

  const sortedReports = [...reports].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleShare = async () => {
  const shareData = {
    title: "SkillSight",
    text: "Check out this awesome interview prep app!",
    url: window.location.origin, // your app link
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // fallback (desktop)
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard!");
    }
  } catch (err) {
    console.error("Share failed:", err);
  }
};

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current?.files[0];

    const finalTitle =
      title.trim() ||
      jobDescription.trim().slice(0, 30) ||
      "Untitled Report";

    try {
      const data = await generateReport({
        title: finalTitle,
        jobDescription,
        selfDescription,
        resumeFile,
      });

      if (data?._id) {
        navigate(`/interview/${data._id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`app-layout ${isLightMode ? "app-layout--light" : ""}`}>

      <main className={`home-page ${isLeftShrunk ? "sidebar-collapsed" : ""}`}>

        {/* SIDEBAR */}
        <aside className="recent-reports">
          <div className="sidebar-header">
            {!isLeftShrunk && <h2>Recents</h2>}

            <button
              className="shrink-toggle"
              onClick={() => setIsLeftShrunk(!isLeftShrunk)}
            >
              {isLeftShrunk ? "→" : "☰"}
            </button>
          </div>

          {!isLeftShrunk && (
            <div className="reports-list">
              {loading ? (
                <p>Loading...</p>
              ) : sortedReports.length ? (
                sortedReports.map((report) => (
                  <div
                    key={report._id}
                    className={`report-item ${
                      location.pathname === `/interview/${report._id}`
                        ? "active"
                        : ""
                    }`}
                    onClick={() => navigate(`/interview/${report._id}`)}
                  >
                    {report.title || "Untitled"}
                  </div>
                ))
              ) : (
                <p>No reports</p>
              )}
            </div>
          )}
        </aside>

        {/* MAIN AREA */}
        <div className="main-content">

          {/* HEADER */}
          <header className="chatgpt-header">
            <div className="header-inner">

              <div className="header-left">
                <h1>SkillSight</h1>
              </div>

              <div className="header-right">
                {/* Share Icon */}
                <i className="ri-share-2-line share-icon" 
                onClick={handleShare}
                ></i>
                <span className="share-text">Share</span>

                {/* Theme Toggle (optional but useful) */}
                <i
                  className={`ri-${isLightMode ? "moon-line" : "sun-line"} share-icon`}
                  onClick={() => setIsLightMode(!isLightMode)}
                ></i>
              </div>

            </div>
          </header>

          {/* CONTENT */}
          <div className="content-container">

          <div className="title-input">
             <input
                value={title}
               onChange={(e) => setTitle(e.target.value)}
               placeholder="Enter title for this report (optional)"
                />
</div>

            <div className="chat-box">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Ask anything about your target role..."
              />
            </div>

            <div className="profile-row">

              <textarea
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                placeholder="Add your experience, skills..."
              />

              <label htmlFor="resume-upload" className="upload-btn">
                Resume
              </label>

              <input
                id="resume-upload"
                ref={resumeInputRef}
                type="file"
                hidden
                accept=".pdf"
                onChange={(e) =>
                  setFileName(e.target.files[0]?.name || "")
                }
              />
            </div>

            {fileName && <p className="file-name">{fileName}</p>}

            <button
              onClick={handleGenerateReport}
              className="generate-btn"
            >
              Generate
            </button>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;