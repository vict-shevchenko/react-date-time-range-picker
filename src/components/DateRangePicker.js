import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DateRange from './DateRange';
import DefinedRange from './DefinedRange';
import { findNextRangeIndex, generateStyles } from '../utils.js';
import classnames from 'classnames';
import coreStyles from '../styles';
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { format } from "date-fns-tz";

function valueToZonedTime(value, timeZone) {
  if (!value) return null;
  const utc = zonedTimeToUtc(value, timeZone);
  return utc;
}

class DateRangePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedRange: [findNextRangeIndex(props.ranges), 0],
      showDefinedRange: props.showDefinedRange,
    };
    this.styles = generateStyles([coreStyles, props.classNames]);
  }

  render() {
    /**
     * Here I am intercepting the normal unified onChange that gets passed
     * in and am attaching a label property (i.e. "Last 4 Hours") if the
     * event came from the list of predefined ranges.
     */
    const specialHandleChange = (event, label) => {
      // Changed to Object.keys because in multiple ranges 'selection' is not the base name
      Object.keys(event).forEach((key) => {
        if (typeof label !== "undefined") {
          event[key].label = label;
        } else {
          event[key].label = "";
          if (this.props.timeZone) {
            const startDate = valueToZonedTime(
              event[key].startDate,
              this.props.timeZone
            );
            const endDate = valueToZonedTime(
              event[key].endDate,
              this.props.timeZone
            );
            event[key].startDate = startDate;
            event[key].endDate = endDate;
          }
        }
      });
      this.props.onChange(event);
    };

    let minDate = this.props.minDate;
    let ranges = structuredClone(this.props.ranges);
    if (this.props.timeZone) {
      const zonedMinDate = utcToZonedTime(minDate, this.props.timeZone);

      if (minDate) {
        // If a timezone is provided, convert the minDate to that timezone
        minDate = zonedMinDate;
      }

      // Change Value into zoned time
      ranges.forEach((range) => {
        if (range.startDate) {
          range.startDate = utcToZonedTime(
            range.startDate,
            this.props.timeZone
          );
        }
        if (range.endDate) {
          range.endDate = utcToZonedTime(range.endDate, this.props.timeZone);
        }
      });
    }

    const { focusedRange, showDefinedRange } = this.state;

    return (
      <div
        className={classnames(
          this.styles.dateRangePickerWrapper,
          this.props.className
        )}
      >
        {showDefinedRange !== false ? (
          <DefinedRange
            focusedRange={focusedRange}
            onPreviewChange={(value) => this.dateRange.updatePreview(value)}
            {...this.props}
            ranges={ranges}
            minDate={minDate}
            range={ranges[focusedRange[0]]}
            className={undefined}
            onChange={specialHandleChange}
            label={this.props.label}
          />
        ) : null}
        <DateRange
          onRangeFocusChange={(focusedRange) => this.setState({ focusedRange })}
          focusedRange={focusedRange}
          {...this.props}
          ranges={ranges}
          minDate={minDate}
          onChange={specialHandleChange}
          ref={(t) => (this.dateRange = t)}
          className={undefined}
        />
      </div>
    );
  }
}

DateRangePicker.defaultProps = { showDefinedRange: true };

DateRangePicker.propTypes = {
  ...DateRange.propTypes,
  ...DefinedRange.propTypes,
  className: PropTypes.string,
  showDefinedRange: PropTypes.bool,
};

export default DateRangePicker;
