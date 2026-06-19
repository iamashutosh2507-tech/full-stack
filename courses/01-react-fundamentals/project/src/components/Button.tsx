import React from "react";

interface ButtonProps {
children: React.ReactNode;
onClick?: () => void;
type?: "button" | "submit";
variant?: "primary" | "secondary" | "danger";
disabled?: boolean;
id?: string;
}

export default function Button({
children,
onClick,
type = "button",
disabled = false,
id,
}: ButtonProps) {
return ( <button
   id={id}
   type={type}
   onClick={onClick}
   disabled={disabled}
 >
{children} </button>
);
}
