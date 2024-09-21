import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { InputParser, MessageType, ParsedMessage } from './InputParser';
import { WebSocketService } from './WebSocketService';
import { Commands } from './Commands';

type ChatMessage = [MessageType, string];

const App: React.FC = () => 
{
    const [message, setMessage] = useState<string>('');
    const [chat, setChat] = useState<ChatMessage[]>([]); 
    const inputParser = new InputParser();
    const wsManager = useRef<WebSocketService | null>(null);

    useEffect(() =>
    {
        return () => 
        {
            wsManager.current?.close();
        };
    }, [wsManager]);

    const printMessage = (msg: ChatMessage) =>
    {
        console.log(msg);
        setChat([...chat, msg]);
        setMessage('');
    };

    const doConnect = (host: string, port: number) =>
    {
        wsManager.current = new WebSocketService(`ws://${host}:${port}/ws`);
        wsManager.current.connect();
        printMessage([MessageType.COMMAND, 'Connected to WebSocket']);
    };

    const doDisconnect = () =>
    {
        wsManager.current?.close();
        wsManager.current = null;
        printMessage([MessageType.COMMAND, 'Disconnected from WebSocket']);
    };

    const doHelp = () =>
    {
        printMessage([MessageType.COMMAND, 'Help command received']);
    };

    const doCommand = (parsedMessage: ParsedMessage) =>
    {
        if (parsedMessage.type !== MessageType.COMMAND) return; // should never happen
        switch (parsedMessage.command)
        {
            case Commands.LOGIN:
                // host: localhost, port: 8000
                if (parsedMessage.args.length !== 2)
                {
                    printMessage([MessageType.INVALID_COMMAND, 'Invalid number of arguments for login command']);
                    return;
                }
                doConnect(parsedMessage.args[0], parseInt(parsedMessage.args[1]));
                break;
            case Commands.LOGOUT:
                doDisconnect();
                break;
            case Commands.HELP:
                doHelp();
                break;
            default:
                console.error('Invalid command received:', parsedMessage.command);
                break;
        }
    };

    const handleSendMessage = () => 
    {
        if (message.trim()) 
        {
            const parsedMessage = inputParser.parseMessage(message);
            if (parsedMessage.type === MessageType.TEXT_MESSAGE) 
            {
                console.log('Valid message:', parsedMessage);
                wsManager.current?.sendMessage(parsedMessage.text);
                printMessage([MessageType.TEXT_MESSAGE, parsedMessage.text]);
            }
            else if (parsedMessage.type === MessageType.COMMAND)
            {
                doCommand(parsedMessage);
            }
            else if (parsedMessage.type === MessageType.INVALID_COMMAND)
            {
                console.log('Invalid command:', parsedMessage);
                printMessage([MessageType.INVALID_COMMAND, parsedMessage.text]);
            }
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) =>
    {
        if (event.key === 'Enter') handleSendMessage();
    };

    return (
        <div className="chat-page">
            {/* Sidebar */}
            <div className="sidebar">
                <h2>Contacts</h2>
                <ul>
                    <li>User 1</li>
                    <li>User 2</li>
                    <li>User 3</li>
                </ul>
            </div>

            {/* Main Chat Window */}
            <div className="main-window">
                <div className="chat-window">
                    {
                        chat.map((msg, index) => 
                        {
                            if (msg[0] === MessageType.TEXT_MESSAGE)
                            {
                                return (
                                    <div key={index} className="chat-message user-message">
                                        {msg[1]}
                                    </div>
                                )
                            }
                            else if (msg[0] === MessageType.COMMAND)
                            {
                                return (
                                    <div key={index} className="command-message bot-message">
                                        {msg[1]}
                                    </div>
                                )
                            }

                            return (
                                <div key={index} className="invalid-command-message bot-message">
                                    {msg[1]}
                                </div>
                            )
                        })
                    }
                </div>

                {/* Input Area */}
                <div className="input-area">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default App;
