  export interface Message {
  type: "read" | "write" | "subscribe" | "unsubscribe";
    id?: string;
    tree?: string;
    uuid?: string;
    node?: { name: string; value: any };
    nodes?: Array<{ name: string; value: any }>;
  }

  // Type guard to check if an object is a valid Message
  export function isMessage(object: any): object is Message {
    return (
      object && typeof object === "object" && "type" in object &&
      ["read", "write", "subscribe", "unsubscribe"].includes(object.type)
    );
  }
  
  export interface WebSocket {
    send: (data: string) => void;
  }
  
  export interface DataPointSchema {
    [key: string]: any;
  }