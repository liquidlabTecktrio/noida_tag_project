import { faBreadSlice, faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { rgbToHex } from '@material-ui/core'
import React,{ useEffect, useState ,forwardRef, useRef, useImperativeHandle } from 'react'
// import ReactDOM from 'react-dom'
import SignaturePad from 'react-signature-canvas'
import  styles from "../../../../css/signaturePad.css"


 const SignatureCanvas = (props) => {
  const [trimmedData, setTrimmedDAta] = useState('');
    // var state = { trimmedDataURL: null }
  
    var sigPad =useRef({})

    // constructor(props){
    //     super(props);
        
    //     this.myRef = props.ref;
    //     window.sigComponent = this;
    // }
    console.log(props.ref);
  
    const clear = () => {
      sigPad.clear()
      console.log(sigPad.isEmpty())
      
    }
    
    const trim = () => {
        // console.log("this",this);
        // console.log(this.props)
        // console.log('this.sigPad.getTrimmedCanvas().toDataURL(): ', sigPad.getTrimmedCanvas().toDataURL('image/png').slice(0,250));
        // this.setState({
        //     trimmedDataURL: sigPad.getTrimmedCanvas().toDataURL('image/png')
        // })
        setTrimmedDAta(sigPad.getTrimmedCanvas().toDataURL('image/png'))
        console.log(trimmedData)
        console.log(sigPad.isEmpty())
    }
  
    
      // const { trimmedDataURL } = this.state
      return <div   className={styles.container}>
        <div className={styles.sigContainer}>
          <SignaturePad  canvasProps={{height:100,width:450, className: styles.sigPad }}
            ref={(ref) => { sigPad = ref }} />
           
        </div>
        <div>
          <button className={styles.buttons} onClick={clear}>
            Clear
          </button>
          <button  className={styles.buttons} onClick={trim}>
            Trim
          </button>
        </div>
        {/* {trimmedDataURL
          ? <img className={styles.sigImage} alt='signature'
            src={trimmedDataURL} />
          : null} */}
      </div>
    }


  export default SignatureCanvas;