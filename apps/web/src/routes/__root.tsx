import { Outlet, createRootRoute } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Flex, Text, Heading, Button } from "@radix-ui/themes";

import { Nav } from "@/components/nav";
import { UserSettings } from "@/components/userSettings";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  ClerkProvider,
} from "@clerk/tanstack-react-start";

const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <div className="app-container">
        {/* Header */}
        <header className="header">
          <Flex
            justify="between"
            align="center"
            style={{ height: "100%", padding: "0 1.5rem" }}
          >
            <Flex align="center" gap="3">
              <Heading size="5">
                <Text color="purple">Eye</Text> Of the T
                <Text color="purple">able</Text>
              </Heading>
            </Flex>

            <Flex align="center" gap="4">
              <SignedOut>
                <Flex gap="4" justify="center" align="center" m="2">
                  <Button size="2" asChild>
                    <SignInButton />
                  </Button>
                  or
                  <Button size="2" asChild>
                    <SignUpButton />
                  </Button>
                </Flex>
              </SignedOut>
              <SignedIn>
                <UserSettings />
              </SignedIn>
            </Flex>
          </Flex>
        </header>

        <div className="content-container">
          <aside className={`navigation`}>
            <Nav />
          </aside>

          <main
            className="main-content"
            style={{ minHeight: "calc(100vh - var(--header-height))" }}
          >
            <Outlet />
          </main>
        </div>
      </div>
      {/* <TanStackRouterDevtools /> */}
    </ClerkProvider>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
});
