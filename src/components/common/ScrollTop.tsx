"use client";

import { useEffect } from "react";

export default function ScrollTop() {
  useEffect(() => {
    // Calculate document height once
    const documentHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const box = document.querySelector(".scrollToTop");
    if (box) {
      const water = box.querySelector(".water");

      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const percent = Math.min(
          Math.floor((scrollPosition / documentHeight) * 100),
          100
        );

        if (water) {
          (water as HTMLElement).style.transform =
            "translate(0," + (100 - percent) + "%)";
        }

        if (scrollPosition >= 200) {
          (box as HTMLElement).style.display = "block";
        } else {
          (box as HTMLElement).style.display = "none";
        }
      };

      const handleClick = () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      };

      window.addEventListener("scroll", handleScroll);
      box.addEventListener("click", handleClick);

      // Preloader functionality
      const removePreloader = () => {
        document.body.classList.remove("preloader-active");
      };

      document.body.classList.add("preloader-active");
      window.addEventListener("load", removePreloader);
      const scrollEvent = new Event("scroll");
      window.dispatchEvent(scrollEvent);
      // Cleanup function
      return () => {
        window.removeEventListener("scroll", handleScroll);
        box.removeEventListener("click", handleClick);
        window.removeEventListener("load", removePreloader);
      };
    }
  }, []); // Empty dependency array means this runs once on mount
  useEffect(() => {
    const handleScroll = () => {
      const offset = 100; // adjust as needed
      if (window.scrollY > offset) {
        document
          .querySelector(".scrollToTop")
          ?.classList.add("active-progress");
        document
          .querySelector(".tmp-ready-chat")
          ?.classList.add("chat-visible");
      } else {
        document
          .querySelector(".scrollToTop")
          ?.classList.remove("active-progress");
        document
          .querySelector(".tmp-ready-chat")
          ?.classList.remove("chat-visible");
      }
    };
    setTimeout(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="scrollToTop" style={{ display: "block" }}>
      <div className="arrowUp">
        <i className="fa-light fa-arrow-up" />
      </div>
      <div className="water" style={{ transform: "translate(0px, 87%)" }}>
        <svg viewBox="0 0 560 20" className="water_wave water_wave_back">
          <use xlinkHref="#wave" />
        </svg>
        <svg viewBox="0 0 560 20" className="water_wave water_wave_front">
          <use xlinkHref="#wave" />
        </svg>
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 560 20"
          style={{ display: "none" }}
        >
          <symbol id="wave">
            <path
              d="M420,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C514,6.5,518,4.7,528.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H420z"
              fill="#"
            />
            <path
              d="M420,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C326,6.5,322,4.7,311.5,2.7C304.3,1.4,293.6-0.1,280,0c0,0,0,0,0,0v20H420z"
              fill="#"
            />
            <path
              d="M140,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C234,6.5,238,4.7,248.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H140z"
              fill="#"
            />
            <path
              d="M140,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C46,6.5,42,4.7,31.5,2.7C24.3,1.4,13.6-0.1,0,0c0,0,0,0,0,0l0,20H140z"
              fill="#"
            />
          </symbol>
        </svg>
      </div>
    </div>
  );
}
