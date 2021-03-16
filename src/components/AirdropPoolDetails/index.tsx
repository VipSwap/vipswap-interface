import styled from 'styled-components'

import React from 'react'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'

const PoolListRow = styled.div`
  background-color: #eee;
  border-radius: 6px;
  color: ${darken(0.5, '#EA9F10')};
  margin-top: 40px;
  margin-bottom: 40px;
  border: 1px solid #eee;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  `};
`
const ListTitle = styled.div`
  text-align: center;
  height: 70px;
  line-height: 70px;
  font-size: 24px;
  font-weight: 500;
`
const TableRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const PoolPairsTable = styled.table`
  width: 100%;
  border-spacing: 0;
`
const PoolPairsTr = styled.tr`
  border-top: 1px solid #ccc;
`
const PoolPairsTd = styled.td`
  border: none;
  text-align: center;
  padding: 10px 0;
  border-top: 1px solid #ccc;
`

interface AirdropPoolDetailsProps {
  airdropLpDetail?: Array<any>
}

export default function AirdropPoolDetails({ airdropLpDetail }: AirdropPoolDetailsProps) {
  const { t } = useTranslation()
  return (
    <PoolListRow>
      <ListTitle>{t('Reward Earnings')}</ListTitle>
      <TableRow>
        <PoolPairsTable>
          {airdropLpDetail && (
            <PoolPairsTr>
              <PoolPairsTd>{t('Pool')}</PoolPairsTd>
              <PoolPairsTd>{t('Total daily output')}</PoolPairsTd>
              <PoolPairsTd>{t('Annualized return')}</PoolPairsTd>
            </PoolPairsTr>
          )}
          {airdropLpDetail &&
            airdropLpDetail.map((v, i) => (
              <PoolPairsTr key={i}>
                <PoolPairsTd>{v.name}</PoolPairsTd>
                <PoolPairsTd>{v.dailyReward}</PoolPairsTd>
                <PoolPairsTd>{(v.rewardRate * 100).toFixed(2)}%</PoolPairsTd>
              </PoolPairsTr>
            ))}
        </PoolPairsTable>
      </TableRow>
    </PoolListRow>
  )
}
