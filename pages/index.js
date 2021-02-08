import { useContext } from 'react';
import Card from '../Components/Card';
import FeedsList from '../Components/FeedsList';
import Layout from "../Components/Layout";
import ProfileAvatarHalf from '../Components/ProfileAvatarHalf';
import YourSessions from '../Components/YourSessions';
import { API_HEADERS, API_URL, GET_SERVER_TOKEN_HEADER } from "../config/constants";
import { AuthContext } from "../providers/AuthProvider";

function dashboard(props) {
    const authStatus = useContext(AuthContext);
    if(!props.auth)
        return (<div>
            
            not auth 
            <button onClick={() => authStatus.login()}>Login</button>
        </div>)

    if(props.error)
        return (<div>api error</div>)
 
    return (
        <Layout {...props} signOut={authStatus.signOut} currentUser={authStatus.currentUser} containerClass="bg-bg-main" >
            <div className="max-w-4xl mx-auto mt-6">

                <div className="flex md:gap-10 mt-10">
                    <div className="w-2/5">
                            <Card>
                                <>
                                    <ProfileAvatarHalf invite={props.invite} loading={props.loading} user={props.user} badges={props.badges} currentUser={authStatus.currentUser} className=" px-6 py-6 border-b-2 border-gray-200" fullName="Sethu Sathyan" points='20' />
                                </>
                            </Card>
                        </div>
                   

                    <div className="flex-1 ml-8">
                        <div>
                            <h2 className="font-bold text-black text-xl font-bold mb-3">Your Projects</h2>
                            <p className="font-regular text-gray-700">Let's do some open source!</p>
                            <YourSessions />
                        </div>
                        <div className="mt-12">
                            <h2 className="font-bold text-black text-xl font-bold mb-3 ">Community</h2>
                            <p className="font-regular text-gray-700 mb-4">Some buzz happening inside leapcode</p>
                            <FeedsList />
                        </div>
                    </div>
                </div>

                
            </div>
        </Layout>
       
    );
}

export async function getServerSideProps(ctx){



    let userData = await fetch(API_URL+`/auth/user`, {
        headers: await GET_SERVER_TOKEN_HEADER(ctx)
    });

    if(userData.status == '401') {
        return {
            props: {
                auth: false,
                apierror: false,
            }
        }
    }

    userData = await userData.json();
    console.log(userData);

    if(!userData.userDetails)
        return {
            props: {
                auth: true,
                apierror: true,
            }
        }

    return {
        props: {
            user: userData.userDetails,
            badges: userData.Badges,
            invite: userData.invite,
            auth: true,
            apierror: false,
        }
    } 

}

export default dashboard;