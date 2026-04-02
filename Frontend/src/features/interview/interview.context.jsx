import { createContext, useState } from "react"

export const InterviewContext = createContext()

export const InterviewProvider = ({ children }) => {

    const [report, setreport] = useState(null)
    const [reports, setreports] = useState([])
    const [loading, setloading] = useState(false) // ✅ FIX

    return (
        <InterviewContext.Provider 
            value={{ loading, setloading, report, setreport, reports, setreports }}
        >
            {children}
        </InterviewContext.Provider>
    )
}