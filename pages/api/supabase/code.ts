import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default async function code(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.N_CLIENT_REDIRECT_URL) {
    throw new Error('N_CLIENT_REDIRECT_URL env variable is not set');
  }

  const { query } = req;
  //console.log('query', query);

  const urlState = query.state;
  const urlCode = query['?code'];
  //console.log('urlState', urlState);
  //console.log('urlCode', urlCode);

  const supabase = createPagesServerClient(
    { req, res },
    {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY,
    }
  )

  if (typeof urlCode === 'string') {
    const userSession = await supabase.auth.exchangeCodeForSession(urlCode);
    const session = userSession.data.session;
    if (session !== null) {
      const expiresIn = session.expires_in;
      const refreshToken = session.refresh_token;
      const accessToken = session.access_token;

      const sessionCode = 'expires_in=' + expiresIn + '|' + 'refresh_token=' + refreshToken + '|' + 'access_token=' + accessToken;
  
      if (typeof urlState === 'string') {
        const redirectUrl = 'https://raycast.com/redirect?packageName=Extension' + '&' +
          new URLSearchParams({
            state: urlState,
            code: sessionCode,
          });
        res.redirect(redirectUrl);
      } else {
        console.error('urlState must be a string');
      }
    } else {
      throw new Error('Invalid urlCode. Please provide a valid string value.');
    }
  } else {
    throw new Error('Session was not created.');
  }

}
