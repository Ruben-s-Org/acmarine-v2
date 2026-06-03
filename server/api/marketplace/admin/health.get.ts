import { query } from '~~/server/db/client'
import { requireSuperAdmin } from '~~/server/utils/authz'

export default defineEventHandler(async (event) => {
  await requireSuperAdmin(event)

  const now = Math.floor(Date.now() / 1000)
  const sixtyDays = now + 60 * 86400

  const [brokerCounts, licenseSoon, licenseExpired, listingCounts, leadCounts, recentActivity] = await Promise.all([
    query<any>(event, `SELECT status, COUNT(*) AS n FROM brokers GROUP BY status`),
    query<any>(event, `SELECT id, subdomain, display_name, license_state, license_expires FROM brokers WHERE license_expires IS NOT NULL AND license_expires BETWEEN ? AND ? ORDER BY license_expires ASC`, [now, sixtyDays]),
    query<any>(event, `SELECT id, subdomain, display_name, license_state, license_expires FROM brokers WHERE license_expires IS NOT NULL AND license_expires < ? ORDER BY license_expires ASC`, [now]),
    query<any>(event, `SELECT status, COUNT(*) AS n FROM listings GROUP BY status`),
    query<any>(event, `SELECT status, COUNT(*) AS n FROM leads GROUP BY status`),
    query<any>(event, `SELECT id, broker_id, kind, email, created_at FROM auth_events ORDER BY created_at DESC LIMIT 25`)
  ])

  return {
    brokers: brokerCounts,
    listings: listingCounts,
    leads: leadCounts,
    license_alerts: { expiring_within_60_days: licenseSoon, expired: licenseExpired },
    recent_auth_events: recentActivity
  }
})
