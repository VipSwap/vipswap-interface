import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Pair, JSBI } from '@uniswap/sdk'
import { Link } from 'react-router-dom'
// import { SwapPoolTabs } from '../../components/NavigationTabs'

import FullPositionCard from '../../components/PositionCard'
import { useUserHasLiquidityInAllTokens } from '../../data/V1'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { StyledInternalLink, TYPE } from '../../theme'
import { Text } from 'rebass'
import Card from '../../components/Card'
import { RowBetween } from '../../components/Row'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { Dots } from '../../components/swap/styleds'
import { CardSection, DataCard, CardBGImage } from '../../components/earn/styled'
import { useStakingInfo } from '../../state/stake/hooks'
import { BIG_INT_ZERO } from '../../constants'
import { useTranslation } from 'react-i18next'

const PageWrapper = styled(AutoColumn)`
  max-width: 630px;
  width: 100%;
  background-color: #fff;
  border-radius: 50px;
  overflow: hidden;
`

const VoteCard = styled(DataCard)`
  background: none;
  overflow: hidden;
`

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: 100%;
  border-radius: 35px;
  font-size: 18px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  `};
`

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  width: 100%;
  border-radius: 35px;
  font-size: 20px;
  color: #120902;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  `};
`

const EmptyProposals = styled.div`
  // border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  // border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 16px;
`

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const hasV1Liquidity = useUserHasLiquidityInAllTokens()

  // show liquidity even if its deposited in rewards contract
  const stakingInfo = useStakingInfo()
  const stakingInfosWithBalance = stakingInfo?.filter(pool => JSBI.greaterThan(pool.stakedAmount.raw, BIG_INT_ZERO))
  const stakingPairs = usePairs(stakingInfosWithBalance?.map(stakingInfo => stakingInfo.tokens))

  // remove any pairs that also are included in pairs with stake in mining pool
  const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter(v2Pair => {
    return (
      stakingPairs
        ?.map(stakingPair => stakingPair[1])
        .filter(stakingPair => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length === 0
    )
  })

  //引入多语言
  const { t } = useTranslation()

  return (
    <>
      <PageWrapper>
        {/*<SwapPoolTabs active={'pool'} />*/}
        <VoteCard style={{ borderRadius: '0px' }}>
          <CardBGImage />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontSize={20} fontWeight={600} style={{ width: '100%' }}>
                  {t('Liquidity provider rewards')}
                </TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={16}>{t('Liquidity provider rewards tip')}</TYPE.white>
              </RowBetween>
            </AutoColumn>
          </CardSection>
        </VoteCard>

        <AutoColumn gap="lg" justify="center">
          <AutoColumn
            gap="lg"
            style={{
              width: '100%',
              padding: '30px'
            }}
          >
            <AutoColumn gap="lg" style={{ width: '100%' }}>
              <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'center', color: '#666' }}>
                - {t('Your liquidity')} -
              </TYPE.mediumHeader>
            </AutoColumn>
            <AutoColumn gap="lg" style={{ width: '100%' }}>
              <ResponsiveButtonSecondary as={Link} padding="16px 18px" to="/create/ETH">
                {t('Create a pair')}
              </ResponsiveButtonSecondary>
            </AutoColumn>
            <AutoColumn gap="lg" style={{ width: '100%' }}>
              <ResponsiveButtonPrimary id="join-pool-button" as={Link} padding="16px 18px" to="/add/ETH">
                <Text fontWeight={500} fontSize={20}>
                  {t('Add Liquidity')}
                </Text>
              </ResponsiveButtonPrimary>
            </AutoColumn>

            {!account ? (
              <Card padding="40px">
                <TYPE.body color={theme.text3} textAlign="center">
                  {t('ViewLiquidityTip')}
                </TYPE.body>
              </Card>
            ) : v2IsLoading ? (
              <EmptyProposals>
                <TYPE.body color={theme.text3} textAlign="center">
                  <Dots>Loading</Dots>
                </TYPE.body>
              </EmptyProposals>
            ) : allV2PairsWithLiquidity?.length > 0 || stakingPairs?.length > 0 ? (
              <>
                <ButtonSecondary>
                  <RowBetween>
                    {/*<ExternalLink href={'https://uniswap.info/account/' + account}>*/}
                    {/*  {t('账户分析和应计费用')}*/}
                    {/*</ExternalLink>*/}
                    <span> ↗</span>
                  </RowBetween>
                </ButtonSecondary>
                {v2PairsWithoutStakedAmount.map(v2Pair => (
                  <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                ))}
                {stakingPairs.map(
                  (stakingPair, i) =>
                    stakingPair[1] && ( // skip pairs that arent loaded
                      <FullPositionCard
                        key={stakingInfosWithBalance[i].stakingRewardAddress}
                        pair={stakingPair[1]}
                        stakedBalance={stakingInfosWithBalance[i].stakedAmount}
                      />
                    )
                )}
              </>
            ) : (
              <EmptyProposals>
                <TYPE.body color={theme.text3} textAlign="center">
                  {t('NoLiquidity')}
                </TYPE.body>
              </EmptyProposals>
            )}

            <AutoColumn justify={'flex-start'} gap="md">
              <Text textAlign="left" fontSize={14} style={{ padding: '.5rem 0 .5rem 0' }}>
                {hasV1Liquidity ? t('MigrateImportTip1') : t('MigrateImportTip2')}{' '}
                <StyledInternalLink id="import-pool-link" to={hasV1Liquidity ? '/migrate/v1' : '/find'}>
                  {hasV1Liquidity ? t('Migrate now') : t('Import it')}
                </StyledInternalLink>
              </Text>
            </AutoColumn>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}
