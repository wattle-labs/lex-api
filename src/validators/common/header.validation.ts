import { z as zod } from 'zod';

export const headerValidator = zod.object({
  Authorization: zod.string().startsWith('Bearer '),
});
