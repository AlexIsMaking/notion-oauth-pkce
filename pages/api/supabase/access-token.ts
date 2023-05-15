import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function accessToken(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!process.env.S_PROXY_REDIRECT_URL) {
    throw new Error('N_PROXY_REDIRECT_URL env variable is not set');
  }

  console.log('requesting access token...')

  const { body } = req;
  const codeVerifier = body.codeVerifier;
  console.log('codeVerifier: ', codeVerifier);
  const code = body.code
  console.log('code: ', code);

  const supabase = createServerSupabaseClient(
    { req, res },
    {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY,
    }
  )

  if (typeof code === 'string') {
    // exchange the auth code for user session
    const response = await supabase.auth.exchangeCodeForSession(code)
    console.log('response: ', response)
    res.json(response);
  }
}
