import { z } from "zod"
export const UpdateCard = z.object({
    boardId: z.string(),
    description: z.optional(
        z.string({
            required_error: "Card description required",
            invalid_type_error: "Card type invalid",

        }).min(3, { message: "Card description must be at least 3 characters" })
    ),
    title: z.optional(
        z.string({
            required_error: "Title is Required",
            invalid_type_error: "Title is invalid"
        }).min(3, {
            message: "Title must be at least 3 characters"
        })
    ),
    id: z.string(),
})