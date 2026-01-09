export function calculateOdds(yesShares: number, noShares: number) {
  const total = yesShares + noShares
  return {
    yes: noShares / total,
    no: yesShares / total,
  }
}

export function calculateBuyShares(
  amount: number,
  buyYes: boolean,
  yesShares: number,
  noShares: number
) {
  const k = yesShares * noShares

  if (buyYes) {
    const newNoShares = noShares + amount
    const newYesShares = k / newNoShares
    const sharesReceived = yesShares - newYesShares
    return { sharesReceived, newYesShares, newNoShares }
  } else {
    const newYesShares = yesShares + amount
    const newNoShares = k / newYesShares
    const sharesReceived = noShares - newNoShares
    return { sharesReceived, newYesShares, newNoShares }
  }
}

export function calculateSellShares(
  shares: number,
  sellYes: boolean,
  yesShares: number,
  noShares: number
) {
  const k = yesShares * noShares

  if (sellYes) {
    const newYesShares = yesShares + shares
    const newNoShares = k / newYesShares
    const amountReceived = noShares - newNoShares
    return { amountReceived, newYesShares, newNoShares }
  } else {
    const newNoShares = noShares + shares
    const newYesShares = k / newNoShares
    const amountReceived = yesShares - newYesShares
    return { amountReceived, newYesShares, newNoShares }
  }
}
