export function generateValidationUrl(results, user) {
  const params = new URLSearchParams({
    wpm: String(results.netWpm ?? 0),
    acc: String(results.accuracy ?? 0),
    con: String(results.consistency ?? 0),
    user: user?.email ?? 'guest',
    ts: results.timestamp ?? '',
  });

  const base =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'https://quickdoc.test';

  return `${base}/verify?${params.toString()}`;
}
