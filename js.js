const passwordInput = document.getElementById('password');
const strengthText = document.getElementById('strength');
const strengthMeter = document.getElementById('strength-meter');
const segments = strengthMeter.querySelectorAll('.strength-segment');
const indicators = {
  length: document.getElementById('length-indicator'),
  case: document.getElementById('case-indicator'),
  number: document.getElementById('number-indicator'),
  symbol: document.getElementById('symbol-indicator')
};

const requirements = {
  minLength: 8,
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSymbol: /[^A-Za-z0-9]/
};

function updateStrengthIndicator(password) {
  // Reset all indicators
  Object.values(indicators).forEach(indicator => {
    indicator.classList.remove('active');
    indicator.querySelector('i').className = 'fas fa-times';
  });
  
  // Check each requirement
  const checks = {
    length: password.length >= requirements.minLength,
    case: requirements.hasUpperCase.test(password) && requirements.hasLowerCase.test(password),
    number: requirements.hasNumber.test(password),
    symbol: requirements.hasSymbol.test(password)
  };

  // Update visual indicators
  Object.entries(checks).forEach(([key, passed], index) => {
    if (passed) {
      indicators[key].classList.add('active');
      indicators[key].querySelector('i').className = 'fas fa-check';
      segments[index].style.background = getStrengthColor(Object.values(checks).filter(Boolean).length);
    } else {
      segments[index].style.background = '#e2e8f0';
    }
  });

  // Update strength text and overall strength
  const strength = calculateStrength(checks);
  updateStrengthText(strength);
}

function calculateStrength(checks) {
  const passedChecks = Object.values(checks).filter(Boolean).length;
  const totalChecks = Object.keys(checks).length;
  const percentage = (passedChecks / totalChecks) * 100;

  if (percentage === 100) return { level: 'Very Strong', color: '#10b981' };
  if (percentage >= 75) return { level: 'Strong', color: '#22c55e' };
  if (percentage >= 50) return { level: 'Medium', color: '#f59e0b' };
  if (percentage >= 25) return { level: 'Weak', color: '#ef4444' };
  return { level: 'Very Weak', color: '#dc2626' };
}

function getStrengthColor(activeSegments) {
  switch(activeSegments) {
    case 4: return '#10b981'; // Very Strong
    case 3: return '#22c55e'; // Strong
    case 2: return '#f59e0b'; // Medium
    case 1: return '#ef4444'; // Weak
    default: return '#e2e8f0'; // Very Weak
  }
}

function updateStrengthText(strength) {
  const icon = strength.level === 'Very Strong' ? 'fa-shield-alt' :
               strength.level === 'Strong' ? 'fa-lock' :
               strength.level === 'Medium' ? 'fa-lock-open' :
               'fa-exclamation-triangle';

  strengthText.innerHTML = `
    <i class="fas ${icon}"></i>
    <span>${strength.level}</span>
  `;
  strengthText.style.color = strength.color;
}

function validatePassword(password) {
  const errors = [];
  
  if (password.length < requirements.minLength) {
    errors.push(`Password must be at least ${requirements.minLength} characters long`);
  }
  if (!requirements.hasUpperCase.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!requirements.hasLowerCase.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!requirements.hasNumber.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!requirements.hasSymbol.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return errors;
}

passwordInput.addEventListener('input', function() {
  const password = this.value;
  updateStrengthIndicator(password);
  
  if (password.length > 0) {
    const errors = validatePassword(password);
    if (errors.length > 0) {
      // You can display these errors in a tooltip or separate div if needed
      console.log('Password requirements not met:', errors);
    }
  }
});
