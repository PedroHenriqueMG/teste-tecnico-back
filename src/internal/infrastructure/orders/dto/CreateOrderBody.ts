import {z} from 'zod';

const stateEnum = z.enum(["CREATED", "ANALYSIS", "COMPLETED"]);
const statusEnum = z.enum(["ACTIVE", "DELETED"]);
const serviceStatusEnum = z.enum(["PENDING", "DONE"]);

export const CreateOrderBodySchema = z.object({
  lab: z.string().min(1, "Lab is required"),
  patient: z.string().min(1, "Patient is required"),
  customer: z.string().min(1, "Customer is required"),
  state: stateEnum.optional().default("CREATED"),
  status: statusEnum.optional().default("ACTIVE"),
  services: z.array(
    z.object({
      name: z.string().min(1, "Service name is required"),
      value: z.number().positive("Service value must be positive"),
      status: serviceStatusEnum.optional().default("PENDING"),
    })
  ).min(1, "At least one service is required"),
});

export type CreateOrderBody = z.infer<typeof CreateOrderBodySchema>;