import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { RowBetween } from '../../components/Row'
import { getAirdropUserInfoByPost } from '../../state/airdrop/hooks'
import { getAirdropRewardByGet } from '../../state/airdrop/hooks'
import { useWeb3React } from '@web3-react/core'
import AirdropPoolDetails from '../../components/AirdropPoolDetails'
import { useToggleModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/actions'

export const Container = styled.div`
  box-sizing: content-box;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `};
`
const AirdropBox = styled.div`
  max-width: 630px;
  position: relative;
  padding: 50px;
  margin-bottom: 20px;
  box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.05);
  border-radius: 50px;
  background-color: #fff;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    max-width: 100%;
    padding:15px;
  `};
`
const AirdropTitle = styled.div`
  width: 100%;
  font-size: 24px;
  color: #120902;
  font-weight: 700;
  text-align: left;
  line-height: 1.5;
  margin-bottom: 2rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 15px 15px 0;
  `};
`
const AirdropContent = styled.div`
  width: 100%;
  border-radius: 20px;
  padding: 20px;
  background: #fcf8f4;
  margin-top: 2rem;
`
const ContentItemRow = styled.div`
  position: relative;
`
const ContentItemLabel = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #120902;
  line-height: 2;
  margin-right: 10px;
`
const ContentItemValue = styled.span`
  font-size: 16px;
  color: #120902;
  line-height: 2;
  white-space: pre-wrap;
`
const AirdropBtn = styled.div<{ btnType?: string }>`
  width: 100%;
  height: 60px;
  margin: auto;
  margin-top: 20px;
  text-align: center;
  line-height: 60px;
  font-size: 20px;
  background-color: ${({ btnType }) => (btnType === 'disable' ? '#eee' : '#EA9F10')};
  border-radius: 30px;
  color: ${({ btnType }) => (btnType === 'disable' ? '#999' : '#fff')};
  :hover {
    cursor: pointer;
  }
`

const MyAirdropBox = styled.div`
  width: 100%;
  padding: 15px 0;
  border-radius: 15px;
  margin-top: 20px;
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  `};
`
const LeftCard = styled.div`
  width: 255px;
  margin: 5px;
  float: left;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    margin: 5px 0;
  `};
`
const RightCard = styled.div`
  width: 520px;
  margin: 5px;
  float: left;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    margin: 5px 0;
  `};
`
const CardTitle = styled.div`
  width: 100%;
  line-height: 1;
  margin-bottom: 15px;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
`
const RightCardTitle = styled.div`
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  border-right: 1px solid #120902;
  color: #120902;
  width: 160px;
  height: 80px;
  line-height: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    border: none;
    width: 100%;
    height: auto;
    padding: 15px;
  `};
`
const CardBgBase = styled.div`
  width: 100%;
  background-color: #fcf8f4;
  border-radius: 15px;
`
const LeftCardItem = styled(CardBgBase)`
  padding: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-content: center;
`
const LeftCardItemLabel = styled.span`
  font-size: 16px;
  margin-right: 10px;
  line-height: 20px;
  vertical-align: middle;
`
const LeftCardItemValue = styled.span`
  font-size: 20px;
  line-height: 20px;
  vertical-align: middle;
`
const RightCardItem = styled(CardBgBase)`
  padding: 25px;
`
const AddressItem = styled.div`
  padding: 10px 20px;
  text-align: center;
`
const AddressItemValue = styled.div`
  padding-bottom: 5px;
  line-height: 1;
  font-size: 20px;
  color: #ea9f10;
  font-weight: 700;
`
const AddressItemTitle = styled.div`
  line-height: 1;
  font-size: 14px;
  color: #666;
`
const FloatClean = styled.div`
  clear: both;
`
const ColorLine = styled.div`
  position: relative;
  height: 2px;
  background-color: #fcf8f4;
  width: 630px;
  margin-left: -50px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    margin-left: 0px;
  `};
`
const MyRowBetween = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `};
`

export default function Airdrop() {
  const { t } = useTranslation()
  //dropData 设置初始值
  const [dropData, setdropData] = useState({
    pool_weights: 0,
    recommend_weights: 0,
    user_airdrops_num: 0,
    user_airdrops_usdtPrice: 0,
    direct_push_num: 0,
    interpolated_num: 0
  })

  //访问接口获取空投个人数据
  const { account } = useWeb3React()

  //axios 封装使用
  const fetchMyAPI = useCallback(async () => {
    if (account) {
      const url = 'https://vipswap.org/api/user/detail'
      const params = { address: account }
      const response = await getAirdropUserInfoByPost(url, params)
      if (response && (response.errcode === 0 || response.errcode === '0') && response.airdropInfo) {
        const airdropInfo = response.airdropInfo
        const user_airdrops_num = airdropInfo.user_airdrops_num ?? 0
        const user_airdrops_usdtPrice = airdropInfo.user_airdrops_usdtPrice ?? 0
        airdropInfo.user_airdrops_usdtPrice = (user_airdrops_num * user_airdrops_usdtPrice).toFixed(2)
        setdropData(airdropInfo)
      } else {
        console.log(response)
      }
    }
  }, [account])
  useEffect(() => {
    fetchMyAPI()
  }, [fetchMyAPI])

  //显示资金池数据
  const [poolData, setpoolData] = useState<Array<any>>()
  useEffect(() => {
    ;(async function f() {
      const url = 'https://vipswap.org/api/user/airdropLpDetail'
      const res2 = await getAirdropRewardByGet(url)
      if (res2 && res2.airdropLpDetail) {
        setpoolData(res2.airdropLpDetail)
      }
    })()
  }, [])

  const openClaimModal = useToggleModal(ApplicationModal.ADDRESS_CLAIM)

  return (
    <Container>
      <AirdropBox>
        <AirdropTitle>{t('Airdrop_1st_title')}</AirdropTitle>
        <ColorLine></ColorLine>
        <AirdropContent>
          <ContentItemRow>
            <ContentItemLabel>{t('AirdropTimeLabel')}</ContentItemLabel>
            <ContentItemValue>{t('AirdropTimeValue_1st')}</ContentItemValue>
          </ContentItemRow>
          <ContentItemRow>
            <ContentItemLabel>{t('AirdropNumLabel')}</ContentItemLabel>
            <ContentItemValue style={{ color: '#EA9F10' }}>{t('AirdropNumValue_1st')}</ContentItemValue>
          </ContentItemRow>
          <ContentItemRow>
            <ContentItemLabel>{t('AirdropConditionsLabel')}</ContentItemLabel>
            <ContentItemValue>{t('AirdropConditions_1st')}</ContentItemValue>
          </ContentItemRow>
          <ContentItemRow>
            <ContentItemLabel>{t('AirdropLabel_4')}</ContentItemLabel>
            <ContentItemValue>{t('AirdropContent_4')}</ContentItemValue>
          </ContentItemRow>
          <ContentItemRow>
            <ContentItemLabel>{t('AirdropLabel_5')}</ContentItemLabel>
            <ContentItemValue>{t('AirdropContent_5')}</ContentItemValue>
          </ContentItemRow>
        </AirdropContent>
        <AirdropBtn onClick={openClaimModal} btnType={'able'}>
          {t('AirdropStatus_3')}
        </AirdropBtn>
        <AirdropPoolDetails airdropLpDetail={poolData} />
        <ColorLine></ColorLine>

        <MyAirdropBox>
          <LeftCard>
            {/*权重信息*/}
            <LeftCardItem>
              <CardTitle>{t('My current weights')}</CardTitle>
              <div>
                <LeftCardItemLabel>{t('Pool weights')}</LeftCardItemLabel>
                <LeftCardItemValue>{dropData['pool_weights'] ?? 0}</LeftCardItemValue>
              </div>
              <div style={{ marginTop: '5px' }}>
                <LeftCardItemLabel>{t('Recommendation weighting')}</LeftCardItemLabel>
                <LeftCardItemValue>{dropData['recommend_weights'] ?? 0}</LeftCardItemValue>
              </div>
            </LeftCardItem>
          </LeftCard>
          <LeftCard>
            {/*获得空投数*/}
            <LeftCardItem>
              <CardTitle>{t('Number of airdrops obtained')}</CardTitle>
              <div>
                <LeftCardItemValue style={{ color: '#EA9F10', fontWeight: 'bold' }}>
                  {dropData['user_airdrops_num']}
                </LeftCardItemValue>
              </div>
              <div style={{ marginTop: '5px' }}>
                <LeftCardItemLabel style={{ margin: '0px' }}>
                  {t('Worth')} {dropData['user_airdrops_usdtPrice']} USDT
                </LeftCardItemLabel>
              </div>
            </LeftCardItem>
          </LeftCard>

          {/*我的推荐*/}
          <RightCard>
            <RightCardItem>
              <MyRowBetween style={{ display: 'flex' }}>
                <RightCardTitle>{t('My Recommendations')}</RightCardTitle>
                <AddressItem>
                  <AddressItemValue>{dropData['direct_push_num']}</AddressItemValue>
                  <AddressItemTitle>{t('Number of direct push addresses')}</AddressItemTitle>
                </AddressItem>
                <AddressItem>
                  <AddressItemValue>{dropData['interpolated_num']}</AddressItemValue>
                  <AddressItemTitle>{t('Number of interpolated addresses')}</AddressItemTitle>
                </AddressItem>
              </MyRowBetween>
              {/*<CreateInviteBtn>{t('CreateInviteBtn')}</CreateInviteBtn>*/}
            </RightCardItem>
          </RightCard>
          <FloatClean></FloatClean>
        </MyAirdropBox>
      </AirdropBox>
    </Container>
  )
}
