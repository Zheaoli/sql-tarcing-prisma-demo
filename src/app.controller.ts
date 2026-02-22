import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { trace, context } from "@opentelemetry/api";
import { PrismaService } from "./prisma.service";

function getSqlComments(req: Request): Record<string, string> {
  const comments: Record<string, string> = {};

  // Request info
  comments.route = req.path;
  comments.method = req.method;
  if (req.route?.path) {
    comments["route_pattern"] = req.route.path;
  }

  // OpenTelemetry trace context
  const span = trace.getSpan(context.active());
  if (span) {
    const ctx = span.spanContext();
    comments.traceparent = `00-${ctx.traceId}-${ctx.spanId}-0${ctx.traceFlags}`;
  }

  return comments;
}

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getHello(): string {
    return `Hello World!`;
  }

  @Get("posts")
  getPosts(@Req() req: Request) {
    return this.prisma.post.findMany({
      take: 100,
      sqlComments: getSqlComments(req),
    });
  }

  @Get("posts/:id")
  getPostsById(@Param("id") id: string, @Req() req: Request) {
    return this.prisma.post.findUnique({
      where: { id },
      sqlComments: getSqlComments(req),
    });
  }

  @Get("posts-with-comments")
  getPostsWithComments(@Req() req: Request) {
    return this.prisma.post.findMany({
      take: 100,
      include: {
        comments: true,
      },
      sqlComments: getSqlComments(req),
    });
  }

  @Get("posts-with-comments/:id")
  getPostWithCommentsById(@Param("id") id: string, @Req() req: Request) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        comments: true,
      },
      sqlComments: getSqlComments(req),
    });
  }

  @Post("posts")
  createPost(@Body() body: { title: string; body: string }, @Req() req: Request) {
    return this.prisma.post.create({
      data: {
        title: body.title,
        body: body.body,
      },
      sqlComments: getSqlComments(req),
    });
  }
}
