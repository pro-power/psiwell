// app/api/auth/admin-login/route.js (Temporary fix)
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { password } = await request.json();
    
    console.log('🔍 API Debug:');
    console.log('- Password received:', password);
    console.log('- Environment hash length:', process.env.ADMIN_PASSWORD_HASH?.length);
    console.log('- Environment hash preview:', process.env.ADMIN_PASSWORD_HASH?.substring(0, 30));
    
    // TEMPORARY: Generate hash on the fly for testing
    console.log('🔧 Generating hash on the fly...');
    const tempHash = await bcrypt.hash("SandyMann2211", 12);
    console.log('- Generated hash length:', tempHash.length);
    console.log('- Generated hash preview:', tempHash.substring(0, 30));
    
    // Test with the generated hash
    const isValidPassword = await bcrypt.compare(password, tempHash);
    console.log('✅ Password comparison result:', isValidPassword);
    
    if (!isValidPassword) {
      // Also test with environment hash if it exists
      if (process.env.ADMIN_PASSWORD_HASH) {
        const envTest = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
        console.log('🔍 Environment hash test:', envTest);
      }
      
      console.log('❌ Invalid password provided');
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // Generate token
    const JWT_SECRET = process.env.JWT_SECRET || 'temporary-secret-for-testing';
    const token = jwt.sign(
      { admin: true, timestamp: Date.now() },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    
    console.log('✅ Login successful!');
    
    return NextResponse.json({
      success: true,
      token,
      expiresIn: 8 * 60 * 60,
      message: "Authentication successful",
      debug: {
        generatedHashLength: tempHash.length,
        envHashLength: process.env.ADMIN_PASSWORD_HASH?.length,
        newHashForEnv: tempHash
      }
    });
    
  } catch (error) {
    console.error("❌ Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}