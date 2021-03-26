import { useContext, useEffect, useState } from "react";
import Layout from "../../../../Components/Layout";
import ProjectPageHeader from "../../../../Components/ProjectPageHeader";
import { getProjectDetailsUsingSlug } from "../../../../config/apiCalls";
import { API_URL, GET_AUTH_USER_DETAILS, GET_SERVER_TOKEN_HEADER, GET_TOKEN_HEADER } from "../../../../config/constants";
import { AuthContext } from "../../../../providers/AuthProvider";
import { includes } from 'lodash';
import Link from "next/link";
import { Router, useRouter } from 'next/router'
import Tick01 from "../../../../Components/Tick";
import LessonContainer from "../../../../Components/LessonContainer";
import { sortableContainer, sortableElement, sortableHandle } from "react-sortable-hoc";

const DragHandle = sortableHandle(() => <span>::</span>);

const SortableItem = sortableElement(({ children }) => {
    return <div className="">{children}</div>;
  });
  
  const SortableContainer = sortableContainer(({ children }) => {
    return <div className="">{children}</div>;
  });

const updateCourseSortOrder = async (projectId, oldIndex, newIndex) => {
    fetch(API_URL+`/course/editSort`, {
            method: 'POST',
            headers: await GET_TOKEN_HEADER(),
            body: JSON.stringify({
                projectId,
                oldIndex,
                newIndex
            })
        });
    return null;
}

const updateLessorSortOrder = async (courseId, oldIndex, newIndex) => {
    fetch(API_URL+`/lesson/editSort`, {
            method: 'POST',
            headers: await GET_TOKEN_HEADER(),
            body: JSON.stringify({
                courseId,
                oldIndex,
                newIndex
            })
        });
    return null;
}



const BulletPoint = ({ selected, done }) => {
    if(selected)
        return <div className={`-ml-6 w-2 h-2 bg-black rounded-full`}></div>
    if(done)
        return <div style={{ marginLeft: '-28px' }} className={`w-4 h-4 bg-white rounded-full`}><Tick01 /></div>
    return  <div className={`-ml-6 w-2 h-2 bg-gray-300 rounded-full`}></div>
}


const SideLessonBlock = ({ id, name, doneBy, slug, projectSlug, selectedLesson, currentUser, completedUsers, courseId }) => {
    const done = currentUser ? includes(completedUsers, currentUser.uid) : false;
    return (
        <div className="flex items-center mb-2">
            <BulletPoint selected={selectedLesson == slug} done={done}></BulletPoint>
            <Link href={`/project/${projectSlug}/activity/${courseId}/${slug}`} >
                <a className={`text-sm font-inter ${ done ? 'ml-3' : 'ml-4'} text-gray-800 hover:text-gray-600 cursor-pointer ${selectedLesson == slug ? 'font-medium text-black' : ''}`}>{name}</a>
            </Link>
        </div>
    )
   
}

const SideCourseBlock = ({name, lessons, projectSlug, slug, selectedLesson, currentUser, courseId}) => {
    const [sortedLessons, setSortedLessons] = useState(lessons);

    const LessonSortEnd = ({ oldIndex, newIndex }) => {
        setSortedLessons(prevState => {
            const newItems = [...prevState];
            if (oldIndex > newIndex) {
              for (let i = oldIndex - 1; i >= newIndex; i--) {
                newItems[i].order++;
                newItems[oldIndex].order = newIndex;
              }
            } else if (oldIndex < newIndex) {
              for (let i = oldIndex + 1; i <= newIndex; i++) {
                newItems[i].order--;
                newItems[oldIndex].order = newIndex;
              }
            }

            const apiCall = updateLessorSortOrder(courseId, oldIndex, newIndex);
            return newItems.sort((a, b) => a.order - b.order);


            //Do API

          });
    }


    return(
        <div className="mb-8 relative">
            <div className="absolute cursor-move -left-10"><DragHandle /></div>
            <div className="font-bold text-black text-sm uppercase mb-3">{ name }</div>
                <SortableContainer useDragHandle onSortEnd={LessonSortEnd}>
                    { sortedLessons.sort((a,b) => a.order - b.order).map((lesson, index) => (
                        <SortableItem key={index} index={index}>
                            <div className="absolute -left-10 cursor-move">
                                <DragHandle></DragHandle>
                            </div>
                            <SideLessonBlock currentUser={currentUser}  selectedLesson={selectedLesson} key={lesson._id} projectSlug={projectSlug} courseId={slug} {...lesson} /> 
                        </SortableItem>
                        ))
                    }
                </SortableContainer>
        </div>
)}

function Course(props) {
    // console.log(props);
    const routerListener = useRouter()
    const { courses, project, lid, cid } = props;
    const authStatus = useContext(AuthContext);
    const router = useRouter();

    const [courseList, setCourseList] = useState(courses);
    useEffect(() => {
        // action on update of movies
    }, [courseList]);
    const [completedCourse, setCompletedCourse] = useState(null);

    if(props.notFound) {
        return (<div>not found</div>)
    }

    // console.log(router);
    if(props.noFound) {
        return (<div>No Found</div>)
    }

    if(props.apierror) {
        return (<div>Error</div>)
    }

    const nextPageURL = () => {
        const currentLesson = props.lesson;
        const currentCourse = props.lesson.course;
        //Check if next lesson exist
        if((currentLesson.order+1) == currentCourse.lessons.length) {
            if(currentCourse.order >= props.project.courses.length) {
                return '/404'
            }
            return `/project/${props.project.slug}/activity/${props.project.courses[currentCourse.order+1]}/${props.project.courses[currentCourse.order+1].lessons[0].slug}`
        }
        return `/project/${props.project.slug}/activity/${props.project.courses[currentCourse.order]}/${props.project.courses[currentCourse.order].lessons[currentLesson.order+1].slug}`
    }

    const navigateToNextCourse = () => {
        routerListener.push(nextPageURL());
    }


    const onLessonUpdate = (lesson) => {
        console.log('onLessonUpdate');
        console.log(props);
        const currentLessonList = lesson.course.lessons;
        const currentCourse = lesson.course;
        let tempCoursesList = JSON.parse(JSON.stringify(courseList));
        console.log(tempCoursesList, currentCourse.order, lesson.order, props.user.uid)
        if(props.user.uid) {
            tempCoursesList[currentCourse.order].lessons[lesson.order].completedUsers.push(props.user.uid);
            setCourseList(prevC => ([...prevC, ...tempCoursesList]))
        }

        routerListener.push(nextPageURL());
    }


    const onCourseComplete = async () => {
        console.log('onCourseComplete')
        fetch(API_URL+`/course/done/${props.lesson.course._id}`, {
            method: 'POST',
            headers: await GET_TOKEN_HEADER()
        }).then(res => res.json())
        .then(res => {
            if(res.error) {
                return null;
            }

            if(res.type == 'ADDED_ALREADY') {
                navigateToNextCourse()
            }

            else {
                setCompletedCourse(props.lesson.course);
            }
        })
    }






    const onCourseSortEnd = ({ oldIndex, newIndex }) => {
        setCourseList(prevState => {
            const newItems = [...prevState];
            if (oldIndex > newIndex) {
              for (let i = oldIndex - 1; i >= newIndex; i--) {
                newItems[i].order++;
                newItems[oldIndex].order = newIndex;
              }
            } else if (oldIndex < newIndex) {
              for (let i = oldIndex + 1; i <= newIndex; i++) {
                newItems[i].order--;
                newItems[oldIndex].order = newIndex;
              }
            }

            updateCourseSortOrder(project._id, oldIndex, newIndex);
            return newItems.sort((a, b) => a.order - b.order);

          });
    }

    useEffect(() => {
        // Always do navigations after the first render
        //router.push('/?counter=10', undefined, { shallow: true })

        if(!props.slugExist) {
            router.push(`/project/${project.slug}/activity/${cid}/${lid}`,  undefined, { shallow: true })
        }
      }, [])



    console.log('lol', props)


    return (
        <Layout containerClass={'bg-bg-main'} {...props} currentUser={authStatus.currentUser}>
            <div className="mx-auto">
                <ProjectPageHeader 
                    project={props.project} 
                    selectedPage={'GETSTARTED'} 
                />
            </div>
            <div className="flex pb-24  max-w-6xl mx-auto">
                <div className="w-1/3">
                          
                    <div className="h-full border-l border-gray-300 ml-4 pl-5 pt-12">
                        <SortableContainer shouldCancelStart={() => false} onSortEnd={onCourseSortEnd} useDragHandle>
                        {
                            courseList.map((course, index) => 
                                        <SortableItem  key={index} index={index} >
                                            <SideCourseBlock 
                                                    currentUser={authStatus.currentUser} 
                                                    selectedLesson={lid} 
                                                    key={course._id} 
                                                    projectSlug={project.slug} 
                                                    {...course}
                                                    courseId={course._id}
                                                 />
                                        </SortableItem>
                                    )
                        }
                        </SortableContainer>
                    </div>
                </div>
                <div className="flex-1 pt-12">
                    <LessonContainer 
                        lesson={props.lesson}
                 
                        project={project} 
                        courseId={cid} 
                        onLessonUpdate={onLessonUpdate} 
                        onCourseComplete={onCourseComplete} 
                    />
                </div>
            </div>
        </Layout>
    );
}


export async function getServerSideProps(ctx) {
    const { pid, slug } = ctx.params;
    if(slug && slug.lenght < 2 && slug.lenght > 0) {
        ctx.res.statusCode = 404;
        return {
            props: {
                apierror: false,
                noFound: true
            }
        } 
    }
    const project = await getProjectDetailsUsingSlug(pid, ctx);
    if(!project) {
        ctx.res.statusCode = 404;
        return {
            props: {
                apierror: false,
                noFound: true
            }
        } 
    }
    const user = await GET_AUTH_USER_DETAILS(ctx);
    if(project.courses.lenght == 0) {
        return {
            props: {
                project,
                noCourse: true
            }
        }
    }

    let lesson = null;
    console.log('234,', project.courses[0])
    let cid = project.courses[0].slug;
    let lid = project.courses[0].lessons[0].slug;
    
    if(slug && slug.length > 0) {
        cid = slug[0]
        lid = slug[1];
    }

    const lessonAPI = await fetch(API_URL+`/lesson/slug/${lid}`, {
        headers: await GET_SERVER_TOKEN_HEADER(ctx)
    });
    if(lessonAPI.status == '200') {
        lesson = await lessonAPI.json();
    }
    const courses = project.courses.sort((a,b) => a.order - b.order);
    return {
        props:{
            data: null,
            project,
            lesson,
         //   firstCourse,
            courses,
            lid,
            cid,
            user,
            slugExist: slug ? true : false
        }
    }



    


}



export async function getServerSideProps1(ctx){
    const { pid, slug } = ctx.params;
    const project = await getProjectDetailsUsingSlug(pid, ctx);
    const user = await GET_AUTH_USER_DETAILS(ctx);
    if(!project) {
        ctx.res.statusCode = 404;
        return {
            props: {
                apierror: false,
                noFound: true
            }
        } 
    }
    const firstCourse = project.courses[0];
    if(!firstCourse) {
        return {
            props:{
                data: null,
                project,
                lesson : {
                    steps: []
                },
                firstCourse : {},
                courses : [],
                lid:null,
                cid:null,
                user,
                slugExist: slug ? true : false
            }
        }
    }
    let cid = firstCourse.slug ;
    let lid = firstCourse.lessons[0].slug;
    let lesson = null;
    if(slug) {
        cid = slug[0]
        lid = slug[1] 
    }

    //console.log('lid', lid)


    const lessonAPI = await fetch(API_URL+`/lesson/slug/${lid}`, {
        headers: await GET_SERVER_TOKEN_HEADER(ctx)
    });

  
    if(lessonAPI.status == '200') {
        lesson = await lessonAPI.json();
    }

    const courses = project.courses.sort((a,b) => a.order - b.order);    
    //const firstLesson = firstCourse.lessons[0];
  

    return {
        props:{
            data: null,
            project,
            lesson,
            firstCourse,
            courses,
            lid,
            cid,
            user,
            slugExist: slug ? true : false
        }
    }
}

export default Course;