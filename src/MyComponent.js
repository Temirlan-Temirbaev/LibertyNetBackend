import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const MyComponent = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const socket = io('http://localhost:3000');

    useEffect(() => {
        socket.on('chat message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit('chat message', newMessage);
        setNewMessage('');
    };

    return (
        <div>
            <h1>WebSocket в Next.js</h1>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default MyComponent;
