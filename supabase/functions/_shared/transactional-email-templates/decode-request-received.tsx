import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface DecodeRequestReceivedProps {
  requesterEmail?: string
  targetUrl?: string
}

const SITE_NAME = 'cloarec.ai'

const DecodeRequestReceivedEmail = ({ requesterEmail, targetUrl }: DecodeRequestReceivedProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your profile request has been received</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={eyebrow}>CLOAREC.AI</Text>
        <Heading style={h1}>Profile request received</Heading>
        <Text style={text}>
          We received your decode request and queued it for review.
        </Text>

        <Section style={panel}>
          <Text style={label}>Requested for</Text>
          <Text style={value}>{requesterEmail ?? 'your email'}</Text>
          <Hr style={hr} />
          <Text style={label}>Target profile</Text>
          <Text style={value}>{targetUrl ?? 'LinkedIn or X profile URL'}</Text>
        </Section>

        <Text style={text}>
          The file will be prepared from public footprint only. If the signal is too thin,
          no dossier will be produced.
        </Text>

        <Button href="https://cloarec.ai/examples" style={button}>
          Review sample dossiers
        </Button>

        <Text style={footer}>
          Questions? Reply to hello@cloarec.ai.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: DecodeRequestReceivedEmail,
  subject: 'Your profile is being prepared',
  displayName: 'Decode request received',
  previewData: {
    requesterEmail: 'quentin@cloarec.ai',
    targetUrl: 'https://www.linkedin.com/in/example',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Inter, system-ui, sans-serif',
  margin: '0 auto',
  padding: '32px 0',
}

const container = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '0 24px',
}

const eyebrow = {
  color: 'hsl(39 49% 58%)',
  fontSize: '11px',
  letterSpacing: '0.22em',
  textTransform: 'uppercase' as const,
  margin: '0 0 16px',
}

const h1 = {
  color: 'hsl(211 56% 11%)',
  fontFamily: "Fraunces, 'Playfair Display', Georgia, serif",
  fontSize: '32px',
  fontWeight: '500',
  lineHeight: '1.1',
  margin: '0 0 18px',
}

const text = {
  color: 'hsl(211 30% 22%)',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0 0 18px',
}

const panel = {
  border: '1px solid hsl(211 30% 22% / 0.18)',
  padding: '18px 20px',
  margin: '24px 0',
}

const label = {
  color: 'hsl(36 27% 71%)',
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
  margin: '0 0 6px',
}

const value = {
  color: 'hsl(211 56% 11%)',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
}

const hr = {
  borderColor: 'hsl(211 30% 22% / 0.18)',
  margin: '14px 0',
}

const button = {
  backgroundColor: 'hsl(39 49% 58%)',
  color: 'hsl(211 56% 11%)',
  padding: '12px 18px',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  borderRadius: '0px',
  display: 'inline-block',
  margin: '8px 0 20px',
}

const footer = {
  color: 'hsl(36 27% 71%)',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '24px 0 0',
}
