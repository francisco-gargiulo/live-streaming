export function rateControl(limit, windowMs) {
  return function (req, res, next) {
    const now = Date.now();

    // Get or create the session
    const sessionData = req.session;
    const urlData = sessionData[req.url] || { calls: 0, timestamp: now };

    // Remove requests that are outside the sliding window
    while (urlData.calls > 0 && urlData.timestamp + windowMs < now) {
      urlData.calls--;
      urlData.timestamp += windowMs;
    }

    // Check the request count
    if (urlData.calls >= limit) {
      return res.status(429).send("Too Many Requests");
    }

    // Update the session data and call the next middleware
    urlData.calls++;
    sessionData[req.url] = urlData;
    next();
  };
}
