import React, { useState } from "react";
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";

import { FiGlobe, FiSun, FiMoon, FiMonitor } from "react-icons/fi";
import { DropdownMenu, Text, Flex, Avatar } from "@radix-ui/themes";
import { useTheme } from "next-themes";

import { SignOutButton, useUser } from "@clerk/tanstack-react-start";

type Language = "en" | "de";

export const UserSettings: React.FC = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState<Language>("en");
  const { theme, setTheme } = useTheme();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage as Language);
  };

  const { user } = useUser();

  const userName = user?.primaryEmailAddress?.emailAddress;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Flex gap="2" align="center">
          <Avatar size="2" src={user?.imageUrl} fallback="A" />
          <Text className="nav-label">{t("Settings")}</Text>
        </Flex>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>
          <Text size="2">
            {t("Signed in as")} {userName}
          </Text>
        </DropdownMenu.Label>

        <DropdownMenu.Separator />

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <Flex gap="2" align="center">
              <FiGlobe />
              <Text>
                {t("Language")}: {language.toUpperCase()}
              </Text>
            </Flex>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item onClick={() => handleLanguageChange("en")}>
              {t("English")}
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => handleLanguageChange("de")}>
              {t("Deutsch")}
            </DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <Flex gap="2" align="center">
              {theme === "light" ? <FiSun /> : <FiMoon />}
              <Text>
                {t("Theme")}: {theme === "light" ? t("Light") : t("Dark")}
              </Text>
            </Flex>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item onClick={() => setTheme("light")}>
              <Flex gap="2" align="center">
                <FiSun />
                <Text>{t("Light")}</Text>
              </Flex>
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => setTheme("dark")}>
              <Flex gap="2" align="center">
                <FiMoon />
                <Text>{t("Dark")}</Text>
              </Flex>
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => setTheme("system")}>
              <Flex gap="2" align="center">
                <FiMonitor />
                <Text>{t("System")}</Text>
              </Flex>
            </DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>

        <DropdownMenu.Separator />

        <DropdownMenu.Item>
          <SignOutButton>
            <Text>{t("Sign out")}</Text>
          </SignOutButton>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
