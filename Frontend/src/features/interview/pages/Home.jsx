import React, { useState, useEffect, useRef } from 'react'
import "../styles/home.scss"
import { useInterview } from '../hooks/useinterview.js'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const { loading, generateReport, reports, getReports } = useInterview()
  const [jobDescription, setJobDescription] = useState("")
  const [selfDescription, setSelfDescription] = useState("")
  const resumeInputRef = useRef()

  const navigate = useNavigate()

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0]

    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile
    })

    console.log("FULL RESPONSE:", data)

    if (!data) {
      console.error("Something is wrong:", data)
      return
    }

    navigate(`/interview/${data._id}`)
  }

  useEffect(() => {
    getReports()
  }, [])

  console.log("REPORTS:", reports)

  if (loading) {
    return (
      <main className='loading-screen'>
        <h1> Loading your interview plan... </h1>
      </main>
    )
  }

  return (
    <main className='home-page'>

      {/* ✅ LEFT SIDE - Recent Reports */}
      {reports?.length > 0 && (
        <section className='recent-reports'>
          <h2>My Recent Interview Plans</h2>
          <ul className='reports-list'>
            {reports.map(report => (
              <li
                key={report._id}
                className='report-item'
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <h3>{report.title || 'Untitled Position'}</h3>
                <p className='report-meta'>
                  Generated on {new Date(report.createdAt).toLocaleDateString()}
                </p>
                <p className={`match-score ${
                  report.matchScore >= 80
                    ? 'score--high'
                    : report.matchScore >= 60
                    ? 'score--mid'
                    : 'score--low'
                }`}>
                  Match Score: {report.matchScore}%
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ✅ RIGHT SIDE - Main Content */}
      <div className='main-content'>
        <header className='chatgpt-header'>
          <h1>What&apos;s on your mind today?</h1>
        </header>

        <section className='chatgpt-composer' aria-label='Interview plan form'>
          <div className='chatgpt-composer__input-shell'>
            <textarea
              onChange={(e) => setJobDescription(e.target.value)}
              className='chatgpt-composer__textarea'
              name='jobDescription'
              id='jobDescription'
              placeholder='Ask anything about your target role, then generate your interview strategy...'
            />
            <div className='chatgpt-composer__actions'>
              <span className='char-counter'>
                {jobDescription.length} / 5000
              </span>
              <button
                onClick={handleGenerateReport}
                className='generate-btn'
                type='button'
              >
                Generate
              </button>
            </div>
          </div>

          <div className='profile-row'>
            <label className='upload-pill' htmlFor='resume'>
              Upload resume (PDF)
            </label>
            <input
              ref={resumeInputRef}
              hidden
              type='file'
              name='resume'
              id='resume'
              accept='.pdf'
            />

            <textarea
              onChange={(e) => setSelfDescription(e.target.value)}
              className='profile-row__textarea'
              name='selfDescription'
              id='selfDescription'
              placeholder='Or add a quick self description (experience, skills, years).'
            />
          </div>

          <p className='footer-info'>
            Add either resume or self description for best results.
          </p>
        </section>
      </div>

    </main>
  )
}

export default Home