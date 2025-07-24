import React from "react";
import { format, addMinutes } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { useMemo } from "react";

function InputTimeZoned(props) {
  const timeZone = props.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const dateFormat = props.dateFormat || "P";
  const timeFormat = props.time24hFormat ? "hh:mm" : "HH:mm";
  function handleFocus(e) {
    const focusType = props.type || "time";
    e.target.type = focusType;
    let value = props.value;
    if (!value) {
      const now = utcToZonedTime(new Date(), timeZone);
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
        // dateTime needs to be translated to UTC and then to the timezone
        // to get the correct date with the local parser
        const zoned = utcToZonedTime(dateTime, timeZone);
        value = format(zoned, "P");
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
  }, [props.value, props.placeholder, props.type, timeZone]);

  return (
    <div style={{ flex: 1, width: '100%' }}>
      {props.label && <label className="ops-dropdown__label">{props.label} {props.required && <span className="ops-text-red">*</span>}</label>}
      <input
        {...props}
        type="text"
        className="ops-text-grey-800 placeholder-gray-600 ops-elevation-20"
        style={{ border: '1px solid var(--color-elevation-40)', width: '100%'}}
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