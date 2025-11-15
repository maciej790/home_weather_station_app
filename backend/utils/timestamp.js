function pad(n) {
  return n < 10 ? '0' + n : String(n);
}

function getLocalTimestampForMySQL() {
  const d = new Date();
  const YYYY = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const DD = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
}

module.exports = { getLocalTimestampForMySQL };
