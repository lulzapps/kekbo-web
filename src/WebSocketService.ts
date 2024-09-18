// src/services/WebSocketService.ts

export class WebSocketService 
{
    private socket: WebSocket | null = null;

    constructor(private url: string)
    { 
        console.log("WebSocketService constructor");
    }

    // Connect to WebSocket
    connect() 
    {
        this.socket = new WebSocket(this.url);

        // Handle connection open
        this.socket.onopen = () => 
        {
            console.log('WebSocket connected');
        };

        // Handle incoming messages
        this.socket.onmessage = (event) => 
        {
            console.log('Received:', event.data);
        };

        // Handle errors
        this.socket.onerror = (error) => 
        {
            console.error('WebSocket error:', error);
        };

        // Handle connection close
        this.socket.onclose = () => 
        {
            console.log('WebSocket disconnected');
        };
    }

    // Send a message
    sendMessage(message: string) 
    {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) 
        {
            this.socket.send(message);
        } 
        else 
        {
            console.error('WebSocket is not connected');
        }
    }

    // Close the WebSocket connection
    close() 
    {
        if (this.socket) 
        {
            console.log("Closing WebSocket connection");
            this.socket.close();
        }
    }
}
