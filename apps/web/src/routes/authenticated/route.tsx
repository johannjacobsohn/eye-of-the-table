import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/authenticated")({
  component: RouteComponent,
  async beforeLoad(ctx) {
    const token = await ctx.context.auth?.getToken();
    if (!token)
      throw redirect({
        to: "/login",
      });
  },
});

function RouteComponent() {
  return <Outlet />;
}
