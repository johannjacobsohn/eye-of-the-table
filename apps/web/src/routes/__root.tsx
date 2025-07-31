import {
  Outlet,
  createRootRouteWithContext,
  Link,
} from "@tanstack/react-router";
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import {
  Flex,
  Text,
  Heading,
  Button,
  Avatar,
  IconButton,
} from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";

import { Nav } from "@/components/nav";
import { UserSettings } from "@/components/userSettings";
import { Route as SignInRoute } from "@/routes/(auth)/signin";
import { Route as SignUpRoute } from "@/routes/(auth)/signup";
import lampLogo from "@/assets/lamp.jpg";

import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";

interface RootRouteContext {
  auth?: ReturnType<typeof useAuth>;
}

const RootLayout = () => {
  const { t } = useTranslation();
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="app-container">
      <header className="header">
        <Flex
          justify="between"
          align="center"
          style={{ height: "100%", padding: "0 1.5rem" }}
        >
          <Flex align="center" gap="3">
            <IconButton
              variant="ghost"
              className="mobile-nav-toggle"
              onClick={() => setIsNavOpen(!isNavOpen)}
            >
              <RxHamburgerMenu />
            </IconButton>
            <Avatar src={lampLogo} radius="full" variant="soft" fallback="" />
            <Heading size="5">
              <Text color="purple">Eye</Text> Of the T
              <Text color="purple">able</Text>
            </Heading>
          </Flex>

          <Flex align="center" gap="4">
            <SignedOut>
              <Flex gap="4" justify="center" align="center" m="2">
                <Button size="2" asChild>
                  <Link to={SignInRoute.to}>{t("Sign In")}</Link>
                </Button>
                {t("or")}
                <Button size="2" asChild>
                  <Link to={SignUpRoute.to}>{t("Sign Up")}</Link>
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
        <aside className={`navigation ${isNavOpen ? "open" : ""}`}>
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
  );
};

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: RootLayout,
});
