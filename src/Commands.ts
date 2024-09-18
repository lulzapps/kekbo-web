// src/Commands.ts

export enum Commands 
{
    LOGIN = 'login',
    LOGOUT = 'logout',
    HELP = 'help',
    // Add more commands as needed
}

export function isValidCommand(command:string):boolean
{
    return Object.values(Commands).includes(command as Commands);
}