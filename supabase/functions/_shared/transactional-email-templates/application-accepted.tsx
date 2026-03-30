/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Jaifferson'

interface Props {
  participantName?: string
  sessionTitle?: string
  sessionDate?: string
  hostName?: string
  sessionUrl?: string
}

const ApplicationAcceptedEmail = ({ participantName, sessionTitle, sessionDate, hostName, sessionUrl }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You're in — your seat at "{sessionTitle || 'the session'}" is confirmed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>{SITE_NAME}</Text>
        <Heading style={h1}>You have a seat at the table</Heading>
        <Text style={text}>
          {participantName ? `${participantName}, your` : 'Your'} application for{' '}
          <strong>{sessionTitle || 'the session'}</strong> has been accepted
          {hostName ? ` by ${hostName}` : ''}.
        </Text>

        {sessionDate && (
          <Text style={text}>
            <strong>When:</strong> {sessionDate}
          </Text>
        )}

        <Text style={text}>
          The host will share the meeting link and details closer to the session. Come prepared — the room remembers.
        </Text>

        <Hr style={divider} />

        {sessionUrl && (
          <Button style={button} href={sessionUrl}>
            View Session
          </Button>
        )}

        <Text style={footer}>
          If you can no longer attend, please let the host know so the seat can go to someone else.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ApplicationAcceptedEmail,
  subject: (data: Record<string, any>) =>
    `You're in — ${data?.sessionTitle || 'your session'} is confirmed`,
  displayName: 'Application accepted (participant notification)',
  previewData: {
    participantName: 'Marie',
    sessionTitle: 'The Future of AI in Venture Building',
    sessionDate: 'Saturday, April 12, 2026 · 19:00',
    hostName: 'Quentin',
    sessionUrl: 'https://jaifferson.lovable.app/session/abc123',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Georgia', 'Times New Roman', serif" }
const container = { padding: '24px 28px', maxWidth: '560px', margin: '0 auto' }
const brand = { fontFamily: "'Georgia', serif", fontSize: '22px', color: '#1B3A5C', borderBottom: '1px solid #E8E4DC', paddingBottom: '16px', marginBottom: '28px' }
const h1 = { fontFamily: "'Georgia', serif", fontSize: '24px', fontWeight: 'normal' as const, color: '#1B3A5C', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#6B7280', lineHeight: '1.7', margin: '0 0 20px', fontFamily: "'Inter', Arial, sans-serif" }
const divider = { borderColor: '#E8E4DC', margin: '28px 0' }
const button = { backgroundColor: '#1B3A5C', color: '#F5F2EB', fontSize: '14px', borderRadius: '0px', padding: '12px 24px', textDecoration: 'none', fontFamily: "'Inter', Arial, sans-serif" }
const footer = { fontSize: '12px', color: '#9CA3AF', margin: '24px 0 0', fontFamily: "'Inter', Arial, sans-serif" }
