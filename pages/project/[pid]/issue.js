import { useContext } from "react";
import Layout from "../../../Components/Layout";
import { API_URL, GET_AUTH_USER_DETAILS, GET_SERVER_TOKEN_HEADER } from "../../../config/constants";
import { AuthContext } from "../../../providers/AuthProvider";
import Link from 'next/link';
import Card from "../../../Components/Card";
import ProjectPageHeader from "../../../Components/ProjectPageHeader";






function issue(props) {
    const authStatus = useContext(AuthContext);
    if(props.noFound) {
        return (<div>No Found</div>)
    }

    if(props.apierror) {
        return (<div>Error</div>)
    }
    return (
        <Layout containerClass={'bg-bg-main'} {...props} currentUser={authStatus.currentUser}>
            <div className="mx-auto">
                <ProjectPageHeader project={props.project} />
            </div>
        </Layout>
    );
}

export async function getServerSideProps(ctx){
    console.log(ctx.params);
    const { pid } = ctx.params;

    let project = await fetch(API_URL+`/project/slug/${pid}`, {
        headers: await GET_SERVER_TOKEN_HEADER(ctx)
    });

    if(project.status == '404') {
        ctx.res.statusCode = 404;
        return {
            props: {
                apierror: false,
                noFound: true
            }
        }
    }

    project = await project.json()
    const user = await GET_AUTH_USER_DETAILS(ctx);
    

    return {
        props:{
            project,
            user,
            auth: user ? true : false,
            apierror: false
        }
    }
}

export default issue;