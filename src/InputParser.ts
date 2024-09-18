import { isValidCommand, Commands } from './Commands';

export enum MessageType
{
    TEXT_MESSAGE,
    COMMAND,
    INVALID_COMMAND
};

export type ParsedMessage = 
  | { type: MessageType.TEXT_MESSAGE, text: string }
  | { type: MessageType.COMMAND, command: Commands, args: string[] }
  | { type: MessageType.INVALID_COMMAND, text: string };

export class InputParser
{

constructor() {}

parseMessage(input: string): ParsedMessage
{
    if (input.trim().startsWith('/'))
    {
        const command = input.split(' ')[0].substring(1);
        if (isValidCommand(command))
        {
            const args = input.split(' ').slice(1);
            return { type: MessageType.COMMAND, command: command as Commands, args: args };
        }
        else
        {
            return { type: MessageType.INVALID_COMMAND, text: input.trim() };
        }
    }

    return { type: MessageType.TEXT_MESSAGE, text: input.trim() };
}

validateMessage(input: string): boolean
{
    const trimmedInput = input.trim();
    return trimmedInput.length > 0 && trimmedInput.length <= 200;
}

// parseMessages(inputs: string[]): string[]
// {
//     return inputs.map((input) => this.parseMessage(input));
// }

}
