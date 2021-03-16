import React from 'react'
import styled from 'styled-components'

export const BodyWrapper = styled.div`
  position: relative;
  max-width: 630px;
  width: 100%;
  background: ${({ theme }) => theme.bg1};
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.05);
  border-radius: 50px;
  padding: 50px 0;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 15px;
  `};
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
