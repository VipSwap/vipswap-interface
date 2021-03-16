// check if the user has been invited this address
import { useSingleCallResult } from '../state/multicall/hooks'
import { useInviteContract } from './useContract'
import { isAddress } from '../utils'
// import BigNumber from 'bignumber.js'
import { JSBI, TokenAmount } from '@uniswap/sdk'
import { useActiveWeb3React } from './index'
import { VIPSwap } from '../constants'

export function useUserInvited(account: string | null | undefined): string {
  const parsedAddress = isAddress(account)
  const contract = useInviteContract()
  const invited = useSingleCallResult(contract, 'queryRefer', [
    account && parsedAddress ? account : '0x0000000000000000000000000000000000000000'
  ])
  // console.log('invited address', invited)
  return invited?.result?.[0]
}

export function useUserRewardTime() {
  const contract = useInviteContract()
  const time = useSingleCallResult(contract, 'rewardTime', [])
  return time?.result?.[0]
}

export function useUserQueryRewards(account: string | null | undefined): TokenAmount | undefined {
  const { chainId } = useActiveWeb3React()
  const parsedAddress = isAddress(account)
  const contract = useInviteContract()
  const value = useSingleCallResult(contract, 'queryRewards', [
    account && parsedAddress ? account : '0x0000000000000000000000000000000000000000'
  ])
  // console.log('useUserQueryRewards', value, value?.result?.[0].toString())
  // const reward = new BigNumber(value?.result?.[0].toString()).div(new BigNumber(Math.pow(10, 18)))
  const vip = chainId ? VIPSwap[chainId] : undefined
  if (!vip) return undefined
  return new TokenAmount(vip, JSBI.BigInt(value?.result?.[0] ?? 0))
}

export function useUserRefereeN(account: string | null | undefined): string {
  const parsedAddress = isAddress(account)
  const contract = useInviteContract()
  const value = useSingleCallResult(contract, 'refereeN', [
    account && parsedAddress ? account : '0x0000000000000000000000000000000000000000'
  ])
  // console.log('invited address', value)
  return value?.result?.[0]
}

export function useUserReferee2N(account: string | null | undefined): string {
  const parsedAddress = isAddress(account)
  const contract = useInviteContract()
  const value = useSingleCallResult(contract, 'referee2N', [
    account && parsedAddress ? account : '0x0000000000000000000000000000000000000000'
  ])
  // console.log('referee2N', value)
  return value?.result?.[0]
}

interface Reward {
  ncicle: string
  ncircle: string
}

export function useUserUnclaimReward(account: string | null | undefined): Reward {
  const parsedAddress = isAddress(account)
  const contract = useInviteContract()
  const value = useSingleCallResult(contract, 'earned', [
    account && parsedAddress ? account : '0x0000000000000000000000000000000000000000'
  ])
  // console.log('useUserUnclaimReward', value)
  return value?.result?.[0]
}

export function useUserClaimedReward(account: string | null | undefined): Reward {
  const parsedAddress = isAddress(account)
  const contract = useInviteContract()
  const value = useSingleCallResult(contract, 'paid', [
    account && parsedAddress ? account : '0x0000000000000000000000000000000000000000'
  ])
  // console.log('useUserClaimedReward', value)
  return value?.result?.[0]
}
