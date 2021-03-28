import Model from "../Model"
import PrimaryButton from "../PrimaryButton"
import Confetti from 'react-confetti'

const CongratsProject = (props) => (
    <Model {...props}>
        <Confetti active={props.isOpen} />

        <div className="flex flex-col items-center text-center py-12 px-12" style={{ backgroundSize:'cover' }}>
            <h2 className="text-3xl font-bold px-6 mb-5">Congrats!</h2>
            <h2 className="text-3xl font-bold px-6 mb-5">You did it</h2>
            {/* <p className="font-bold text-lg mt-6 mb-8 text-green-900">🎉 {props.course.points} Points</p> */}
            <PrimaryButton onClick={props.onComplete} className="py-4 text-sm" title="Explore Issues" />
        </div>
    </Model>
)
export default CongratsProject
