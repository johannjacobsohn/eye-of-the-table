import { useTranslation } from "react-i18next";
import { Link } from "@/components/link";
import { FiHome } from "react-icons/fi";
import { MdOutlineWavingHand } from "react-icons/md";
import { Route as HelloRoute } from "@/routes/authenticated/HelloPage";

import { Flex, Text } from "@radix-ui/themes";
import { useLocation } from "@tanstack/react-router";

export function Nav() {
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="navigation-container">
      <div className="nav-section">
        <ul
          className="navigation-list"
          style={{ listStyleType: "none", padding: 0, margin: "2  em" }}
        >
          <li>
            <Link to="/">
              <Flex
                align="center"
                gap="3"
                className={`nav-item ${currentPath === "/" ? "active" : ""}`}
              >
                <FiHome size="18" />
                <Text size="3" className="nav-label">
                  {t("Home")}
                </Text>
              </Flex>
            </Link>
          </li>
          <li>
            <Link to={HelloRoute.to}>
              <Flex
                align="center"
                gap="3"
                className={`nav-item ${currentPath.includes("HelloPage") ? "active" : ""}`}
              >
                <MdOutlineWavingHand size="18" />
                <Text size="3" className="nav-label">
                  {t("Hello there")}
                </Text>
              </Flex>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
