import "./style.scss";
import { useRef, useState, useEffect } from "react";

const sectionStyle = ["Auto", "Paragraph", "Bullets"];

function SectionStyle() {
  const [selectedTemp, setSelectedTemp] = useState("Auto");

  const elementRef = useRef<HTMLDivElement>(null);

  const [showOptions, setShowOptions] = useState(false);

  const handleClickOutside = (event: MouseEvent | React.MouseEvent) => {
    // Check if the target element is not within the desired component
    if (!elementRef.current?.contains(event.target as Node)) {
      setShowOptions(false);
    } else {
      setShowOptions(true);
    }
  };

  useEffect(() => {
    document.addEventListener("click", (e) => handleClickOutside(e));

    return () => {
      document.removeEventListener("click", (e) => handleClickOutside(e));
    };
  }, []);

  return (
    <div className="template__wrapper">
      {showOptions && (
        <div className="templates">
          {sectionStyle.map(
            (temp, index) =>
              temp !== selectedTemp && (
                <div
                  onClick={() => setSelectedTemp(temp)}
                  key={index}
                  className="section__style"
                >
                   <p>{temp}</p>

                </div>
              )
          )}
        </div>
      )}

      <div
        ref={elementRef}
        onClick={handleClickOutside}
        className="section__style"
      >
         <p>{selectedTemp}</p>
         <img src="/icons/expand.svg" alt="" />
      </div>
    </div>
  );
}
export default SectionStyle;
