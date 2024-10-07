// Define COLORS as an enum
export enum COLORS {
    RESET = "\x1b[0m",
    GREEN = "\x1b[32m",
    BLUE = "\x1b[34m",
    RED = "\x1b[31m",
    PALE_WHITE = "\x1b[37m",
    GREY = "\x1b[90m",
    YELLOW = "\x1b[33m",
    BOLD = "\x1b[1m",
  }
  
  // Define the MessageType enum to strictly enforce allowed types
  export enum MessageType {
    RECEIVED = "RECEIVED",
    SENT = "SENT",
    ERROR = "ERROR",
    OTHER = "OTHER",
  }
  
  // Mapping MessageType to their corresponding colors
  const MessageTypeColors: Record<MessageType, COLORS> = {
    [MessageType.RECEIVED]: COLORS.GREEN,
    [MessageType.SENT]: COLORS.BLUE,
    [MessageType.ERROR]: COLORS.RED,
    [MessageType.OTHER]: COLORS.PALE_WHITE,
  };
  
  // Type the color to be strictly one of the values in the COLORS enum
  export function logWithColor(message: string, color: COLORS): void {
    console.log("\n", color, message, COLORS.RESET);
  }
  
  // Function to log a formatted message using the MessageType
  export function logMessage(featureStr: string, type: MessageType, label: string = ""): void {
    let color = MessageTypeColors[type] as string;
    const datetimeNow = new Date().toLocaleString();
    let labelText: string;
  
    switch (type) {
      case MessageType.RECEIVED:
        labelText = "\u2193 ".concat(label || "Client Received");
        break;
      case MessageType.SENT:
        labelText = "\u2191 ".concat(label || "Client Sent");
        break;
      case MessageType.ERROR:
        labelText = "\u2716".concat(label || "Internal Error");
        break;
      case MessageType.OTHER:
        labelText = label || "Message";
        color = COLORS.RESET;
        break;
      default:
        labelText = label || "Unknown";
        color = COLORS.RESET;
    }
  
    const logEntry = `\n${COLORS.PALE_WHITE}${datetimeNow}${COLORS.RESET} ${color}${labelText}${COLORS.RESET}`;
    console.log(logEntry);
    console.log(featureStr);
  }
  