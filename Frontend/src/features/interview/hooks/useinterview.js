import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf
} from "../services/interview.api";

import { useContext } from "react";
import { InterviewContext } from "../interview.context";

export const useInterview = () => {

  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const {
    loading,
    setloading,
    report,
    setreport,
    reports,
    setreports
  } = context;

  // ✅ Generate report
  const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    setloading(true);

    try {
      const response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile
      });

      setreport(response.interviewReport);
      return response.interviewReport;

    } catch (error) {
      console.log(error);
      return null;
    } finally {
      setloading(false);
    }
  };

  // ✅ Get single report
  const getReportById = async (interviewId) => {
    setloading(true);

    try {
      const response = await getInterviewReportById(interviewId);
      setreport(response.interviewReport);
      return response.interviewReport;

    } catch (error) {
      console.log(error);
      return null;
    } finally {
      setloading(false);
    }
  };

  // ✅ Get all reports
  const getReports = async () => {
    setloading(true);

    try {
      const response = await getAllInterviewReports();
      setreports(response.interviewReports);

    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  // ✅ Download PDF
  const getResumePdf = async (interviewReportId) => {
    setloading(true);

    try {
      const response = await generateResumePdf({ interviewReportId });

      const url = window.URL.createObjectURL(
        new Blob([response], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();

    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  // ✅ RETURN (IMPORTANT)
  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    getResumePdf
  };
};
