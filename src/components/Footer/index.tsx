import React from 'react'
import { useTranslation } from 'react-i18next'

import styled from 'styled-components'
import { ExternalLink } from '../../theme'

const FooterFrame = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  flex: 1;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    margin-bottom: 60px;
  `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
     margin-bottom: 60px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
    margin-bottom: 60px;
  `}
`
const MenuDiv = styled.div`
  color: ${({ theme }) => theme.text2};
  font-weight: 500;
`
const MenuItem = styled(ExternalLink)`
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
`
const PaddingDiv = styled.div`
  width: 10px;
  height: auto;
`
const FooterItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export default function Footer() {
  const { t } = useTranslation()

  return (
    <FooterFrame>
      <FooterItem>
        <MenuDiv>{t('White Paper')}(</MenuDiv>
        <MenuItem id="link" href="https://vipswap.org/whitepaper/VipSwap-Economic-Whitepaper-1.0-en.pdf">
          {t('English')}/
        </MenuItem>
        <MenuItem id="link" href="https://vipswap.org/whitepaper/VipSwap-Economic-Whitepaper-1.0-en.pdf">
          {t('Chinese')})
        </MenuItem>
      </FooterItem>
      <PaddingDiv></PaddingDiv>
      <FooterItem>
        <MenuDiv>{t('Audit Report')}(</MenuDiv>
        <MenuItem id="link" href="https://vipswap.org/VIPSmartContractAuditReport/en.pdf">
          {t('English')}/
        </MenuItem>
        <MenuItem id="link" href="https://vipswap.org/VIPSmartContractAuditReport/zh.pdf">
          {t('Chinese')})
        </MenuItem>
      </FooterItem>
    </FooterFrame>
  )
}
