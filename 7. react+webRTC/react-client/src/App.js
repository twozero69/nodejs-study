import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:8080");
// const socket = io(process.env.REACT_APP_ETH_SERVER_URL);

const App = () => {
  /* hooks */
  //state setting
  const [me, setMe] = useState('');
  const [myName, setMyName] = useState('');
  const [stream, setStream] = useState(null);
  const [userdata, setUserdata] = useState({});
  const [receiveFlag, setReceiveFlag] = useState(false);
  const [acceptFlag, setAcceptFlag] = useState(false);
  const [endFlag, setEndFlag] = useState(false);
  const [socketIDtoCall, setSocketIDtoCall] = useState("");
  
  //reference setting
  const myVideo = useRef();
  const userVideo = useRef();
  const connection = useRef();

  //effect setting
  useEffect(() => {
    //get media from stream
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then((stream) => {
      setStream(stream);
      myVideo.current.srcObject = stream;
    }).catch((error) => {
      console.log(error);
    });

    //client socket setting
    socket.on('me', (id) => {
      setMe(id);
    });

    socket.on('callUser', (data) => {
      setUserdata(data);  //data{from:caller, name:callername, signal:callersignal}
      setReceiveFlag(true);
    })

  }, []);

  //initiate video chat to user
  const callUser = (id) => {

    const peer = new Peer({ //options(https://github.com/feross/simple-peer 에서 설명을 볼 수 있다.)
      initiator: true,  //true로 두면 initiating peer(먼저 요청하는 peer)임을 의미
      trickle: false, //false로 두면 trickle ICE를 비활성화 -> 'signal'이벤트가 1번만 발생
      stream: stream  //video/audio가 필요한 경우 mediaDevices.getUserMedia()에서 반환한 stream을 넣어준다
    });

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userID: id, //전화를 걸려고 하는 user의 ID
        signal: data, //signal data
        from: me, //전화를 initiate하는 socket의 ID
        name: myName //전화를 initiate하는 사람의 name
      })
    });

    peer.on('stream', (stream) => {
      userVideo.current.srcObject = stream;
    });

    socket.on('callAccept', (signal) => {
      setAcceptFlag(true);
      peer.signal(signal);
    });

    connection.current = peer;
  };

  const answerCall = () => {

    setAcceptFlag(true);

    const peer = new Peer({
      initiator: false, //initiating peer에게서 요청을 받는 peer이기 때문에 false로 설정
      trickleL: false,
      stream: stream
    });

    peer.on('signal', (data) => {
      socket.emit('answerCall', {
        signal: data, //signal data
        to: userdata.from,  //전화를 건 상대의 socket ID
      });
    });

    peer.on('stream', (callerstream) => {
      userVideo.current.srcObject = callerstream;
    });

    peer.signal(userdata.signal);
    connection.current = peer;
  }

  const leaveCall = () => {
    setEndFlag(true);
    connection.current.destroy();
  }

  const onMyNameChange = (event) => {
    const {target : {value}} = event;
    setMyName(value);
  }

  const onSocketIDtoCallChange = (event) => {
    const {target : {value}} = event;
    setSocketIDtoCall(value);
  }

  return (
    <div className="App">
      <h1>webRTC video chat example</h1>

      <h3>my ID : {me}</h3>
      <div>
        <span>my name : </span>
        <input type="text" value={myName} onChange={onMyNameChange}/>
      </div>
      <div>
        <span>ID To Call</span>
        <input type="text" value={socketIDtoCall} onChange={onSocketIDtoCallChange}/>
      </div>

      <div className="buttons">
        <div className="call button">
          {acceptFlag && !endFlag ? (
            <button onClick={leaveCall}>End Call</button>
          ) : (
            <button onClick={() => {callUser(socketIDtoCall)}}>Start Call</button>
          )}
        </div>

        <div className="receive button">
          {(receiveFlag && !acceptFlag) && <>
            <h1>{userdata.name} is calling ...</h1>
            <button onClick={answerCall}>Answer</button>
          </>}
        </div>
      </div>

      <div className="video container">
        <div className="myVideo">
          {stream && <video ref={myVideo} playsInline autoPlay muted style={{width: '300px'}}/>}
        </div>
        <div className="userVideo">
          {(acceptFlag && !endFlag) && <video ref={userVideo} playsInline autoPlay style={{width: '300px'}}/>}
        </div>
      </div>
    </div>
  );
}

export default App;
