import type { NextApiRequest, NextApiResponse } from 'next';

export default function code(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.N_CLIENT_REDIRECT_URL) {
    throw new Error('N_CLIENT_REDIRECT_URL env variable is not set');
  }

  const { query } = req;

  const [state, redirectUri] = query.state?.toString().split('|') ?? ['undefined', 'undefined'];

  const redirectUrl = redirectUri + '&' +
    new URLSearchParams({
      code: query.code?.toString() ?? 'undefined',
      state,
    });

  res.redirect(redirectUrl);
}
