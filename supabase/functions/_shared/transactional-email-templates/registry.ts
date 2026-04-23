/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as decodeRequestReceived } from './decode-request-received.tsx'
import { template as decodeRequestNotification } from './decode-request-notification.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'decode-request-received': decodeRequestReceived,
  'decode-request-notification': decodeRequestNotification,
}
