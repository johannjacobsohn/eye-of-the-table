import { SignIn } from "@clerk/tanstack-react-start";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SignIn />;
}
