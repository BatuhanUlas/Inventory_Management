import { useEffect, useState } from "react";
import Image from "react-bootstrap/Image";

import arrow from "assets/icons/arrow-up-solid.svg";

export const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrolltToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  return (
    <Image
      src={arrow}
      onClick={scrolltToTop}
      style={{
        height: "100px",
        aspectRatio: "1/1",
        objectFit: "contain",
        display: visible ? "inline" : "none",
      }}
      className="scroll-to-top-button"
    />
  );
};
