import { useTimeout } from "@/hooks";
import { useState } from "react";
import clsx from "clsx";

export type LoadingProps = {
  delay?: number;
  className?: string;
};

/**
 * Loading displays a loading state with an optional delay
 */
function Loading(props: LoadingProps) {
  const { delay = 0, className } = props;
  const [showLoading, setShowLoading] = useState(!delay);

  useTimeout(() => {
    setShowLoading(true);
  }, delay);

  return (
    <div
      id="splash-screen"
      className={clsx(className, "", !showLoading ? "hidden" : "")}
    >
      <div id="loader">
        <svg height="0" width="0" viewBox="0 0 64 64" id="absolute">
          <defs xmlns="http://www.w3.org/2000/svg">
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="2"
              x2="0"
              y1="62"
              x1="0"
              id="b"
            >
              <stop stopColor="#667EEA"></stop>
              <stop stopColor="#764BA2" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="0"
              x2="0"
              y1="64"
              x1="0"
              id="c"
            >
              <stop stopColor="#36D1DC"></stop>
              <stop stopColor="#5B86E5" offset="1"></stop>
              <animateTransform
                repeatCount="indefinite"
                keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
                keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
                dur="8s"
                values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
                type="rotate"
                attributeName="gradientTransform"
              ></animateTransform>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="2"
              x2="0"
              y1="62"
              x1="0"
              id="d"
            >
              <stop stopColor="#A8EDEA"></stop>
              <stop stopColor="#6DD5ED" offset="1"></stop>
            </linearGradient>
          </defs>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="96"
          width="96"
          id="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="7"
            stroke="url(#b)"
            d="M 12,56 L 32,12 L 52,56 M 20,40 L 44,40"
            id="dash"
            pathLength={360}
          ></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          style={
            {
              "--rotation-duration": "0ms",
              "--rotation-direction": "normal",
            } as React.CSSProperties
          }
          viewBox="0 0 64 64"
          height="96"
          width="96"
          id="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="7"
            stroke="url(#c)"
            d="M 12,12 L 12,56 M 12,12 L 40,12 Q 52,12 52,22 Q 52,32 40,32 L 12,32"
            id="dash"
            pathLength={360}
          ></path>
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          style={
            {
              "--rotation-duration": "0ms",
              "--rotation-direction": "normal",
            } as React.CSSProperties
          }
          viewBox="0 0 64 64"
          height="96"
          width="96"
          id="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="7"
            stroke="url(#d)"
            d="M 12,12 L 12,56 L 52,56"
            id="dash"
            pathLength={360}
          ></path>
        </svg>
      </div>
    </div>
  );
}

export default Loading;
