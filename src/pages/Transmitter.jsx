import { useEffect, useRef } from 'react'
import socket from '../socket'

const Transmitter = () => {
    const peerConnection = useRef(new RTCPeerConnection())

    useEffect(() => {
        const pc = peerConnection.current

        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            stream.getTracks().forEach((track) => pc.addTrack(track, stream))

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('ice-candidate', event.candidate)
                }
            }

            pc.createOffer().then((offer) => {
                pc.setLocalDescription(offer)
                socket.emit('offer', offer)
            })
        })

        socket.on('answer', (answer) => {
            pc.setRemoteDescription(new RTCSessionDescription(answer))
        })

        socket.on('ice-candidate', (candidate) => {
            pc.addIceCandidate(new RTCIceCandidate(candidate))
        })

        return () => {
            pc.close()
        }
    }, [])

    return <h1>Transmisor Activo</h1>
}

export default Transmitter
