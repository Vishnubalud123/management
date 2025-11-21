import { useState, useCallback, useEffect } from 'react';

const useForm = (initialState = {}, validateFn = null, onSubmitFn = null) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Validate form whenever values change
  useEffect(() => {
    if (validateFn) {
      const validationErrors = validateFn(values);
      setErrors(validationErrors);
      setIsValid(Object.keys(validationErrors).length === 0);
    } else {
      setIsValid(true);
    }
  }, [values, validateFn]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    
    let finalValue;
    if (type === 'checkbox') {
      finalValue = checked;
    } else if (type === 'file') {
      finalValue = files[0];
    } else if (type === 'number') {
      finalValue = value === '' ? '' : Number(value);
    } else {
      finalValue = value;
    }

    setValues(prev => ({
      ...prev,
      [name]: finalValue
    }));

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);

  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const setMultipleValues = useCallback((newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  }, []);

  const setError = useCallback((name, message) => {
    setErrors(prev => ({
      ...prev,
      [name]: message
    }));
  }, []);

  const clearError = useCallback((name) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialState]);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    if (!onSubmitFn) return;

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate before submission
    if (validateFn) {
      const validationErrors = validateFn(values);
      setErrors(validationErrors);
      
      if (Object.keys(validationErrors).length > 0) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmitFn(values);
      resetForm();
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'An error occurred during submission'
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onSubmitFn, validateFn, resetForm]);

  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name] || '',
    onChange: handleChange,
    onBlur: handleBlur,
    error: touched[name] ? errors[name] : undefined
  }), [values, handleChange, handleBlur, touched, errors]);

  const hasErrors = Object.keys(errors).length > 0;
  const isTouched = Object.keys(touched).length > 0;

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    
    // Actions
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    setMultipleValues,
    setError,
    clearError,
    resetForm,
    
    // Helpers
    getFieldProps,
    hasErrors,
    isTouched
  };
};

export default useForm;