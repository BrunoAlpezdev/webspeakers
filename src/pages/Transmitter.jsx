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
                    audio: {
                        echoCancellation: true, // Elimina el eco
                        noiseSuppression: true, // Reduce el ruido de fondo
                        autoGainControl: true, // Ajusta automáticamente el volumen
                    },
                })

                const audioTracks = stream.getAudioTracks()
                if (audioTracks.length === 0) {
                    console.warn('No se encontró audio en la captura')
                    return
                }

                // Agregar los tracks de audio al peerConnection
                audioTracks.forEach((track) => pc.addTrack(track, stream))

                // Enviar candidatos ICE
                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('ice-candidate', event.candidate)
                    }
                }

                // Crear la oferta solo cuando ICE gathering haya terminado
                const offer = await pc.createOffer()
                await pc.setLocalDescription(offer)

                socket.emit('offer', offer)

                // Mejorar el bitrate de la conexión
                pc.getSenders().forEach((sender) => {
                    const params = sender.getParameters()
                    if (params.encodings) {
                        params.encodings.forEach((encoding) => {
                            encoding.maxBitrate = 256000 // Ajuste el bitrate a 256 kbps
                        })
                    }
                    sender.setParameters(params)
                })
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
