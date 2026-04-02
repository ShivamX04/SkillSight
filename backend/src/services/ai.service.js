const Groq = require("groq-sdk");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});
 
const interviewReportSchema = z.object({
  title: z.string().default("Interview Report"),

  matchScore: z.number(),

  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),

  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.array(z.string()),
      tasks: z.array(z.string()),
    })
  ),

  title: z.string().describe("The title of the job for which the interview report is generated"),
  
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

  const prompt = `
You are an AI interviewer.

Analyze the candidate profile and job description and generate a COMPLETE interview preparation report.

STRICT RULES:
- Return ONLY valid JSON
- Do NOT include markdown
- Do NOT include explanations
- DO NOT leave any array empty
- Generate:
  - matchScore (0–100)
  - 5 technicalQuestions
  - 3 behavioralQuestions
  - 3 skillGaps
  - 5 preparationPlan days

JSON FORMAT:
{
  "title": "string",
  "matchScore": number,
  "technicalQuestions": [
    {
      "question": "...",
      "intention": "...",
      "answer": "..."
    }
  ],
  "behavioralQuestions": [
    {
      "question": "...",
      "intention": "...",
      "answer": "..."
    }
  ],
  "skillGaps": [
    {
      "skill": "...",
      "severity": "low | medium | high"
    }
  ],
  "preparationPlan": [
    {
      "day": number,
      "focus": ["..."],
      "tasks": ["..."]
    }
  ]
}

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // 🔥 best free model
      messages: [
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const raw = response.choices[0].message.content;

    const parsedData = JSON.parse(raw);

    const result = interviewReportSchema.safeParse(parsedData);

if (!result.success) {
  console.log("ZOD ERROR:", result.error);

  return {
    title: "Fallback Report",
    matchScore: 50,
    technicalQuestions: [],
    behavioralQuestions: [],
    skillGaps: [],
    preparationPlan: [],
  };
}

return result.data;

  /*  return validatedData; */

  }  catch (err) {
  console.log("FULL ERROR:", err);
  console.log("AI RESPONSE:", err?.response?.data);
 
  const models = await groq.models.list();
console.log(models.data);

  throw err; // ❗ temporarily throw original error
}
}

async function generatePdfFromHtml(htmlContent){
     const browser = await puppeteer.launch()
     const page = await browser.newPage();
     await page.setContent(htmlContent, {waitUntil: "networkidle0"})

     const pdfBuffer = await page.pdf({ 
      format: "A4", margin:{
        top: "20mm",
        bottom:"20mm", 
        left:"15mm", 
        right:"15mm"
        }
      })

     await browser.close()

     return pdfBuffer
}

async function generateResumePdf({resume, selfDescription, jobDescription}){
   
  const resumePdfSchema = z.object({
      html: z.string().describe("The HTML content of the resume which can be converted to PDF using puepeteer")
  })

   const prompt = `
You are a professional resume generator.

STRICT RULES:
- Return ONLY valid JSON
- Do NOT include markdown
- Do NOT include explanations
- Do NOT return null
- ALWAYS generate full HTML resume
- HTML must be complete (<html>, <head>, <body>)
- Use clean formatting with headings and sections

JSON FORMAT:
{
  "html": "<html>FULL RESUME HTML HERE</html>"
}

Generate a professional resume using:

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`

  const response = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    { role: "user", content: prompt }
  ],
  response_format: { type: "json_object" } // ✅ correct way
})

const raw = response.choices[0].message.content
const jsonContent = JSON.parse(raw)
console.log("RAW AI RESPONSE:", raw)

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

  return pdfBuffer
}
 

module.exports = {generateInterviewReport, generateResumePdf}
