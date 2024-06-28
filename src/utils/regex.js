const REGEX = {
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,50}$/,
    fullName: /^[a-zA-Z\s']+$/,
    phone: /^\d{10}$/
};

module.exports = REGEX;
