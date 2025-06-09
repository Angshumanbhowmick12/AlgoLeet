import React,{useState,useEffect} from 'react'
import { Editor } from '@monaco-editor/react'
import { useTheme } from '../components/theme-provider'
import {
     Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  BookOpen,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
} from "lucide-react"
import {Link,useParams} from "react-router-dom"
import { useProblemStore } from '../store/useProblemStore'
import { useExecutionStore } from '../store/useExecutionSection'
import { getLanguageId } from '../lib/lang'
import Submission from '../components/Submission'
import SubmissionList from '../components/SubmissionList'
import { useSubmissionStore } from '../store/useSubmissionStore'
import { Button } from '../components/ui/button'

const ProblemPage = () => {

    const {id}= useParams();
    const {getProblemById , problem, isProblemLoading}= useProblemStore()
    const {theme}=useTheme()

    const monacoTheme= theme==='dark' ? 'vs-dark' : 'vs'
    const{
      submission:submissions,
      isLoading:isSubmissionsLoading,
      getSubmissionForProblem,
      getSubmissionCountForProblem,
      submissionCount
    }=useSubmissionStore()

    const [code,setCode]=useState("");
    const [activeTab,setActiveTab] = useState("description");
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [testcases, setTestCases] = useState([]);

    const{executeCode,submission,isExecuting}=useExecutionStore()
   
      useEffect(() => {
        getProblemById(id);
        getSubmissionCountForProblem(id)
    
      }, [id]);

  useEffect(() => {
    
    if (problem) {
      setCode(
        problem.codeSnippets?.[selectedLanguage] || ""
      );
      setTestCases(
        problem.testcases?.map((tc) => ({
          input: tc.input,
          output: tc.output
        })) || [] 
      );
       
    } else {
    
      setCode("");
      setTestCases([]);
      console.log("Problem is null, clearing code and test cases.");
    }
  }, [problem, selectedLanguage]);

  console.log("pl",problem);

  useEffect(()=>{
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id)
    }
  },[activeTab,id])

  console.log("submission:",submissions);
  

  const handleLanguageChange = (e)=>{
    const lang = e.target.value;
    setSelectedLanguage(lang)
    setCode(problem.codeSnippets?.[lang] || "")
  }

  const handleRunCode =(e)=>{
    e.preventDefault()
    try{
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map((tc)=>tc.input);
      const expected_outputs = problem.testcases.map((tc)=> tc.output)
      executeCode(code,language_id,stdin,expected_outputs,id)
    }catch(error){
        console.log("Error executing code",error);
        
    }
  }

  
  


  if (isProblemLoading || !problem) {
    return(
      <div className="flex items-center justify-center h-screen bg-accent">
        <div className="card bg-accent p-8 shadow-xl">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Loading problem...</p>
        </div>
      </div>
    )
  }

   const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none">
            <p className="text-lg  mb-6">{problem.description}</p>

            {problem.examples && (
              <>
                <h3 className="text-xl font-bold mb-4">Examples:</h3>
                {Object.entries(problem.examples).map(
                  ([lang, example], idx) => (
                    <div
                      key={lang}
                      className="bg-accent p-6 rounded-xl mb-6 font-mono"
                    >
                      <div className="mb-4">
                        <div className="text-amber-500 mb-2  font-semibold">
                          Input:
                        </div>
                        <span className="bg-accent/20 px-4 py-1 rounded-lg font-semibold">
                          {example.input}
                        </span>
                      </div>
                      <div className="mb-4">
                        <div className="text-amber-500 mb-2  font-semibold">
                          Output:
                        </div>
                        <span className="bg-accent px-4 py-1 rounded-lg font-semibold">
                          {example.output}
                        </span>
                      </div>
                      {example.explanation && (
                        <div>
                          <div className="text-emerald-500 mb-2  font-semibold">
                            Explanation:
                          </div>
                          <p className=" text-lg font-sem">
                            {example.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                )}
              </>
            )}

            {problem.constraints && (
              <>
                <h3 className="text-xl font-bold mb-4">Constraints:</h3>
                <div className="bg-accent p-6 rounded-xl mb-6">
                  <span className="bg-accent px-4 py-1 rounded-lg font-semibold text-lg">
                    {problem.constraints}
                  </span>
                </div>
              </>
            )}
          </div>
        );
      case "submissions":
        return (
          <div className="p-4 text-center ">
            <SubmissionList submissions={submissions} isLoading={isSubmissionsLoading}/>
          </div>
        );
      case "discussion":
        return (
          <div className="p-4 text-center ">
            No discussions yet
          </div>
        );
      case "hints":
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-accent p-6 rounded-xl">
                <span className="bg-accent px-4 py-1 rounded-lg font-semibold text-lg">
                  {problem.hints}
                </span>
              </div>
            ) : (
              <div className="text-center ">
                No hints available
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-accent from-base-300 to-base-200 max-w-dvw w-full'>
      <nav className="navbar bg-accent shadow-lg px-4">
        <div className="flex-1 gap-2">
          <Link to={"/"} className="flex items-center gap-2 text-amber-600">
            <Home className="w-6 h-6" />
            <ChevronRight className="w-4 h-4" />
          </Link>
          <div className="mt-2">
            <h1 className="text-xl font-bold">{problem.title}</h1>
            <div className="flex items-center gap-2 text-sm  mt-5">
              <Clock className="w-4 h-4" />
              <span>
                Updated{" "}
                {new Date(problem.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-base-content/30">•</span>
              <Users className="w-4 h-4" />
              <span>{submissionCount} Submissions</span>
              <span className="text-base-content/30">•</span>
              <ThumbsUp className="w-4 h-4" />
              <span>95% Success Rate</span>
            </div>
          </div>
        </div>
        <div className="flex-none gap-4">
          <button
            className={`btn btn-ghost btn-circle ${
              isBookmarked ? "text" : ""
            }`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className="w-5 h-5" />
          </button>
          <button className="btn btn-ghost btn-circle">
            <Share2 className="w-5 h-5" />
          </button>
          <select
            className=" select-accent  w-40"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {Object.keys(problem.codeSnippets || {}).map((lang) => (
              <option className='bg-accent'  key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </nav>

      <div className='container mx-auto p-4'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <div className='card bg-accent/20 shadow-xl'>
                <div className='card-body p-0'>
                  <div className='tabs tabs-bordered'>
                    <button
                      className={`tab gap-2 hover:text-amber-700  ${
                      activeTab === "description" ? "tab-active" : ""
                      }`}
                      onClick={() => setActiveTab("description")}
                    >
                      <FileText className="w-4 h-4" />
                      Description
                    </button>
                    <button
                      className={`tab gap-2  hover:text-amber-700 ${
                      activeTab === "submissions" ? "tab-active" : ""
                      }`}
                      onClick={() => setActiveTab("submissions")}
                    >
                      <Code2 className="w-4 h-4" />
                      Submissions
                    </button>
                    <button
                      className={`tab gap-2 ${
                      activeTab === "discussion" ? "tab-active" : ""
                      }`}
                      onClick={() => setActiveTab("discussion")}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Discussion
                    </button>
                     <button
                      className={`tab gap-2 ${
                      activeTab === "hints" ? "tab-active" : ""
                      }`}
                      onClick={() => setActiveTab("hints")}
                    >
                      <Lightbulb className="w-4 h-4" />
                      Hints
                    </button>
                       
                 </div>
                    <div className="p-6">{renderTabContent()}</div>
                </div>
              </div>
            
                  <div className='card bg-accent shadow-xl'>
                      <div className='card-body p-0'>
                        <div className='tabs text-lg tabs-bordered p-5'>
                            <button>
                              <Terminal className="bg-accent w-4 h-4" />
                                Code Editor
                            </button>
                        </div>
                        <div className='h-[600px] w-full'>
                          <Editor
                         height="100%"
                         language={selectedLanguage.toLowerCase()}
                         theme={monacoTheme}
                         value={code}
                         onChange={(value) => setCode(value || "")}
                         options={{
                          minimap: { enabled: false },
                           fontSize: 20,
                           lineNumbers: "on",
                             roundedSelection: false,
                            scrollBeyondLastLine: false,
                            readOnly: false,
                            automaticLayout: true,
                        }}
                        />
                        </div>
                        <div className='p-4 border-t border-accent bg-accent'>
                          <div className='flex justify-between items-center'>
                             <Button
                              className={`bg-amber-600 gap-2 ${
                                isExecuting ? "loading" : ""
                              }
                                
                                `}
                              onClick={handleRunCode}
                              disabled={isExecuting}
                              >
                              {!isExecuting && <Play className="w-4 h-4" />}
                              Run Code
                              </Button>
                              <Button className=" bg-green-600 gap-2">
                              Submit Solution
                              </Button>
                          </div>
                        </div>

                      </div>
                  </div>

            </div>
         
            <div className="card bg-accent/20 shadow-xl mt-6">
                            <div className="card-body">
            {submission ? (
              <Submission submission={submission}/>
            ) :( 
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Test Cases</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="table  w-full">
                    <thead>
                      <tr>
                        <th>Input</th>
                        <th>Expected Output</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testcases.map((testCase, index) => (
                        <tr key={index}>
                          <td className="font-mono">{testCase.input}</td>
                          <td className="font-mono">{testCase.output}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
         </div>
      </div>


    </div>
  )
}

export default ProblemPage