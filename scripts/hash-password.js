#!/usr/bin/env node
// scripts/hash-password.js
// Run this script to generate a secure hash for your admin password
// Usage: node scripts/hash-password.js [password]
// Example: node scripts/hash-password.js "MySecurePassword123!"

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const readline = require('readline');

async function generatePasswordHash() {
  let password = process.argv[2];
  
  // If no password provided via command line, prompt for it
  if (!password) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    password = await new Promise((resolve) => {
      rl.question('Enter your desired admin password (will be hidden): ', (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }
  
  // Validate password strength
  if (!password || password.length < 8) {
    console.error('❌ Password must be at least 8 characters long');
    process.exit(1);
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    console.error('❌ Password must contain at least one lowercase letter, one uppercase letter, and one number');
    process.exit(1);
  }

  try {
    console.log('🔄 Generating secure hash...');
    
    // Generate salt and hash (12 rounds = good balance of security and performance)
    const saltRounds = 12;
    const hash = await bcrypt.hash(password, saltRounds);
    
    // Generate a secure JWT secret
    const jwtSecret = crypto.randomBytes(64).toString('hex');
    
    console.log('\n' + '='.repeat(60));
    console.log('🔐 SECURE ADMIN AUTHENTICATION SETUP');
    console.log('='.repeat(60));
    console.log('\n📝 Add these to your .env.local file:\n');
    
    console.log('# Secure admin authentication');
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log(`JWT_SECRET=${jwtSecret}`);
    console.log('\n# Optional: Remove development fallback (recommended for production)');
    console.log('NODE_ENV=production');
    
    console.log('\n' + '⚠️'.repeat(20));
    console.log('🚨 SECURITY IMPORTANT:');
    console.log('1. ❌ Remove any hardcoded passwords from your code');
    console.log('2. ❌ Never commit these values to version control');
    console.log('3. ✅ Store these securely in your production environment');
    console.log('4. ✅ Consider using a password manager or secrets management service');
    console.log('5. ✅ Regularly rotate your JWT secret and admin password');
    console.log('⚠️'.repeat(20));
    
    console.log('\n✅ Password hash generated successfully!');
    console.log(`📊 Hash strength: ${saltRounds} rounds`);
    console.log('🗑️  Remember to clear your terminal history!\n');
    
    // Additional security recommendations
    console.log('📋 Additional Security Recommendations:');
    console.log('• Enable 2FA if your hosting platform supports it');
    console.log('• Use HTTPS in production (SSL/TLS certificate)');
    console.log('• Consider IP whitelisting for admin access');
    console.log('• Monitor login attempts in your application logs');
    console.log('• Set up alerts for failed login attempts\n');
    
  } catch (error) {
    console.error('❌ Error generating hash:', error.message);
    process.exit(1);
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\n\n🛑 Process interrupted. Exiting...');
  process.exit(0);
});

generatePasswordHash().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});