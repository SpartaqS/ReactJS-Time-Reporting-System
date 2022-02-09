import React, { useState, useContext } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import DateContext from './DateContext';

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

function ScriptedDatePicker(props) {
  const {selectedDate} = useContext(DateContext)
  const [pickedDate, setPickedDate] = useState(selectedDate)
  function handleChange(value){
    setPickedDate(value);
    props.callback(value);
  }

  return (
    <DatePicker
      selected={pickedDate} 
      onChange={(pickedDate) => handleChange(pickedDate)} // call handler
      dateFormat={"yyyy-MM-dd"}
    />
  );
};

export default ScriptedDatePicker;