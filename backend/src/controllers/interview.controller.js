const pdfParse = require("pdf-parse")
const interviewReportModel = require("../models/interviewReport.model")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")

console.log("PDF parser type: ", typeof pdfParse)
/** 
 * @description Generate interview report
 */
async function generateInterviewReportController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required"
      })
    }

    // ✅ safer PDF parsing
    const data = await pdfParse(req.file.buffer)
    console.log("FILE: ", req.file)
    const resumeContent = data.text

    const { selfDescription, jobDescription } = req.body

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription
    })

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeContent,
      selfDescription,
      jobDescription,
      ...interviewReportByAi
    })

    res.status(201).json({
      message: "Interview Report generated successfully",
      interviewReport
    })

  } catch (error) {
    console.error("ERROR in generateInterviewReportController:", error)
    res.status(500).json({
      message: "Error generating interview report",
      error: error.message
    })
  }
}

/**
 * @description Get interview report by ID
 */
async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id
    })

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found."
      })
    }

    res.status(200).json({
      message: "Interview report fetched successfully.",
      interviewReport
    })

  } catch (error) {
    console.error("ERROR in getInterviewReportByIdController:", error)
    res.status(500).json({
      message: "Error fetching interview report",
      error: error.message
    })
  }
}

/**
 * @description Get all interview reports
 */
async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await interviewReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("-resume -selfDescription -__v -technicalQuestion -behavioralQuestions -skillGaps -preperationPlan")

    res.status(200).json({
      message: "Interview reports fetched successfully",
      interviewReports
    })

  } catch (error) {
    console.error("ERROR in getAllInterviewReportsController:", error)
    res.status(500).json({
      message: "Error fetching reports",
      error: error.message
    })
  }
}

/**
 * @description Generate resume PDF
 */
async function generateResumePdfController(req, res) {
  try {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found."
      })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({
      resume,
      jobDescription,
      selfDescription
    })

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)

  } catch (error) {
    console.error("PDF ERROR:", error)
    res.status(500).json({
      message: "Error generating PDF",
      error: error.message
    })
  }
}


/**
 * ✅ EXPORT ALL CONTROLLERS (CRITICAL FIX)
 */
module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
  
}