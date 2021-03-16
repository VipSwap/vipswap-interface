import { TransactionResponse } from '@ethersproject/providers'
import { useActiveWeb3React } from '../../hooks'
import { useInviteContract } from '../../hooks/useContract'
import { calculateGasMargin } from '../../utils'
import { useTransactionAdder } from '../transactions/hooks'

export function useVipCallback(
  account: string | null | undefined
): {
  inviteCallback: () => Promise<string>
} {
  // get claim data for this account
  const { library, chainId } = useActiveWeb3React()
  // used for popup summary
  const addTransaction = useTransactionAdder()
  const contract = useInviteContract()
  // console.log('invite contract', contract)
  const inviteCallback = async function() {
    if (!account || !library || !chainId || !contract) return
    const args = [account]
    return contract.estimateGas['buildRefer'](...args, {}).then(estimatedGasLimit => {
      return contract
        .buildRefer(...args, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Invited ${account}`,
            claim: { recipient: account }
          })
          return response.hash
        })
    })
  }

  return { inviteCallback }
}
