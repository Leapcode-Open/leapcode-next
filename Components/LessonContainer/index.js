import { useEffect, useState } from "react";
import { API_URL, GET_TOKEN_HEADER } from "../../config/constants";
import Card from "../Card";
import Step from "../Step";

const LessonContainer = (props) => {

    const [nextStep, setNextStep] = useState((props.lesson.order+1) < props.lesson.course.lessons.length)
    const [stepsComplete, setStepComplete] = useState(false);

    useEffect(() => {
        if(checkIfAllStepsDone())
            setStepComplete(true)
        else 
            setStepComplete(false)
    })
    
    const { lesson } = props;

    const onStepDone = () => {};



    const onNextLesson = async (nextStepExist) => {
     
        fetch(API_URL+`/lesson/done/${lesson._id}`, {
            method:'POST',
            headers: await GET_TOKEN_HEADER()
        }).then(res => res.json())
        .then(res => {
            if(res.error) {
                console.log(res.error);
            }
            
            if(!nextStepExist) {
                props.onCourseComplete();
            }

            else {
                props.onLessonUpdate(lesson);
                //this.setState({ redirect: this.state.nextStep  })
            }

            //props.onLessonUpdate(lesson);

        });

    }

    const nextStepSlug = (lesson, course) => {
        let slug = null;       
        if(lesson.order >= 0) {
            if(lesson.order == (course.lessons.length-1)) 
                slug = null;
            else    
                slug = course.lessons[lesson.order+1].slug;
        }   
        return slug

    }

    const checkIfAllStepsDone = () => {
        const steps = lesson.steps;
        const { project } = props;
        let count = 0 + steps.filter(step => (step.type == 'FORK') || (step.type == 'CLONE') || (step.type == 'NO') || step.type == 'PR').length;
      
        if(steps.filter(step => step.type == 'FPR-ISSUE').length > 0) {
            if(project.firstSession)
                count = count+1;
        }
        //('steps2', steps.length, count, steps);
        if(steps.filter(step => step.type == 'PR').length > 0) {
            if(project.firstSession) {
                if(project.firstSession.pullRepullRequest) {
                    if(project.firstSession.pullRepullRequest.state == 'merged')
                        count = count+1;
                }
            }
        }

        if(steps.filter(step => step.type == 'ISSUE_SELECT').length > 0) {
            if(project.firstSession) {
                if(project.firstSession.issueExist) {
                        count = count+1;
                }
            }
        }

        if(steps.filter(step => step.type == 'ISSUE').length > 0) {
            if(project.firstSession) {
                if(project.firstSession.issueExist) {
                        count = count+1;
                }
            }
        }
        //console.log('steps3', steps.length, count);
       

        if(steps.length == count)
            return true
        
        else
            return false
    }




    
    //console.log('loses', props, nextStep, props.lesson.order+1, props.lesson.course.lessons.length, (props.lesson.order+1) < props.lesson.course.lessons.length)

    const ifNextLesson = (props.lesson.order+1) < props.lesson.course.lessons.length;
    console.log('exi', ifNextLesson, props.lastLesson)
    return (
        <Card  className="font-inter lessonDiv">
                <div className="px-6 pt-3 pb-3 border-b border-gray-100">
                    <h1 className="text-lg font-bold">{lesson.name}</h1>
                </div>
                <div className="">
                    <div 
                        dangerouslySetInnerHTML={{ __html: lesson.description }} 
                        className='text-sm text-gray-800 px-6 py-4 border-b border-gray-100 leading-relaxed'>
                    </div>
                </div>
               

                <div className="text-sm text-gray-700 mb-2"></div>
       
               
                        { 
                            lesson.steps.sort((a,b)=> a.order - b.order)
                                .map(step => (
                                    <div className="px-6 py-4">
                                        <Step 
                                            user={props.user}
                                            project={props.project} 
                                            onDone={onStepDone} 
                                            step={step} 
                                            session={[]} />
                                        </div>
                                )
                                    
                             )
                        } 
    
           
               
                { !props.lastLesson ? 
                <div className="px-6 py-4">
                        { ifNextLesson ?   
                        <button disabled={!stepsComplete} onClick={() => onNextLesson(nextStep) } className="disabled:opacity-50 py-2 px-6 rounded text-xs bg-blue-500 text-white font-semibold cursor-pointer hover:bg-blue-600">Next</button> : 
                        <button disabled={!stepsComplete} onClick={() => onNextLesson()} className="disabled:opacity-50 py-2 px-6 rounded text-xs bg-blue-500 text-white font-semibold cursor-pointer hover:bg-blue-600">Next</button>
                        }
                </div> : 
                <div className="px-6 py-4">
                    <button disabled={!stepsComplete} onClick={() => onNextLesson()} className="disabled:opacity-50 py-2 px-6 rounded text-xs bg-blue-500 text-white font-semibold cursor-pointer hover:bg-blue-600">Finish</button>
                </div>

                }

        </Card>
    )
}

export default LessonContainer;

