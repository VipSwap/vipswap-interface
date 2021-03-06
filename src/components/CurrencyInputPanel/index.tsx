import { Currency, Pair } from '@uniswap/sdk'
import React, { useState, useContext, useCallback } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { darken } from 'polished'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
// import { RowBetween } from '../Row'
import { TYPE } from '../../theme'
import { Input as NumericalInput } from '../NumericalInput'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'

import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background-color: ${({ selected, theme }) => (selected ? theme.bg1 : '#fff')};
  color: ${({ selected, theme }) => (selected ? theme.text1 : '#333')};
  border-radius: 19px;
  border: 1px solid #ea9f10;
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  user-select: none;
  padding: 0 0.5rem;

  :focus,
  :hover {
    background-color: ${({ selected, theme }) => (selected ? theme.bg2 : '#EA9F10')};
    color: ${({ selected, theme }) => (selected ? theme.text1 : '#fff')};
  }
  :hover svg path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : '#fff')};
  }
`

const LabelRow = styled.div<{ alignSet?: string }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  justify-content: ${({ alignSet }) => (alignSet === 'left' ? 'flex-start' : 'flex-end')};
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    justify-content: flex-start;
  `};
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : '#333')};
    stroke-width: 1.5px;
  }
`

const InputPanel = styled.div<{ hideInput?: boolean; alignSet?: string }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
  width: 45%;
  float: left;
  text-align: ${({ alignSet }) => alignSet};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%;
    text-align: left;
  `};
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg1};
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};

`

const StyledBalanceMax = styled.div`
  height: 24px;
  background-color: #ea9f10;
  border: 1px solid #ea9f10;
  border-radius: 0.5rem;
  font-size: 16px;
  text-align: center;
  line-height: 24px;
  padding: 0 10px;

  font-weight: 500;
  cursor: pointer;
  margin-left: 0.5rem;
  color: #fff;
  :hover {
    border: 1px solid #ea9f1099;
    background-color: #ea9f1099;
  }
  :focus {
    border: 1px solid ${darken(0.5, '#EA9F10')};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-left: 0.5rem;
  `};
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  customBalanceText?: string
  alignSet?: string
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  customBalanceText,
  alignSet = 'left'
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useContext(ThemeContext)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <InputPanel id={id} alignSet={alignSet}>
      <Container hideInput={hideInput}>
        <CurrencySelect
          selected={!!currency}
          className="open-currency-select-button"
          onClick={() => {
            if (!disableCurrencySelect) {
              setModalOpen(true)
            }
          }}
        >
          <Aligner>
            {pair ? (
              <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin={true} />
            ) : currency ? (
              <CurrencyLogo currency={currency} size={'24px'} />
            ) : null}
            {pair ? (
              <StyledTokenName className="pair-name-container">
                {pair?.token0.symbol}:{pair?.token1.symbol}
              </StyledTokenName>
            ) : (
              <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                {(currency && currency.symbol && currency.symbol.length > 20
                  ? currency.symbol.slice(0, 4) +
                    '...' +
                    currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                  : currency?.symbol) || t('selectToken')}
              </StyledTokenName>
            )}
            {!disableCurrencySelect && <StyledDropDown selected={!!currency} />}
          </Aligner>
        </CurrencySelect>

        {!hideInput && (
          <>
            <LabelRow alignSet={alignSet}>
              {account && (
                <TYPE.body
                  onClick={onMax}
                  color={theme.text2}
                  fontWeight={500}
                  fontSize={14}
                  style={{ display: 'inline', cursor: 'pointer' }}
                >
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? (customBalanceText ?? 'Balance: ') + selectedCurrencyBalance?.toSignificant(6)
                    : ' -'}
                </TYPE.body>
              )}
            </LabelRow>
            <LabelRow alignSet={alignSet}>
              <TYPE.body color={'#120902'} fontWeight={500} fontSize={16}>
                {label}
              </TYPE.body>
              {account && currency && showMaxButton && label !== 'To' && (
                <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
              )}
              <div style={{ height: '24px' }}></div>
            </LabelRow>
          </>
        )}
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={val => {
                  onUserInput(val)
                }}
                align={alignSet === 'left' ? 'left' : 'right'}
                fontSize={'24px'}
              />
            </>
          )}
        </InputRow>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </InputPanel>
  )
}
