// Implementing Int64 class that matches the structure expected by Thrift
import {
    Int64
  } from "../gen-nodejs/IClientRPCService_types";
export class MyInt64 implements Int64 {
    private value: bigint;

    constructor(input?: number | string) {
      this.value = BigInt(input ?? 0); // Handle input as either number or string
    }
    ["constructor"](o?: number | string): this {
        throw new Error("Method not implemented.");
    }
  
    toString(): string {
      return this.value.toString();
    }
  
    toJson(): string {
      return this.toString(); // You can customize this if needed
    }
  }