import React, { useState, useRef, useEffect } from 'react';
import SimplePeer from 'simple-peer';
import { FileEarmarkArrowUp } from 'react-bootstrap-icons';

const FileSharing: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (peer) {
            peer.on('data', handleData);
            peer.on('signal', handleSignal);
            peer.on('connect', handleConnect);
        }

        return () => {
            // Clean up when the component unmounts
            if (peer) {
                peer.destroy();
                setPeer(null);
            }
        };
    }, [peer]);

    const handleData = (data: any) => {
        // Handle incoming data (file chunks) from the other peer
        console.log('Received data:', data);
    };

    const handleSignal = (signal: any) => {
        // Handle signaling data (ice candidates) to establish a connection
        console.log('Signal data:', signal);
        if (peer) {
            peer.signal(signal); // Provide the signaling data to the signal method
        }
    };


    const handleConnect = () => {
        // Connection established
        console.log('Connection established!');
        if (file) {
            sendFileChunks(file);
        }
    };

    const initiateFileTransfer = () => {
        if (fileInputRef.current && fileInputRef.current.files) {
            const selectedFile = fileInputRef.current.files[0];
            if (selectedFile) {
                setFile(selectedFile);
                const newPeer = new SimplePeer({ initiator: true, trickle: false });
                setPeer(newPeer);
                newPeer.signal(""); // Initiates the signaling process
            }
        }
    };

    const sendFileChunks = (_file: File) => {
    };

    return (
        <div>
            <h1>React WebRTC File Sharing</h1>
            <input type="file" ref={fileInputRef} />
            <button onClick={initiateFileTransfer}>
                <FileEarmarkArrowUp /> Initiate File Transfer
            </button>
        </div>
    );
};

export default FileSharing;
