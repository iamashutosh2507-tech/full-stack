import React from "react";

interface FormInputProps {
label: string;
id: string;
value: string;
onChange: (
e: React.ChangeEvent<HTMLInputElement>
) => void;
type?: string;
placeholder?: string;
error?: string;
}

export default function FormInput({
label,
id,
value,
onChange,
type = "text",
placeholder,
error,
}: FormInputProps) {
return ( <div> <label htmlFor={id}>
{label} </label>


  <input
    id={id}
    type={type}
    value={value}
    placeholder={placeholder}
    onChange={onChange}
  />

  {error && <p>{error}</p>}
</div>


);
}
