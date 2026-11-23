#!/bin/bash
# Lighthouse (mobile) on the reference sites. Usage: ./lh-compare.sh
cd "$(dirname "$0")"
for s in thoughtworks=https://www.thoughtworks.com/ netguru=https://www.netguru.com/ globant=https://www.globant.com/ codal=https://codal.com/ fueled=https://fueled.com/ simform=https://www.simform.com/ geekyants=https://geekyants.com/ appinventiv=https://appinventiv.com/ tataelxsi=https://www.tataelxsi.com/ linear=https://linear.app/ vercel=https://vercel.com/ stripe=https://stripe.com/; do
  n=${s%%=*}; u=${s#*=}
  CHROME_PATH=/usr/bin/google-chrome timeout 180 ./node_modules/.bin/lighthouse "$u" --quiet --chrome-flags="--headless=new --no-sandbox" --output=json --output-path=out/lh-ref/$n.json >/dev/null 2>&1 || echo "fail $n"
done
