export function rateControl(limit, windowMs) {
  return function (req, res, next) {
    const now = Date.now();

    const url = new URL(req.url);

    // Get or create the session
    const urlData = req.session[url.pathname] || { calls: 0, timestamp: now };

    // Remove requests that are outside the sliding window
    if (urlData.calls > 0 && urlData.timestamp + windowMs < now) {
      urlData.calls = 0;
      urlData.timestamp = now;
    }

    // Check the request count
    if (urlData.calls >= limit) {
      return res.sendStatus(429);
    }

    // Update the session data and call the next middleware
    urlData.calls++;

    req.session[url.pathname] = urlData;

    next();
  };
}
