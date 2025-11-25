import { useEffect, useRef, useState, useId } from "react";
import { useSearchParams } from "react-router-dom";

export default function SidebarFilter({ priceRange, onChange }) {
  const sliderRef = useRef(null);
  const [searchParams] = useSearchParams();
  const [currentRange, setCurrentRange] = useState(
    priceRange ? priceRange : [0, 4000]
  );
  const uniqueId = useId();

  // Create unique IDs for the value spans
  const lowerValueId = `lower-value-${uniqueId}`;
  const upperValueId = `upper-value-${uniqueId}`;

  // Get initial values from URL params
  const min = Number(searchParams.get("min")) || 0;
  const max = Number(searchParams.get("max")) || 4000;

  useEffect(() => {
    // Initialize range from URL params
    setCurrentRange([min, max]);
  }, [min, max]);

  useEffect(() => {
    // Initialize slider with noUiSlider
    const initSlider = () => {
      try {
        // Check if noUiSlider is available globally
        if (
          typeof window !== "undefined" &&
          window.noUiSlider &&
          sliderRef.current
        ) {
          // Destroy existing slider if any
          if (sliderRef.current.noUiSlider) {
            sliderRef.current.noUiSlider.destroy();
          }

          // Create slider
          window.noUiSlider.create(sliderRef.current, {
            connect: true,
            behaviour: "tap",
            start: currentRange,
            range: {
              min: 0,
              "10%": [500, 500],
              "50%": [4000, 1000],
              max: 10000,
            },
            format: {
              to: function (value) {
                return Math.round(value);
              },
              from: function (value) {
                return Math.round(value);
              },
            },
          });

          // Handle slider updates (while dragging)
          sliderRef.current.noUiSlider.on("update", function (values) {
            const minVal = Math.round(values[0]);
            const maxVal = Math.round(values[1]);

            // Update display using unique IDs
            const lowerValue = document.getElementById(lowerValueId);
            const upperValue = document.getElementById(upperValueId);
            if (lowerValue) lowerValue.textContent = `$${minVal}`;
            if (upperValue) upperValue.textContent = `$${maxVal}`;

            setCurrentRange([minVal, maxVal]);
          });

          // Handle change (when user releases slider)
          sliderRef.current.noUiSlider.on("change", function (values) {
            const minVal = Math.round(values[0]);
            const maxVal = Math.round(values[1]);

            // Call the onChange callback to update URL params
            if (onChange) {
              onChange([minVal, maxVal]);
            }
          });

          // console.log("Price range slider initialized successfully");
        } else {
          console.warn("noUiSlider not available, retrying...");
          // Retry after a short delay
          setTimeout(initSlider, 500);
        }
      } catch (error) {
        console.error("Error initializing price range slider:", error);
      }
    };

    // Wait a bit for noUiSlider to be available, then initialize
    const timeout = setTimeout(initSlider, 1000);

    return () => {
      clearTimeout(timeout);
      // Cleanup slider on unmount
      if (sliderRef.current && sliderRef.current.noUiSlider) {
        try {
          sliderRef.current.noUiSlider.destroy();
        } catch (error) {
          console.warn("Error destroying slider:", error);
        }
      }
    };
  }, []); // Only run once on mount

  // Update slider when URL params change externally
  useEffect(() => {
    if (sliderRef.current && sliderRef.current.noUiSlider) {
      try {
        sliderRef.current.noUiSlider.set([min, max]);
      } catch (error) {
        console.warn("Failed to update slider values:", error);
      }
    }
  }, [min, max]);

  return (
    <div className="sidebar-filter mt-50">
      <div className="top-filter-head">Product Filters</div>
      <div className="common-filter">
        <div className="head">Price</div>
        <div className="price-range-area">
          <div ref={sliderRef} className="price-range-slider" />
          <div className="value-wrapper d-flex">
            <div className="price">Price:</div>
            <span id={lowerValueId}>${currentRange[0]}</span>
            <div className="to">to</div>
            <span id={upperValueId}>${currentRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
