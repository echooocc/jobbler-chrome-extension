import { useEffect, useState } from 'react'
import { Client } from '@notionhq/client'
import './Popup.css'

function App() {
  const [showSaveButton, setShowSaveButton] = useState(true)
  const [hasRecord, setHasRecord] = useState(false)
  const [recordDate, setRecordDate] = useState('')
  const [savedStatus, setSavedStatus] = useState('')
  const [noJobDetected, setNoJobDetected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [jobInfo, setJobInfo] = useState({
    title: '',
    company: '',
    url: '',
  })

  const notion = new Client({ auth: import.meta.env.VITE_NOTION_KEY || '' })

  const extractJobInfoByDomClassNames = (titleClassName: string, companyClassName: string) => {
    const jobTitleElement = document.querySelector(titleClassName)
    const companyElement = document.querySelector(companyClassName)

    return {
      title: jobTitleElement?.textContent?.trim() || '',
      company: companyElement?.textContent?.trim() || '',
    }
  }
  const extractTitleInfoByDomClassName = (titleClassName: string) => {
    const jobTitleElement = document.querySelector(titleClassName)
    console.log(jobTitleElement)
    return {
      title: jobTitleElement?.textContent?.trim() || '',
    }
  }

  const extractJobInfForGlassdoor = (titleClassName: string, companyClassName: string) => {
    const jobTitleElement = document.querySelector(titleClassName)
    const companyElement = document.querySelector(companyClassName)

    return {
      title: jobTitleElement?.textContent?.trim() || '',
      // remove numerical review from the company name
      company: companyElement?.firstChild?.textContent?.trim() || '',
    }
  }

  const parseDomContentCallBack = (result: any, url: string) => {
    if (chrome.runtime.lastError) {
      console.error('Error executing script:', chrome.runtime.lastError)
      return
    }
    const { title, company } = result[0].result as { title: string; company: string }
    setIsLoading(false)

    if (title) {
      setJobInfo({ title, company, url })
      if (title.length === 0) {
        setNoJobDetected(true)
      }
    } else {
      setIsError(true)
    }
  }

  // wellfound return Senior Web Developer at Circle under data-test="JobDetail"
  const parseAndFormatTitleContentCallBackForWellfound = (result: any, url: string) => {
    if (chrome.runtime.lastError) {
      console.error('Error executing script:', chrome.runtime.lastError)
      return
    }
    let { title } = result[0].result as { title: string }
    const company = title.split('at')[1]
    title = title.split('at')[0]
    setIsLoading(false)

    if (title) {
      setJobInfo({ title, company, url })
      if (title.length === 0) {
        setNoJobDetected(true)
      }
    } else {
      setIsError(true)
    }
  }

  const getJobInfo = async () => {
    setIsLoading(true)
    setIsError(false)
    setNoJobDetected(false)
    setShowSaveButton(true)
    setSavedStatus('')

    let queryOptions = { active: true, lastFocusedWindow: true }
    let [tab]: any = await chrome.tabs.query(queryOptions)
    if (!tab) {
      setIsLoading(false)
      setNoJobDetected(true)
      return
    }
    const { url, title = '' } = tab

    if (url && url.startsWith('https://weworkremotely.com/')) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: extractJobInfoByDomClassNames,
          args: ['.listing-header-container h1', '.listing-header-container h2'],
        },
        (result) => parseDomContentCallBack(result, url),
      )
      return
    }

    if (url && url.startsWith('https://www.linkedin.com/jobs/view/')) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: extractJobInfoByDomClassNames,
          args: ['.jobs-unified-top-card__job-title', '.jobs-unified-top-card__company-name a'],
        },
        (result) => parseDomContentCallBack(result, url),
      )
      return
    }

    if (url && url.startsWith('https://www.glassdoor.ca/Job/')) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: extractJobInfForGlassdoor,
          args: ['div[data-test="jobTitle"]', 'div[data-test="employerName"]'],
        },
        (result) => parseDomContentCallBack(result, url),
      )
      return
    }

    if (url && url.startsWith('https://wellfound.com/company/')) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: extractTitleInfoByDomClassName,
          args: ['div[data-test="JobDetail"] h1'],
        },
        (result) => parseAndFormatTitleContentCallBackForWellfound(result, url),
      )
      return
    }

    setIsLoading(false)
    setNoJobDetected(true)
  }

  useEffect(() => {
    getJobInfo()
  }, [])

  const handleSave = async () => {
    setSavedStatus('inprogress')
    try {
      console.log('starting handle save')
      const existing = await notion.databases.query({
        database_id: import.meta.env.VITE_NOTION_DATABASE_ID,
        filter: {
          and: [
            {
              property: 'company',
              rich_text: {
                contains: jobInfo.company,
              },
            },
            {
              property: 'title',
              rich_text: {
                contains: jobInfo.title,
              },
            },
          ],
        },
        sorts: [
          {
            property: 'created time',
            direction: 'ascending',
          },
        ],
      })
      console.log('has records', existing.results)
      // if record exits
      if (existing.results.length > 0) {
        setShowSaveButton(false)
        setHasRecord(true)

        const record = existing.results[0]

        const dt = new Date(record['created_time'])
        const date = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate()
        setRecordDate(date)
        setSavedStatus('')
        return
      }

      const response = await notion.pages.create({
        parent: { database_id: import.meta.env.VITE_NOTION_DATABASE_ID || '' },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: jobInfo.title,
                },
              },
            ],
          },
          company: {
            rich_text: [
              {
                text: {
                  content: jobInfo.company,
                },
              },
            ],
          },
          url: {
            url: jobInfo.url,
          },
        },
      })
      console.log('save success', response)
      setSavedStatus('success')
    } catch (error) {
      console.error(error)
      setSavedStatus('fail')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 w-96 grid place-content-center text-base text-stone-500">
      {isError && <div>Something went wrong ...</div>}
      {isLoading && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="motion-safe:animate-bounce w-6 h-6 text-stone-500"
        >
          <path
            strokeWidth="round"
            strokeLinejoin="round"
            d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
          />
        </svg>
      )}
      {!isLoading && noJobDetected && <div>no job detected</div>}
      {!isLoading && !noJobDetected && !isError && (
        <div className="flex flex-col items-center">
          <div className="text-lg pb-8">
            <span>{jobInfo.title}</span>
            <span> @ </span>
            <span className=" underline decoration-wavy">{jobInfo.company}</span>
          </div>
          {showSaveButton && (
            <button
              className="w-8/12 px-8 py-2 rounded max-w-sm bg-gray-100 hover:bg-gray-200"
              onClick={handleSave}
            >
              <span className="text-base text-stone-600">
                {savedStatus === 'inprogress'
                  ? 'Processing...'
                  : savedStatus === 'success'
                  ? 'Saved!'
                  : savedStatus === 'fail'
                  ? 'Try Again~'
                  : 'Save'}
              </span>
            </button>
          )}
          {hasRecord && <div className="w-full"> You've applied job at {recordDate}</div>}
        </div>
      )}
    </div>
  )
}

export default App
