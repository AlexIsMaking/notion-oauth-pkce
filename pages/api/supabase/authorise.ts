import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('authorising...')
  if (!process.env.S_PROXY_REDIRECT_URL) {
    throw new Error('S_PROXY_REDIRECT_URL env variable is not set');
  }

  if (!process.env.SUPABASE_URL) {
    throw new Error('SUPABASE_URL env variable is not set');
  }

  if (!process.env.SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_ANON_KEY env variable is not set');
  }

  const { query } = req;
  console.log('query: ' + JSON.stringify(query));

  // !! Needs to be updated to use S variables
  const N_ALLOWED_REDIRECT_URIS = process.env.N_REDIRECT_URIS!.split(', ');
  const proxyRedirectUri = (typeof query.redirect_uri === 'string' && N_ALLOWED_REDIRECT_URIS.includes(query.redirect_uri.toString()))
    ? process.env.S_PROXY_REDIRECT_URL
    : 'null';

  const supabase = createPagesServerClient(
    { req, res },
    {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY,
    }
  )

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'notion',
    options: {
      redirectTo: proxyRedirectUri + '?state=' + query.state?.toString() + '&' ?? 'undefined&',
    },
  })

  if (error) {
    res.json(JSON.stringify(error))
  }

  if (data.url !== null) {
    res.redirect(data.url);
  } else {
    res.send('The redirect URL is not available.');
  }
}
