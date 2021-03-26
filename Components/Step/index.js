import { Fragment, useState } from "react";
import ForkStep from "../ForkStep";
import PRBlock from "../PRBlock";
import SkeletonLoading from "../SkeletonLoading";
import FirstIssueBlock from '../FirstIssueBlock';
import CloneStep from "../CloneStep";
const Heading = ({name, description }) => (
    <Fragment>
        <h3 className="font-medium mb-3">{name}</h3>
        <div dangerouslySetInnerHTML={{ __html: description }} className="text-sm text-gray-700 mb-2"></div>
    </Fragment>
)

const Step = (props) => {
    const [loading, setLoading] = useState(false);
    const [pr, setPR] = useState(null);
    const [issue, setIssue] = useState(null);
    const [stepLoading, setStepLoading] = useState(true);
    const [info, setInfo] = useState(null);
    const [error, setError] = useState(null);


    const onPRSubmit = (e) => {
        //e.preventDefault();
        console.log('PRSubmit')

    }

    const onPRChange = (e) => {
        console.log('PRChnage')
    }

    const removeStepInfo = (e) => {
        console.log('qwew')
    }


    const onIssueAdded = () => {

    }

    const { step, project } = props;
    //onst info = this.state.info ? this.state.info : step.info

    console.log('steppp', step);
    if(loading)
        return (<SkeletonLoading />)

    if(step.type == 'PR')
        return (
            <>
                <Heading {...step} />
        
                <div className="my-5">
                    <PRBlock
                        firstTime 
                        project={project}  
                        session={project.firstSession} 
                        onDelete={removeStepInfo} 
                        error={error} 
                        info={info} 
                        loading={loading} 
                        onPRChange={onPRChange} 
                        onPRSubmit={onPRSubmit} 
                        step={step} />
                </div>
             
            </>
        )

    if(step.type == 'FORK')
        return (
            <>
                <Heading {...step} />
                <div className="my-5">
                    <ForkStep 
                        project={project} 
                        loading={loading} 
                        step={step}
                    />
                </div>
            </>
        )

    if(step.type == 'CLONE')
            return (
                <>
                    <Heading {...step} />
                    <div className="">
                        <CloneStep
                            project={project} 
                            loading={loading} 
                            step={step}  />
                    </div>
                </>
            )

    if(step.type == 'ISSUE_SELECT' || step.type == 'ISSUE' || step.type == 'FPR-ISSUE')
        return (
            <>
                <Heading {...step} />
                <div className='my-5'>
                    <FirstIssueBlock 
                        project={project} 
                        loading={loading} 
                        step={step} 
                        onIssueAdded={onIssueAdded} />
                </div>
            </>
        )

    return (<div>hello</div>)
 
}


export default Step;
