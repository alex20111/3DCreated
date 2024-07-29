export const environment = {
    production: false,
    PASS_REGEX: /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/ as RegExp
  };
  