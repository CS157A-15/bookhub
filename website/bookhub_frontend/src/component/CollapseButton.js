import React, { Component, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

export default function CollapseButton({ button_name, collapse_content }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="input"
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
      >
        {button_name}
      </Button>
      <Collapse in={open}>
        <div id="example-collapse-text">{collapse_content}</div>
      </Collapse>
    </>
  );
}
