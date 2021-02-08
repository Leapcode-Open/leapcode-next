import '../styles/globals.css'
import { AuthProvider, AuthContext } from '../providers/AuthProvider';
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className="App w-full min-h-screen font-jak flex flex-col justify-between">
        <Component {...pageProps} />
      </div>
    </AuthProvider>)
}

export default MyApp
