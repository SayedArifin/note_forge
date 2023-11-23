import { z } from "zod"
export const CreateList = z.object({
    title: z.string({
        required_error: "Title is Required",
        invalid_type_error: "Title is invalid"
    }).min(1, {
        message: "Title must be at least 3 characters"
    }),
    boardId: z.string(),
})