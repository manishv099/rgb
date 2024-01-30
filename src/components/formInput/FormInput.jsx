import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export const FormInput = ({label, changeValue, addNumber, setNumber, errors, ...field}) => {
  return (
    <div className='mb-3'>
      <label htmlFor={field.name}>{label}</label>
      {
          label === 'Phone' ? 
          <PhoneInput defaultCountry="IN" placeholder="Enter phone number" onBlur={addNumber} onChange={setNumber} />
          :
          <>
            <input type={field.type} {...field} className='form-control' id={field.name} onChange={changeValue}  />
          </>
        }
    </div>
  )
}
