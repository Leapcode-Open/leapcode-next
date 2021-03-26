import React from 'react';
import { GoInfo, GoIssueClosed, GoIssueOpened, GoIssueReopened, GoTrashcan, GoGitPullRequest, GoLinkExternal } from "react-icons/go";

const IssueBlock = ({ issue }) => {
    return (
        <div className="flex-1 pr-4">
            <div className="font-bold">{issue.title}</div>
            <div className="text-sm mt-3">
                <div className="flex">
                    <img className="w-5 rounded-full h-5" src={issue.user.avatar_url}></img>
                    <span className="ml-3">{issue.user.login}</span>
                    
                </div>
                <div className="flex-col flex mt-1">
                        {/* <IssueStatus issue={issue} /> */}
                </div>
                <a className="flex mt-4 hover:underline items-center text-xs font-bold text-blue-700" target="_blank" rel="noopener noreferrer" href={issue.html_url} ><GoLinkExternal className="mr-2" /><span>View on Github</span></a>
            </div>
        </div>
    )
}

export default IssueBlock;