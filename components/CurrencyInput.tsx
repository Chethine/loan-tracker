"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  min?: number;
  id?: string;
  name?: string;
}

/** Format a raw number string (digits + optional decimal) with comma separators. */
function addCommas(raw: string): string {
  if (!raw) return "";
  const [intPart, decPart] = raw.split(".");
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart !== undefined ? `${formatted}.${decPart}` : formatted;
}

/** Strip commas and return a clean numeric string. */
function strip(s: string) {
  return s.replace(/,/g, "");
}

export default function CurrencyInput({
  value,
  onChange,
  placeholder,
  className,
  required,
  min,
  id,
  name,
}: Props) {
  const [display, setDisplay] = useState(() =>
    value ? addCommas(String(value)) : ""
  );
  const ref = useRef<HTMLInputElement>(null);

  // Sync when the parent resets value to 0 / empty
  useEffect(() => {
    if (!value) setDisplay("");
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const cursorPos = e.target.selectionStart ?? 0;

    // Count commas before cursor in old display string
    const commasBefore = (display.slice(0, cursorPos).match(/,/g) ?? []).length;

    // Allow digits, one decimal point
    const clean = strip(raw).replace(/[^0-9.]/g, "");

    // Prevent multiple decimal points
    const parts = clean.split(".");
    const sanitized =
      parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : clean;

    // Limit decimal places to 2
    const finalClean =
      parts[1] !== undefined && parts[1].length > 2
        ? `${parts[0]}.${parts[1].slice(0, 2)}`
        : sanitized;

    const formatted = addCommas(finalClean);
    setDisplay(formatted);
    onChange(parseFloat(finalClean) || 0);

    // Restore cursor position accounting for added/removed commas
    requestAnimationFrame(() => {
      if (!ref.current) return;
      const newCommasBefore = (
        formatted.slice(0, cursorPos).match(/,/g) ?? []
      ).length;
      const diff = newCommasBefore - commasBefore;
      const newPos = Math.max(0, cursorPos + diff);
      ref.current.setSelectionRange(newPos, newPos);
    });
  }

  return (
    <input
      ref={ref}
      id={id}
      name={name}
      type="text"
      inputMode="decimal"
      value={display}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      required={required}
      min={min}
      autoComplete="off"
    />
  );
}
