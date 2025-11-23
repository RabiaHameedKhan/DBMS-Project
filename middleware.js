// /src/middleware.js
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  // 1. Create a response object to hold the updated cookies
  const res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // 2. Initialize the Supabase client with the request and response objects
  // This allows the client to read cookies from req and write updated cookies to res.
  const supabase = createMiddlewareClient({ req, res });

  // 3. CRUCIAL STEP: Refresh the session and update the cookies.
  // This ensures the API route (createRouteHandlerClient) receives a valid session.
  await supabase.auth.getSession();
  
  // 4. Return the response with the potentially updated cookies
  return res;
}

// 5. Optionally, restrict the middleware to only run on necessary paths
export const config = {
 matcher: [
    // Matches all paths except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico).*)', 
  ],
};