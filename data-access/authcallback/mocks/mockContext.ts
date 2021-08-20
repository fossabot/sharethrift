import { BindingDefinition, Context, ExecutionContext, HttpRequest, Logger, TraceContext } from "@azure/functions";

export class MockContext  implements Context {
    invocationId: string;
    executionContext: ExecutionContext;
    bindings: { [key: string]: any; };
    bindingData: { [key: string]: any; };
    traceContext: TraceContext;
    bindingDefinitions: BindingDefinition[];
    log: Logger = {
        info: function(...args: any[]) {
            return;
        },
        error: function(...args: any[]) {   
            return;
        }
    } as Logger;
    done(err?: string | Error, result?: any): void {
        return;
    }
    req?: HttpRequest;
    res?: { [key: string]: any; };
}