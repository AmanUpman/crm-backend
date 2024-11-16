exports.validateCustomerData = (data, isUpdate = false) => {
    const errors = [];
  
    if (!isUpdate || (isUpdate && data.name)) {
      if (!data.name || typeof data.name !== 'string') {
        errors.push('Invalid name');
      }
    }
  
    if (!isUpdate || (isUpdate && data.email)) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Invalid email');
      }
    }
  
    // Add more validations as needed
    return errors;
  };
  