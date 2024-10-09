// src/services/WebSocketService.ts

export class WebSocketService 
{
    private socket: WebSocket | null = null;

    constructor(private url: string)
    { 
        console.log("WebSocketService constructor");
    }

    // Connect to WebSocket
    connect() : Promise<void>
    {
        return new Promise((resolve, reject) => 
        {
            this.socket = new WebSocket(this.url);

            // Handle connection open
            this.socket.onopen = () => 
            {
                console.log('WebSocket connected');
                resolve();
            };

            // // Handle incoming messages
            // this.socket.onmessage = (event) => 
            // {
            //     console.log('Received:', event.data);
            //     resolve();
            // };

            // Handle errors
            this.socket.onerror = (error) => 
            {
                console.error('WebSocket error:', error);
                reject(new Error('WebSocket error: ' + error));
            };

            // Handle connection close
            this.socket.onclose = (event) => 
            {
                console.log('WebSocket disconnected');
                if (event.wasClean === false && this.socket?.readyState !== WebSocket.OPEN) 
                {
                    reject(new Error('WebSocket connection closed unexpectedly.'));
                }
            };
        });
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

    async receiveMessage(): Promise<string> 
    {
        return new Promise((resolve, reject) => 
        {
            if (!this.socket) 
            {
                reject(new Error('WebSocket is not connected.'));
                return;
            }

            // Set up the message handler
            this.socket.onmessage = (event) => 
            {
                resolve(event.data);
            };

            // Handle errors
            this.socket.onerror = (error) => 
            {
                console.error('WebSocket error while receiving message:', error);
                reject(new Error('WebSocket error while receiving message: ' + error));
            };
        });
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
