import { auth } from "./firebase";
import cookies from 'next-cookies';
import jscookie from 'js-cookie';
import { findIndex } from 'lodash'; 
export const COOKIE_TOKEN = 'lptoken';
export const API_URL = process.env.NEXT_PUBLIC_APIURL;
export const SERVER_API_KEY = process.env.SERVER_API_KEY ? process.env.SERVER_API_KEY  : 'notoken';


export const getToken = async () => {
    //const token = auth().currentUser ? await auth().currentUser.getIdToken() : 'notokeb';
    const co = await jscookie.get('lptoken');
    const token = co ? co : 'notokeb'
    return token;
}

export const API_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'authorization': `Bearer ${getToken()}`
}


export const GET_TOKEN_HEADER = async () => ({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'authorization': `Bearer ${await getToken()}`
})


export const GET_SERVER_TOKEN_HEADER = async (ctx) => {
    const { lptoken } = cookies(ctx);
    return({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authorization': `Bearer ${lptoken}`,
        'server-access-key': `${SERVER_API_KEY}` 
    })
}


export const GET_AUTH_USER_DETAILS = async (ctx) => {
    const { lptoken } = cookies(ctx);
    if(!lptoken)
        return false
    let user = await fetch(API_URL+`/auth/authUser/`, {
        headers: await GET_SERVER_TOKEN_HEADER(ctx)
    })
    user = await user.json();
    return {
        ...user
    }
}

export const findNextLessonURL = (currentLid, currentCid, courses) => {
    let sortedCourses = courses.sort((a,b) => a.order - b.order);

    selectedCourse = findIndex(courses, ['slug', currentCid]);
    selectedLesson = findIndex(selectedCourse.lessons, ['slug', currentLid]);

    if(!courses[selectedCourse+1]) {
        return false
    }

    if(courses[selectedCourse].lessons[selectedLesson+1]) {
        return `/${courses[selectedCourse].slug}/${courses[selectedCourse].lessons[selectedLesson+1]}`
    }

    else {
        return `/${courses[selectedCourse+1].slug}/${courses[selectedCourse].lessons[0]}`
    }

    
}