import { useEffect, useState } from "react";

/**
 * @typedef {Object} ToastProps
 * @property {string} message
 * @property {boolean} visible
 * @property {() => void} onHide
 */

/**
 * @param {ToastProps} props
 * @returns {import("react").JSX.Element | null}
 */
export function Toast({ message, visible, onHide }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onHide();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);

  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "#e94560",
      color: "#fff",
      padding: "12px 24px",
      borderRadius: "8px",
      fontSize: "16px",
      zIndex: 1000,
    }}>
      {message}
    </div>
  );
}
