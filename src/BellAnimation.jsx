import './BellAnimation.css'
import serviceBell from './assets/service-bell.png'

export default function BellAnimation({ ringing = false }) {
  return <div className={`tb-bell-animation${ringing ? ' ringing' : ''}`} aria-hidden="true">
    <div className="bell-parts-container">
      <span className="circle circle1" />
      <span className="circle circle2" />
      <span className="circle circle3" />
    </div>
    <div className="bell"><span className="bell-part"><img src={serviceBell} alt="" /></span></div>
  </div>
}
