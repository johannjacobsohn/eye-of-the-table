import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Route as SignInRoute } from "@/routes/(auth)/signin";

export const Route = createFileRoute("/authenticated")({
  component: RouteComponent,
  async beforeLoad(ctx) {
    const token = await ctx.context.auth?.getToken();
    if (!token)
      throw redirect({
        to: SignInRoute.to,
      });
  },
});

function RouteComponent() {
  return <Outlet />;
}
