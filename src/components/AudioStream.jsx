// src/components/AudioStream.jsx
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io('https://webspeakers-backend.onrender.com') // Asegúrate de usar tu URL de backend aquí

const AudioStream = () => {
    const [connected, setConnected] = useState(false)
    const localAudioRef = useRef(null) // Ref para el audio del PC
    const remoteAudioRef = useRef(null) // Ref para el audio del iPhone

    const [localStream, setLocalStream] = useState(null)
    const [peerConnection, setPeerConnection] = useState(null)

    useEffect(() => {
        // Obtener el stream de audio del micrófono del PC
        const initAudioStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                })
                setLocalStream(stream)
                if (localAudioRef.current) {
                    localAudioRef.current.srcObject = stream
                }
            } catch (err) {
                console.error('Error al acceder al micrófono:', err)
            }
        }

        initAudioStream()

        // Configuración del WebRTC
        const pc = new RTCPeerConnection({
            iceServers: [
                {
                    urls: 'stun:stun.l.google.com:19302',
                },
            ],
        })

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', event.candidate)
            }
        }

        pc.ontrack = (event) => {
            if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = event.streams[0]
            }
        }

        setPeerConnection(pc)

        return () => {
            pc.close()
        }
    }, [])

    const createOffer = async () => {
        if (peerConnection && localStream) {
            localStream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, localStream)
            })

            const offer = await peerConnection.createOffer()
            await peerConnection.setLocalDescription(offer)
            socket.emit('offer', offer)
        }
    }

    const createAnswer = async (offer) => {
        if (peerConnection) {
            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(offer)
            )

            const answer = await peerConnection.createAnswer()
            await peerConnection.setLocalDescription(answer)
            socket.emit('answer', answer)
        }
    }

    useEffect(() => {
        socket.on('offer', (offer) => {
            createAnswer(offer)
        })

        socket.on('answer', (answer) => {
            if (peerConnection) {
                peerConnection.setRemoteDescription(
                    new RTCSessionDescription(answer)
                )
            }
        })

        socket.on('ice-candidate', (candidate) => {
            if (peerConnection) {
                peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
            }
        })

        return () => {
            socket.off('offer')
            socket.off('answer')
            socket.off('ice-candidate')
        }
    }, [peerConnection])

    return (
        <div>
            <h2>Audio Stream</h2>
            <audio ref={localAudioRef} autoPlay muted />
            <audio ref={remoteAudioRef} autoPlay />
            <button
                onClick={createOffer}
                className="p-2 bg-black/20 rounded-full px-4 py-2 border border-white/20 hover:scale-105"
            >
                Start Stream
            </button>
            {connected && <p>Connected to the remote device!</p>}
        </div>
    )
}

export default AudioStream
