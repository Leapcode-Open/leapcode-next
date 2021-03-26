import { useState } from "react";
import { API_URL, GET_TOKEN_HEADER } from "../../config/constants";
import Card from "../Card";
import Step from "../Step";

const LessonContainer = (props) => {

    const [nextStep, setNextStep] = useState((props.lesson.order+1) < props.lesson.course.lessons.length)
    const { lesson } = props;

    const onStepDone = () => {};



    const onNextLesson = async (nextStepExist) => {
     
        fetch(API_URL+`/lesson/done/${lesson._id}`, {
            method:'POST',
            headers: await GET_TOKEN_HEADER()
        }).then(res => res.json())
        .then(res => {
            if(res.error) {

            }
            
            else if(!nextStepExist) {
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
    console.log('exi', ifNextLesson)
    return (
        <Card  className="p-6 font-inter lessonDiv">
                <h1 className="text-lg font-bold mb-4">{lesson.name}</h1>
                <div 
                    dangerouslySetInnerHTML={{ __html: lesson.description }} 
                    className='text-sm text-gray-800'>
                </div>

                <div className="text-sm text-gray-700 mb-2"></div>
                <div className='mt-4'>
                    {/* { steps goes here} */}
                    { 
                        lesson.steps.sort((a,b)=> a.order - b.order)
                            .map(step => 
                                <Step 
                                    project={props.project} 
                                    onDone={onStepDone} 
                                    step={step} 
                                    session={[]} />)
                    } 
                </div>

                <div>
                        { ifNextLesson ?   
                        <div onClick={() => onNextLesson(nextStep) } className="py-2 px-6 rounded text-xs bg-blue-500 text-white font-semibold cursor-pointer hover:bg-blue-600">Next</div> : 
                        <button onClick={() => onNextLesson()} className="py-2 px-6 rounded text-xs bg-blue-500 text-white font-semibold  cursor-pointer hover:bg-blue-600">Next</button>
                        }
                </div>

        </Card>
    )
}

export default LessonContainer;

