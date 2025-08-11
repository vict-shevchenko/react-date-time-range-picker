import React from "react";
import { format, addMinutes } from "date-fns";
import { useMemo } from "react";

function InputTimeZoned(props) {
  const {
    timeZone: _timeZone,
    dateFormat = "P",
    time24hFormat,
    ...rest
  } = props;
  const timeFormat = time24hFormat ? "hh:mm" : "HH:mm";
  function handleFocus(e) {
    const focusType = props.type || "time";
    e.target.type = focusType;
    let value = props.value;
    if (!value) {
      const now = new Date();
      if (focusType === "date") {
        value = format(addMinutes(now, 1), dateFormat);
      } else {
        value = format(addMinutes(now, 1), timeFormat);
      }
    }
    e.target.value = value;
    e.target.showPicker();
  }

  function handleBlur(e) {
    e.target.type = "text";
    e.target.value = "";
  }

  const placeholder = useMemo(() => {
    let value = props.placeholder || "Now";
    if (props.value) {
      const dateTime = props.value;
      if (props.type === "date") {
        value = format(dateTime, dateFormat);
      } else {
        if (props.time24hFormat) {
          return dateTime;
        } else {
          const [hours, minutes] = dateTime.split(":");
          let parsedHours = parseInt(hours);
          if (parsedHours > 11) {
            if (parsedHours > 12) {
              parsedHours -= 12;
            }
            const fixed = parsedHours.toString().padStart(2, "0");
            value = `${fixed}:${minutes} PM`;
          } else {
            value = `${hours}:${minutes} AM`;
          }
        }
      }
    }
    return value;
  }, [props.value, props.placeholder, props.type]);

  return (
    <div style={{ flex: 1, width: "100%" }}>
      {props.label && (
        <label className="ops-dropdown__label">
          {props.label}{" "}
          {props.required && <span className="ops-text-red">*</span>}
        </label>
      )}
      <input
        {...rest}
        type="text"
        className="ops-text-grey-800 ops-elevation-20 rounded-md w-full"
        name="time"
        value={undefined} // Value needs to be undefined to avoid uncontrolled input warning
        onChange={props.onChange}
        readOnly={props.readOnly}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
    </div>
  );
}

export default InputTimeZoned