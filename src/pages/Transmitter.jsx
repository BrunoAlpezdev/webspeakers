import { useEffect, useRef } from 'react'
import socket from '../socket'

async function getDesktopAudioStream() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: false,
            audio: true, // Captura solo el audio del escritorio
        })

        const audioTracks = stream.getAudioTracks()
        if (audioTracks.length === 0) {
            console.warn('No se encontró audio en la captura de pantalla')
            return null
        }

        return stream // Devuelve el stream con el audio del sistema
    } catch (error) {
        console.error('Error al capturar el audio del escritorio:', error)
        return null
    }
}

const Transmitter = () => {
    const peerConnection = useRef(new RTCPeerConnection())

    useEffect(() => {
        const pc = peerConnection.current

        navigator.mediaDevices
            .getDisplayMedia({
                video: false,
                audio: true, // Captura solo el audio del escritorio
            })
            .then((stream) => {
                stream
                    .getTracks()
                    .forEach((track) => pc.addTrack(track, stream))

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
