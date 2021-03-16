import { TokenAmount } from '@uniswap/sdk'
import React from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'
// import tokenLogo from '../../assets/images/token-logo.png'
import tokenLogo from '../../assets/svg/swapLogoBlack.png'
import { VIPSwap } from '../../constants'
// import { useTotalSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
// import { useMerkleDistributorContract } from '../../hooks/useContract'
// import useCurrentBlockTimestamp from '../../hooks/useCurrentBlockTimestamp'
// import { useTotalUniEarned } from '../../state/stake/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
// import { ExternalLink, StyledInternalLink, TYPE, UniTokenAnimated } from '../../theme'
import { TYPE, UniTokenAnimated } from '../../theme'
// import { computeUniCirculation } from '../../utils/computeUniCirculation'
// import useUSDCPrice from '../../utils/useUSDCPrice'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { Break, CardBGImage, CardNoise, CardSection, DataCard } from '../earn/styled'
import { useTranslation } from 'react-i18next'
import { useUserQueryRewards } from '../../hooks/useVipSwap'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ModalUpper = styled(DataCard)`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: #ea9f10;
  padding: 0.5rem;
`

const StyledClose = styled(X)`
  position: absolute;
  right: 16px;
  top: 16px;

  :hover {
    cursor: pointer;
  }
`

/**
 * Content for balance stats modal
 */
export default function UniBalanceContent({ setShowUniBalanceModal }: { setShowUniBalanceModal: any }) {
  const { account, chainId } = useActiveWeb3React()
  const vip = chainId ? VIPSwap[chainId] : undefined

  // const total = useAggregateUniBalance()
  const uniBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, vip)
  // const uniToClaim: TokenAmount | undefined = useTotalUniEarned()
  const uniToClaim: TokenAmount | undefined = useUserQueryRewards(account)

  //引入多语言
  const { t } = useTranslation()

  return (
    <ContentWrapper gap="lg">
      <ModalUpper>
        <CardBGImage />
        <CardNoise />
        <CardSection gap="md">
          <RowBetween>
            <TYPE.white color="white">{t('YourVipBreakdown')}</TYPE.white>
            <StyledClose stroke="white" onClick={() => setShowUniBalanceModal(false)} />
          </RowBetween>
        </CardSection>
        <Break />
        {account && (
          <>
            <CardSection gap="sm">
              <AutoColumn gap="md" justify="center">
                <UniTokenAnimated width="48px" src={tokenLogo} />{' '}
                <TYPE.white fontSize={48} fontWeight={600} color="white">
                  {uniBalance?.toFixed(2, { groupSeparator: ',' })}
                </TYPE.white>
              </AutoColumn>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white color="white">Balance:</TYPE.white>
                  <TYPE.white color="white">{uniBalance?.toFixed(2, { groupSeparator: ',' })}</TYPE.white>
                </RowBetween>
                <RowBetween>
                  <TYPE.white color="white">Unclaimed:</TYPE.white>
                  <TYPE.white color="white">
                    {uniToClaim?.toFixed(4, { groupSeparator: ',' })}{' '}
                    {/*{uniToClaim && uniToClaim.greaterThan('0') && (*/}
                    {/*  <StyledInternalLink onClick={() => setShowUniBalanceModal(false)} to="/uni">*/}
                    {/*    (claim)*/}
                    {/*  </StyledInternalLink>*/}
                    {/*)}*/}
                  </TYPE.white>
                </RowBetween>
              </AutoColumn>
            </CardSection>
            <Break />
          </>
        )}
        {/*<CardSection gap="sm">*/}
        {/*  <AutoColumn gap="md">*/}
        {/*    <RowBetween>*/}
        {/*      <TYPE.white color="white">{t('VIP price')}:</TYPE.white>*/}
        {/*      <TYPE.white color="white">${uniPrice?.toFixed(2) ?? '-'}</TYPE.white>*/}
        {/*    </RowBetween>*/}
        {/*    <RowBetween>*/}
        {/*      <TYPE.white color="white">{t('VIP in circulation')}:</TYPE.white>*/}
        {/*      <TYPE.white color="white">{circulation?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>*/}
        {/*    </RowBetween>*/}
        {/*    <RowBetween>*/}
        {/*      <TYPE.white color="white">{t('Total Supply')}</TYPE.white>*/}
        {/*      <TYPE.white color="white">{totalSupply?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>*/}
        {/*    </RowBetween>*/}
        {/*    /!*{uni && uni.chainId === ChainId.MAINNET ? (*!/*/}
        {/*    /!*  <ExternalLink href={`https://uniswap.info/token/${uni.address}`}>View UNI Analytics</ExternalLink>*!/*/}
        {/*    /!*) : null}*!/*/}
        {/*  </AutoColumn>*/}
        {/*</CardSection>*/}
      </ModalUpper>
    </ContentWrapper>
  )
}
