import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Peer } from "simple-peer";

const socket = io(process.env.REACT_APP_ETH_SERVER_URL);

const App = () => {
  /* hooks */
  //state setting
  const [me, setMe] = useState('');
  const [stream, setStream] = useState(null);
  const [userdata, setUserdata] = useState({});
  const [receiveFlag, setReceiveFlag] = useState(false);
  const [acceptFlag, setAcceptFlag] = useState(false);
  const [endFlag, setEndFlag] = useState(false);
  
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
    socket.on('connect', (arg) => {
      console.log(arg);
      console.log(socket.id);
    })

    socket.on('me', (id) => {
      setMe(id);
    });

    socket.on('callUser', (data) => {
      setUserdata(data);
      setReceiveFlag(true);
    })

  }, []);

  const callUser = (id) => {

    const peer = new Peer({ //options(https://github.com/feross/simple-peer 에서 설명을 볼 수 있다.)
      initiator: true,  //true로 두면 initiating peer(먼저 요청하는 peer)임을 의미
      trickle: false, //false로 두면 trickle ICE를 비활성화 -> 'signal'이벤트가 1번만 발생
      stream: stream  //video/audio가 필요한 경우 mediaDevices.getUserMedia()에서 반환한 stream을 넣어준다
    });

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userID: id,
        signalData: data,
        from: me,
        name: userdata.name
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
        signal: data,
        to: userdata.caller,
      });
    });

    peer.on('stream', (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(userdata.callerSignal);
    connection.current = peer;
  }

  const leaveCall = () => {
    setEndFlag(true);
    connection.current.destroy();
  }


  return (
    <div className="App">
      <h1>webRTC video chat example</h1>
      <div className="myVideo">
        {stream && <video playsInline autoPlay muted style={{width: '300px'}}/>}
      </div>
      <div className="remoteVideo">
        {(acceptFlag && !endFlag) && <video playsInline autoPlay style={{width: '300px'}}/>}
      </div>
    </div>
  );
}

export default App;
