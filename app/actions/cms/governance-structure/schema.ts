import { z } from "zod";

export const UpdateGovernanceStructureSchema = z.object({
    governanceBodies: z.array(
        z.object({
            id: z.string().optional(),
            image: z.string().min(1, "Image is required"),
            mediaAssetId: z.string().optional(),
            name: z.string().min(1, "Name is required"),
            role: z.string().min(1, "Role is required"),
        }),
    ),
});
