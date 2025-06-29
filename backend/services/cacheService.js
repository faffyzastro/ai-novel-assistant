const NodeCache = require('node-cache');
const crypto = require('crypto');

// 10 minutes TTL by default
const cache = new NodeCache({ stdTTL: 600 });

// Hash the prompt to use as a cache key
function hashKey(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function getCache(prompt) {
  return cache.get(hashKey(prompt));
}

function setCache(prompt, value) {
  cache.set(hashKey(prompt), value);
}

function delCache(prompt) {
  cache.del(hashKey(prompt));
}

module.exports = { getCache, setCache, delCache }; 