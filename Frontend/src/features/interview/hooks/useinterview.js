import {getAllInterviewReports, generateInterviewReport,getInterviewReportById, generateResumePdf} from "../services/interview.api"
import { useContext , useEffect} from "react"
import { InterviewContext } from '../interview.context'
import { useParams } from "react-router"


export const useInterview = () =>{
    
    // taking out our interviewContext //
    const context = useContext(InterviewContext)

    if(!context){
        throw new Error("useInterview must be used within an  InterviewProvider")
    }

    const {loading, setloading, report, setreport, reports, setreports} = context

     const { interviewId } = useParams();

     useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [interviewId])

    const generateReport = async({ jobDescription, selfDescription, resumeFile}) =>{
        setloading(true)
        try{
            const response = await generateInterviewReport({ jobDescription, selfDescription,resumeFile})

            console.log("Full RESPONSE:", response)

            setreport(response.interviewReport)

            console.log("RETURING:", response.interviewReport)

            return response.interviewReport

        } catch(error){
            
          console.log(error)
        } finally{
            setloading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setloading(true)
        let response = null

    try {
        response = await getInterviewReportById(interviewId)
        
        setreport(response.interviewReport)
    
  } catch (error) {
    console.log(error)
  } finally {
    setloading(false)
  }
  return response.interviewReport
}

    const getReports = async() =>{
        setloading(true)
        try{
            const response = await getAllInterviewReports()
            setreports(response.interviewReports)
        } catch(error){
            console.log(error)
        } finally{
            setloading(false)
        }
    }

    const getResumePdf = async (interviewReportId) =>{
        setloading(true)
        let response = null

        try{
            response = await generateResumePdf({ interviewReportId})
            const url = window.URL.createObjectURL(new Blob([response], {type: "application/pdf"}))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch(error){
            console.log(error)
        } finally{
            setloading(false)
        }

    }

    return {loading, report, reports, generateReport, getReportById, getReports, getResumePdf}
}

