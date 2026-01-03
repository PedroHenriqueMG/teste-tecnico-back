import z from "zod";
import { stateEnum } from "./CreateOrderBody";

export const QueryParamsSchema = z.object({
    page: z.coerce.number().optional().default(1),
    rowPerPage: z.coerce.number().optional().default(10),
    state: stateEnum.optional(),
});

export type GetOrdersParams = z.infer<typeof QueryParamsSchema>;