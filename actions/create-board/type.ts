import { ActionState } from './../../lib/create-safe-action';
import { z } from "zod"
import { CreateBoard } from "./schema"
import { Board } from "@prisma/client"

export type InputType = z.infer<typeof CreateBoard>
export type ReturnType = ActionState<InputType, Board>