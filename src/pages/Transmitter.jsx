import { useEffect, useRef } from 'react'
import socket from '../socket'

const Transmitter = () => {
    const peerConnection = useRef(new RTCPeerConnection())

    useEffect(() => {
        const pc = peerConnection.current
        let stream

        // Función para capturar el audio del escritorio
        const startStreaming = async () => {
            try {
                stream = await navigator.mediaDevices.getDisplayMedia({
                    video: false,
                    audio: true, // Captura solo el audio del escritorio
                })

                const audioTracks = stream.getAudioTracks()
                if (audioTracks.length === 0) {
                    console.warn('No se encontró audio en la captura')
                    return
                }

                audioTracks.forEach((track) => pc.addTrack(track, stream))

                // Enviar candidatos ICE
                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('ice-candidate', event.candidate)
                    }
                }

                // Crear oferta solo cuando ICE gathering haya terminado
                const offer = await pc.createOffer()
                await pc.setLocalDescription(offer)

                socket.emit('offer', offer)
            } catch (error) {
                console.error(
                    'Error al capturar el audio del escritorio:',
                    error
                )
            }
        }

        startStreaming()

        // Escuchar respuesta remota
        socket.on('answer', (answer) => {
            if (!pc.currentRemoteDescription) {
                pc.setRemoteDescription(new RTCSessionDescription(answer))
            }
        })

        // Recibir candidatos ICE
        socket.on('ice-candidate', (candidate) => {
            pc.addIceCandidate(new RTCIceCandidate(candidate))
        })

        return () => {
            // Cerrar conexión y detener tracks al desmontar
            pc.close()
            if (stream) {
                stream.getTracks().forEach((track) => track.stop())
            }
        }
    }, [])

    return <h1>Transmisor Activo</h1>
}

export default Transmitter
