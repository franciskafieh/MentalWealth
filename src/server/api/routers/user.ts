import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import { TRPCError } from "@trpc/server";

import { z } from "zod";

import bcrypt from "bcrypt";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(3).max(32),
        password: z.string().min(10).max(100),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const email = input.email;
      const exists = ctx.prisma.user.findFirst({
        where: { email },
      });

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with provided email already exists",
          cause: "email",
        });
      }
      return ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          emailVerified: new Date(), // TODO
          password: await bcrypt.hash(input.password, 10),
        },
      });
    }),

    delete: protectedProcedure
    .mutation(({ ctx }) => {
      return ctx.prisma.user.delete({
        where: {
          id: ctx.session.user.id,
        }
      })
    }),

    getAll: publicProcedure.query(({ ctx }) => {
      return ctx.prisma.user.findMany();
    }),
});
