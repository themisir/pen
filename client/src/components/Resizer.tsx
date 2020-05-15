import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  RefObject,
} from "react";
import "./Resizer.css";

interface Props {
  value: number;
  onResize(value: number): void;
  onStopResize?(value: number): void;
}

const Resizer: React.FC<Props> = ({ value, onResize, onStopResize }) => {
  const [dragging, setDragging] = useState(false);
  const [clientW, setClientWidth] = useState(0);
  const divRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>;

  const updateDragging = useCallback(
    (event: MouseEvent | PointerEvent) => {
      onResize((event.pageX + clientW / 2) / document.body.clientWidth);
      console.log(clientW);
    },
    [onResize, clientW]
  );

  const startDragging = useCallback(() => {
    setDragging(true);
  }, [setDragging]);

  const stopDragging = useCallback(() => {
    setDragging(false);
    onStopResize?.call(void 0, value);
  }, [setDragging, onStopResize, value]);

  useLayoutEffect(() => {
    if (divRef.current) {
      setClientWidth(divRef.current.clientWidth);
    }
  }, [divRef]);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", updateDragging);
      window.addEventListener("pointermove", updateDragging);
      window.addEventListener("mouseup", stopDragging);
      window.addEventListener("pointerup", stopDragging);

      return () => {
        window.removeEventListener("mousemove", updateDragging);
        window.removeEventListener("pointermove", updateDragging);
        window.removeEventListener("mouseup", stopDragging);
        window.removeEventListener("pointerup", stopDragging);
      };
    }
  }, [dragging, updateDragging, stopDragging]);

  return (
    <div
      ref={divRef}
      className="Resizer"
      onMouseDown={startDragging}
      onPointerDown={startDragging}
    >
      {dragging ? (
        <style
          dangerouslySetInnerHTML={{
            __html:
              "iframe{pointer-events:none!important}*{cursor:e-resize!important}",
          }}
        />
      ) : null}
    </div>
  );
};

export default Resizer;
