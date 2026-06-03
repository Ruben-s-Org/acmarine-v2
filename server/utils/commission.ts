// Commission calculator. Inputs in basis points (1 bp = 0.01%).
// House take is small (e.g. 1000 bps = 10%); broker net is the large remainder.
// Co-broke split (e.g. 5000 bps) is the percentage of gross retained by the
// listing side before the house take is applied.

export interface CommissionInputs {
  grossAmount: number      // total agreed sale price (in smallest currency unit, e.g. dollars)
  commissionRateBps?: number // total brokerage commission, default 1000 (10%)
  coBrokeSplitBps?: number   // listing broker's share before house take, default 5000 (50/50)
  houseTakeBps?: number      // platform cut, default 1000 (10%)
}

export interface CommissionResult {
  grossAmount: number
  totalCommission: number
  listingSideCommission: number
  sellingSideCommission: number
  houseTake: number
  brokerNet: number
  inputs: Required<CommissionInputs>
}

function bpsApply(amount: number, bps: number) {
  return Math.round((amount * bps) / 10000)
}

export function calculateCommission(input: CommissionInputs) {
  const commissionRateBps = input.commissionRateBps ?? 1000
  const coBrokeSplitBps = input.coBrokeSplitBps ?? 5000
  const houseTakeBps = input.houseTakeBps ?? 1000

  const totalCommission = bpsApply(input.grossAmount, commissionRateBps)
  const listingSideCommission = bpsApply(totalCommission, coBrokeSplitBps)
  const sellingSideCommission = totalCommission - listingSideCommission
  const houseTake = bpsApply(listingSideCommission, houseTakeBps)
  const brokerNet = listingSideCommission - houseTake

  return {
    grossAmount: input.grossAmount,
    totalCommission,
    listingSideCommission,
    sellingSideCommission,
    houseTake,
    brokerNet,
    inputs: { grossAmount: input.grossAmount, commissionRateBps, coBrokeSplitBps, houseTakeBps }
  }
}
