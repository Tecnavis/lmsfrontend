import { useState } from "react";

type FormValues = {
  [key: string]: any; // You can replace `any` with a more specific type if you know the shape of your form values
};

export const useForm = (initialValues: FormValues) => {
  const [values, setValues] = useState<FormValues>(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  return [values, handleChange, setValues] as const;
};
