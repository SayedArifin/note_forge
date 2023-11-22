// Importing the 'z' object from the "zod" library.
import { z } from "zod";

// Defining a type called 'FieldErrors' which represents an object where each property corresponds to a field in a data structure, 
// and the value is an array of strings representing potential errors for that field.
export type FieldErrors<T> = {
    [K in keyof T]?: string[];
}

// Defining a type called 'ActionState' which represents the state of an action. 
// It includes optional field errors, an optional error string, and optional data of a specified output type.
export type ActionState<TInput, TOutput> = {
    fieldErrors?: FieldErrors<TInput>;
    error?: string | null;
    data?: TOutput;
}

// Defining a function called 'createSafeAction' that takes a Zod schema and a handler function as parameters.
export const createSafeAction = <TInput, TOutput>(
    schema: z.Schema<TInput>,  // Accepts a Zod schema for input data validation.
    handler: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>>  // Accepts a handler function for processing validated input data.
) => {
    // Returns an asynchronous function that takes data of type TInput and returns a Promise of ActionState<TInput, TOutput>.
    return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
        // Validates the input data using the provided Zod schema.
        const validationResult = schema.safeParse(data);

        // If validation fails, returns an object with field errors extracted from the validation result.
        if (!validationResult.success) {
            return {
                fieldErrors: validationResult.error.flatten().fieldErrors as FieldErrors<TInput>,
            };
        }

        // If validation succeeds, calls the provided handler function with the validated data and returns its result.
        return handler(validationResult.data);
    };
};
