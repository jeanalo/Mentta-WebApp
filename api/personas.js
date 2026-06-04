export default async function handler(req, res) {
  const { ARDUINO_CLIENT_ID, ARDUINO_CLIENT_SECRET, ARDUINO_THING_ID } = process.env

  if (!ARDUINO_CLIENT_ID || !ARDUINO_CLIENT_SECRET || !ARDUINO_THING_ID) {
    return res.status(500).json({ error: 'Arduino Cloud env vars not configured' })
  }

  try {
    // Step 1: get access token via client_credentials
    const tokenRes = await fetch('https://api2.arduino.cc/iot/v1/clients/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: ARDUINO_CLIENT_ID,
        client_secret: ARDUINO_CLIENT_SECRET,
        audience: 'https://api2.arduino.cc/iot',
      }),
    })

    if (!tokenRes.ok) {
      const text = await tokenRes.text()
      console.error('Arduino token error:', tokenRes.status, text)
      return res.status(502).json({ error: 'Arduino Cloud auth failed' })
    }

    const { access_token } = await tokenRes.json()

    // Step 2: fetch properties of the thing
    const propsRes = await fetch(
      `https://api2.arduino.cc/iot/v2/things/${ARDUINO_THING_ID}/properties`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    )

    if (!propsRes.ok) {
      const text = await propsRes.text()
      console.error('Arduino properties error:', propsRes.status, text)
      return res.status(502).json({ error: 'Failed to fetch Arduino Cloud properties' })
    }

    const properties = await propsRes.json()

    // Find the counter property by name (adjust regex if your property has a different name)
    const prop =
      properties.find(p => /count|counter|contador|personas?|persons?|people/i.test(p.name)) ??
      properties.find(p => typeof p.last_value === 'number')

    if (!prop) {
      return res.status(404).json({ error: 'No numeric counter property found on thing' })
    }

    const count = Math.max(0, Math.round(Number(prop.last_value) || 0))

    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=20')
    res.status(200).json({ count })
  } catch (err) {
    console.error('Arduino Cloud handler error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
