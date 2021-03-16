import React, { useEffect, useState } from 'react'
import Modal from '../Modal'
import { AutoColumn, ColumnCenter } from '../Column'
import styled from 'styled-components'
import { DataCard, CardSection, Break } from '../earn/styled'
import { RowBetween } from '../Row'
import { TYPE, ExternalLink, CloseIcon, CustomLightSpinner, UniTokenAnimated } from '../../theme'
import { ButtonPrimary } from '../Button'
import { useGetRewardsCallback } from '../../state/claim/hooks'
import tokenLogo from '../../assets/images/logo_800x800.png'
import Circle from '../../assets/images/blue-loader.svg'
import { Text } from 'rebass'
// import AddressInputPanel from '../AddressInputPanel'
// import useENS from '../../hooks/useENS'
import { useActiveWeb3React } from '../../hooks'
import { isAddress } from 'ethers/lib/utils'
import Confetti from '../Confetti'
import { CardNoise, CardBGImage, CardBGImageSmaller } from '../earn/styled'
import { useIsTransactionPending } from '../../state/transactions/hooks'
import { TokenAmount } from '@uniswap/sdk'
import { getEtherscanLink, shortenAddress } from '../../utils'
import { useUserQueryRewards, useUserRewardTime } from '../../hooks/useVipSwap'
import { Countdown } from './Countdown'
import { useTranslation } from 'react-i18next'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ModalUpper = styled(DataCard)`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: #ea9f10;
  border-radius: 5px;
  border-bottom-left-radius: unset;
  border-bottom-right-radius: unset;
`

const ConfirmOrLoadingWrapper = styled.div<{ activeBG: boolean }>`
  width: 100%;
  padding: 24px;
  position: relative;
  background: ${({ activeBG }) =>
    activeBG &&
    'radial-gradient(76.02% 75.41% at 1.84% 0%, rgba(255, 0, 122, 0.2) 0%, rgba(252, 248, 244, 1) 100%), #FFFFFF;'};
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

const DataRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
flex-direction: column;
`};
`

export default function AddressClaimModal({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) {
  const { account, chainId } = useActiveWeb3React()

  const { t } = useTranslation()
  // state for smart contract input
  // const [typed, setTyped] = useState('')
  // function handleRecipientType(val: string) {
  //   setTyped(val)
  // }

  // monitor for third party recipient of claim
  // const { address: parsedAddress } = useENS(typed)

  // used for UI loading states
  const [attempting, setAttempting] = useState<boolean>(false)

  const [canClaim, setCanClaim] = useState(false)

  // monitor the status of the claim from contracts and txns
  const { rewardCallback } = useGetRewardsCallback(account)
  // const unclaimedAmount: TokenAmount | undefined = useUserUnclaimedAmount(parsedAddress)
  const unclaimedAmount: TokenAmount | undefined = useUserQueryRewards(account)
  const time = useUserRewardTime()
  const now = (new Date().getTime() / 1000).toFixed(0)
  // console.log('reward time, now', time ? time.toString() : 0, now, canClaim, !Number(unclaimedAmount?.toFixed(0)))

  // console.log('time', time ? time.toString() : '0000')
  useEffect(() => {
    if (now > time) {
      setCanClaim(true)
    }
  }, [time, now])

  // check if the user has something available
  // const hasAvailableClaim = useUserHasAvailableClaim(parsedAddress)

  const [hash, setHash] = useState<string | undefined>()

  // monitor the status of the claim from contracts and txns
  const claimPending = useIsTransactionPending(hash ?? '')
  const claimConfirmed = hash && !claimPending

  // use the hash to monitor this txn

  function onClaim() {
    setAttempting(true)
    rewardCallback()
      .then(hash => {
        setHash(hash)
      })
      // reset modal and log error
      .catch(error => {
        setAttempting(false)
        console.log(error)
      })
  }

  function wrappedOnDismiss() {
    setAttempting(false)
    setHash(undefined)
    // setTyped('')
    onDismiss()
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
      <Confetti start={Boolean(isOpen && claimConfirmed && attempting)} />
      {!attempting && (
        <ContentWrapper gap="lg">
          <ModalUpper>
            <CardBGImage />
            <CardSection gap="md">
              <RowBetween>
                <TYPE.white fontWeight={500}>{t('claimVIP')}</TYPE.white>
                <CloseIcon onClick={wrappedOnDismiss} style={{ zIndex: 99 }} stroke="white" />
              </RowBetween>
              <TYPE.white fontWeight={700} fontSize={36}>
                {unclaimedAmount?.toFixed(2, { groupSeparator: ',' } ?? '-')} VIP
              </TYPE.white>
              <DataRow style={{ alignItems: 'baseline' }}>
                <Countdown exactEnd={new Date(time ? time * 1000 : 0)} />
              </DataRow>
            </CardSection>
            <Break />
          </ModalUpper>
          <AutoColumn gap="md" style={{ padding: '1rem', paddingTop: '0' }} justify="center">
            {/*<TYPE.subHeader fontWeight={500}>*/}
            {/*  Enter an address to trigger a VIP claim. If the address has any claimable VIP it will be sent to them on*/}
            {/*  submission.*/}
            {/*</TYPE.subHeader>*/}
            {/*<AddressInputPanel value={typed} onChange={handleRecipientType} />*/}
            {/*{parsedAddress && !unclaimedAmount && <TYPE.error error={true}>Address has no available claim</TYPE.error>}*/}
            <ButtonPrimary
              disabled={!isAddress(account ?? '') || !canClaim}
              padding="16px 16px"
              width="100%"
              borderRadius="12px"
              mt="1rem"
              onClick={onClaim}
            >
              {t('claimVIP')}
            </ButtonPrimary>
          </AutoColumn>
        </ContentWrapper>
      )}
      {(attempting || claimConfirmed) && (
        <ConfirmOrLoadingWrapper activeBG={true}>
          <CardNoise />
          <CardBGImageSmaller desaturate />
          <RowBetween>
            <div />
            <CloseIcon onClick={wrappedOnDismiss} style={{ zIndex: 99 }} stroke="black" />
          </RowBetween>
          <ConfirmedIcon>
            {!claimConfirmed ? (
              <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
            ) : (
              <UniTokenAnimated width="72px" src={tokenLogo} />
            )}
          </ConfirmedIcon>
          <AutoColumn gap="100px" justify={'center'}>
            <AutoColumn gap="12px" justify={'center'}>
              <TYPE.largeHeader fontWeight={600} color="black">
                {claimConfirmed ? 'Claimed' : 'Claiming'}
              </TYPE.largeHeader>
              {!claimConfirmed && (
                <Text fontSize={36} color={'#ea9f10'} fontWeight={800}>
                  {unclaimedAmount?.toFixed(0, { groupSeparator: ',' } ?? '-')} VIP
                </Text>
              )}
              {account && (
                <TYPE.largeHeader fontWeight={600} color="black">
                  for {shortenAddress(account)}
                </TYPE.largeHeader>
              )}
            </AutoColumn>
            {claimConfirmed && (
              <>
                <TYPE.subHeader fontWeight={500} color="black">
                  <span role="img" aria-label="party-hat">
                    🎉{' '}
                  </span>
                  Welcome to team VipSwap :){' '}
                  <span role="img" aria-label="party-hat">
                    🎉
                  </span>
                </TYPE.subHeader>
              </>
            )}
            {attempting && !hash && (
              <TYPE.subHeader color="black">Confirm this transaction in your wallet</TYPE.subHeader>
            )}
            {attempting && hash && !claimConfirmed && chainId && hash && (
              <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')} style={{ zIndex: 99 }}>
                View transaction on Bsc Chain
              </ExternalLink>
            )}
          </AutoColumn>
        </ConfirmOrLoadingWrapper>
      )}
    </Modal>
  )
}
