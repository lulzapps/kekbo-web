import React, { useState } from 'react';
import './App.css';  
import './LoginModal.css';
import { WebSocketService } from './WebSocketService';

const parseHostAndPort = (input: string) => 
{
    const [host, port] = input.split(':');
    return { host, port };
};

interface LoginModalProps 
{
    onLogin: (websocket: WebSocketService) => void;
    showModal: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, showModal }) => 
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [host, setHost] = useState('localhost:8000');
    const [status, setStatus] = useState(''); 

    if (!showModal) 
    {
        return null; // Don't render the modal if showModal is false
    }

    const handleLogin = () => 
    {
        console.log('username:', username);
        console.log('password:', password);
        console.log('host:', host);
        const result = parseHostAndPort(host);

        if (!result.host.includes('.') && result.host !== 'localhost') 
        {
            setStatus('Invalid host');
            return;
        }

        var websocket = new WebSocketService(`ws://${result.host}:${result.port}/ws`);
        websocket.connect();
        
        onLogin(websocket);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Login</h2>
                <div className="input-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                    />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                    />
                </div>
                <div className="input-group">
                    <label>Host</label>
                    <input
                        type="text"
                        value={host}
                        onChange={(e) => setHost(e.target.value)}
                        placeholder="Enter host"
                    />
                </div>
                <button onClick={handleLogin} className="login-button">Login</button>
                {status && <div className="status-row">{status}</div>}
            </div>
        </div>
    );
};

export default LoginModal;
