/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
}: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your login link for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>Jaifferson</Text>
        <Heading style={h1}>Your login link</Heading>
        <Text style={text}>
          Click below to sign in to {siteName}. This link will expire shortly.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Sign In
        </Button>
        <Text style={footer}>
          If you didn't request this link, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Georgia', 'Times New Roman', serif" }
const container = { padding: '24px 28px', maxWidth: '560px', margin: '0 auto' }
const brand = { fontFamily: "'Georgia', serif", fontSize: '22px', color: '#1B3A5C', borderBottom: '1px solid #E8E4DC', paddingBottom: '16px', marginBottom: '28px' }
const h1 = { fontFamily: "'Georgia', serif", fontSize: '26px', fontWeight: 'normal' as const, color: '#1B3A5C', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#6B7280', lineHeight: '1.7', margin: '0 0 20px', fontFamily: "'Inter', Arial, sans-serif" }
const button = { backgroundColor: '#1B3A5C', color: '#F5F2EB', fontSize: '14px', borderRadius: '0px', padding: '12px 24px', textDecoration: 'none', fontFamily: "'Inter', Arial, sans-serif" }
const footer = { fontSize: '12px', color: '#9CA3AF', margin: '30px 0 0', fontFamily: "'Inter', Arial, sans-serif" }
