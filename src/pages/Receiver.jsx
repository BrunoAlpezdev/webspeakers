import { useEffect, useRef } from 'react'
import socket from '../socket'

const Receiver = () => {
    const audioRef = useRef(null)
    const peerConnection = useRef(new RTCPeerConnection())

    useEffect(() => {
        const currentPeerConnection = peerConnection.current

        currentPeerConnection.ontrack = (event) => {
            const [remoteStream] = event.streams
            if (audioRef.current) {
                audioRef.current.srcObject = remoteStream
            }
        }

        currentPeerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', event.candidate)
            }
        }

        socket.on('offer', (offer) => {
            currentPeerConnection.setRemoteDescription(
                new RTCSessionDescription(offer)
            )
            currentPeerConnection.createAnswer().then((answer) => {
                currentPeerConnection.setLocalDescription(answer)
                socket.emit('answer', answer)
            })
        })

        socket.on('ice-candidate', (candidate) => {
            currentPeerConnection.addIceCandidate(
                new RTCIceCandidate(candidate)
            )
        })

        return () => {
            currentPeerConnection.close()
        }
    }, [])

    return (
        <div>
            <h1>Receptor Activo</h1>
            <audio ref={audioRef} autoPlay controls />
        </div>
    )
}

export default Receiver
