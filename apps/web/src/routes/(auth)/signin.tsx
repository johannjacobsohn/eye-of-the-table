import { SignIn } from "@clerk/clerk-react";
import { shadcn } from "@clerk/themes";
import { Flex } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import "./login.css"; // Add styles for inputs, buttons, and h1 elements similar to Radix components

export const Route = createFileRoute("/(auth)/signin")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Flex id="signin" justify="center">
      <SignIn appearance={{ theme: shadcn }} />
    </Flex>
  );
}
