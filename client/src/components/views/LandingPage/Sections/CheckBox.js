import React from "react";
import { Checkbox } from "antd";
function CheckBox(props) {
  return (
    <React.Fragment key={props.extraVal}>
      <Checkbox
        onChange={() => {
          props.handleClick(props.extraVal);
        }}
        type="checkbox"
      />
      <span>{props.val}</span>
    </React.Fragment>
  );
}

export default CheckBox;
