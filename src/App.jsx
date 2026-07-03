import { useState } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState("")
const [jobRole, setJobRole] = useState("")
const [company, setCompany] = useState("")
const [skills, setSkills] = useState("")
const [error, setError] = useState("")
const [coverLetter, setCoverLetter] = useState("")
const [copied, setCopied] = useState(false)
const [loading, setLoading] = useState(false)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY
 const generateCoverLetter =  async () => {
    if (!name.trim() || !jobRole.trim() || !company.trim() || !skills.trim()) {
      setError("Please fill in all fields.")
      
    setCoverLetter("")
    return 
  }

 try{
  setError("")
setLoading(true)
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
  {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  }, body: JSON.stringify({
  contents: [
    {
      parts: [
        {
          text: `Write a professional cover letter for the following candidate.

Candidate Name: ${name}
Job Role: ${jobRole}
Target Company: ${company}
Key Skills: ${skills}

Instructions:
- Keep the cover letter short and brief.
- Use a professional and confident tone.
- Do not invent work experience or achievements.
- Focus only on the provided skills and enthusiasm for the role.
- Do not include placeholders like phone number, email, address, or date.
- Start with "Dear Hiring Manager,".
- End with "Sincerely," followed by the candidate's name.`
        }
      ]
    }
  ]
})
});
 if (!response.ok) {
  throw new Error("Gemini API request failed")
}
const data = await response.json()
const generatedText =
  data.candidates[0].content.parts[0].text
 
 setCoverLetter(generatedText) }
 catch (error){
    setError("Failed to generate cover letter.")
    console.error(error)
 } 

 finally {
  setLoading(false)
}

 }
 
const copyToClipboard = () => {
  navigator.clipboard.writeText(coverLetter)
  setCopied(true)
    setTimeout(() => {
    setCopied(false)
  }, 2000)
}
  return (
   <div className='container'>
  <h1>AI Cover Letter Generator</h1>
    <form className='form'>
      <div>
        <label>Candidate Name</label>
        <input type="text" placeholder="Varun Sharma" value={name}
  onChange={(e) => setName(e.target.value)}/>
      </div>

      <div>
        <label>Job Role</label>
        <input type="text" placeholder="Frontend Developer" value={jobRole}
  onChange={(e) => setJobRole(e.target.value)} />
      </div>

      <div>
        <label>Target Company</label>
        <input type="text" placeholder="Prodesk IT" value={company}
  onChange={(e) => setCompany(e.target.value)} />
      </div>

      <div>
        <label>Key Skills</label>
        <textarea  placeholder="Example: React, JavaScript, HTML, CSS"
  value={skills}
  onChange={(e) => setSkills(e.target.value)}
  rows="4"
/>
      </div>

     <button
  type="button"
  onClick={generateCoverLetter} disabled={loading}
>
 {loading ? "Generating..." : "Generate Cover Letter"}
</button>
    </form>
{error && <p className="error">{error}</p>}
    <div className='output'>
  <h2>Generated Cover Letter</h2>
  <pre>{coverLetter || "Your AI-generated cover letter will appear here."}</pre>
</div>
<div className='copy-btn'>
<button disabled={!coverLetter || loading}
  onClick={copyToClipboard}
>
  Copy to Clipboard
</button>
</div>
{copied && <p className='success'>✅ Copied to clipboard!</p>}

</div>

  )
}

export default App
